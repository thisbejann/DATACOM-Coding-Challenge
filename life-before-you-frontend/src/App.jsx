import { useState } from "react";
import "./App.css";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./Components/ui/card";
import { Label } from "./Components/ui/label";
import SendPrompt from "./config/gemini";

function App() {
  const [name, setName] = useState("");
  const [personInfo, setPersonInfo] = useState(null);
  const [prophecy, setProphecy] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const fetchPastLife = async () => {
    setLoading(true);
    setPersonInfo(null);
    setProphecy(null);

    try {
      const response = await fetch(`https://localhost:7221/api/person/${name}`);
      const data = await response.json();

      setPersonInfo(data);
      const geminiResponse = await SendPrompt(data.name, data.age, data.gender);

      const generatedText = geminiResponse.candidates[0].content.parts[0].text;
      setProphecy(generatedText);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setPersonInfo({ error: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 p-4">
      <Card className="w-full max-w-lg bg-neutral-900 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-bold tracking-tight">
            Life before You 🔮
          </CardTitle>
          <CardDescription className="text-center text-sm text-neutral-400 mt-2">
            Uncover your hidden past and reveal a prophecy of your former self.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neutral-300">
              Enter your name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={handleInputChange}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
            />
          </div>
          <Button
            onClick={fetchPastLife}
            disabled={loading || !name}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Searching the cosmos... 🌌</span>
            ) : (
              "Reveal My Past Life"
            )}
          </Button>

          {personInfo && !loading && (
            <div className="space-y-4 pt-4 border-t border-neutral-700 mt-4">
              {personInfo.error ? (
                <p className="text-red-500 text-center font-medium">{personInfo.error}</p>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center text-blue-400">Your Past Life</h2>

                  {prophecy && (
                    <Card className="mt-4 py-2 bg-neutral-800 border-neutral-700">
                      <CardContent className="p-4 text-neutral-300 text-base italic">
                        <div className="space-y-2 text-neutral-300 text-center mb-4">
                          <p>
                            <strong>Name:</strong> {personInfo.name}
                          </p>
                          <p>
                            <strong>Age:</strong> {personInfo.age}
                          </p>
                          <p>
                            <strong>Gender:</strong>{" "}
                            <span className="capitalize">{personInfo.gender}</span>
                          </p>
                        </div>
                        <div className="text-center">&quot;{prophecy}&quot;</div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
