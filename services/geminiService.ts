
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBUNeSCIElWow6Suj_g2OQBeySFOCVpDhc" });

export const analyzeEmailTones = async (emails: { subject: string; message: string }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the tone and professional quality of these ${emails.length} emails. Return a JSON array of objects with an 'id' (index), 'score' (0-100), and a short 'suggestion' (max 10 words). Emails: ${JSON.stringify(emails)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              score: { type: Type.NUMBER },
              suggestion: { type: Type.STRING },
            },
            required: ["id", "score", "suggestion"],
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [];
  }
};
