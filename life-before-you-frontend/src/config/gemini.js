import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: "AIzaSyD_8jA2npLjh2wclA8QTM9FcZRYBi28UoA" });

async function SendPrompt(name, age, gender) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a past life prophecy for a person named ${name}, who has an average age of ${age} and is of gender ${gender}. Keep the text short. Around 150 words is perfect. Keep it short and brief`,
  });

  return response;
}

export default SendPrompt;
