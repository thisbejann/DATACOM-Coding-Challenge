using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

builder.Services.AddHttpClient("AgifyClient", httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.agify.io/");
});
builder.Services.AddHttpClient("GenderizeClient", httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.genderize.io/");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();

app.MapGet("/api/person/{name}", async (string name, IHttpClientFactory httpClientFactory, ILogger<Program> logger, IMemoryCache cache) =>
{
    var agifyClient = httpClientFactory.CreateClient("AgifyClient");
    var genderizeClient = httpClientFactory.CreateClient("GenderizeClient");

    try
    {
        if (cache.TryGetValue(name, out PersonInfo? cachedPersonInfo))
        {
            return Results.Ok(cachedPersonInfo);
        }

        var agifyGet = agifyClient.GetAsync($"?name={name}");
        var genderizeGet = genderizeClient.GetAsync($"?name={name}");

        await Task.WhenAll(agifyGet, genderizeGet);

        if (!agifyGet.Result.IsSuccessStatusCode)
        {
            logger.LogError("Agify API call failed with status code: {StatusCode}. Response: {Response}", agifyGet.Result.StatusCode, await agifyGet.Result.Content.ReadAsStringAsync());
            return Results.BadRequest("Could not retrieve age data. Please try again later.");
        }

        if (!genderizeGet.Result.IsSuccessStatusCode)
        {
            logger.LogError("Genderize API call failed with status code: {StatusCode}. Response: {Response}", genderizeGet.Result.StatusCode, await genderizeGet.Result.Content.ReadAsStringAsync());
            return Results.BadRequest("Could not retrieve gender data. Please try again later.");
        }

        var agifyContent = await agifyGet.Result.Content.ReadAsStringAsync();
        var genderizeContent = await genderizeGet.Result.Content.ReadAsStringAsync();

        var agifyData = JsonSerializer.Deserialize<AgifyResponse>(agifyContent);
        var genderizeData = JsonSerializer.Deserialize<GenderizeResponse>(genderizeContent);

        var personInfo = new PersonInfo
        {
            Name = agifyData?.name ?? name,
            Age = agifyData?.age,
            Gender = genderizeData?.gender
        };

        var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(1));
        cache.Set(name, personInfo, cacheEntryOptions);

        return Results.Ok(personInfo);
    }
    catch (HttpRequestException)
    {
        return Results.Problem("A network error occurred. Please check your connection or try again later.");
    }
});

app.Run();

public class AgifyResponse
{
    public int count { get; set; }
    public string? name { get; set; }
    public int? age { get; set; } // Changed to int? to handle null gracefully
}

public class GenderizeResponse
{
    public int count { get; set; }
    public string? name { get; set; }
    public string? gender { get; set; }
    public float probability { get; set; }
}