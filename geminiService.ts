
import { GoogleGenAI, Type } from "@google/genai";
import { TaskLog, AnalysisResult } from "../types";

// --- CONFIGURATION ---
// 1. YOUR GOOGLE SHEET URL (Backend)
const API_URL = "https://script.google.com/macros/s/AKfycbyAzmU_N4aL0X8VSLv8crlB7ftWXU5hmzNlyH3W1LhnRtusEzoV7HEBQp_9C9Z-oReqbg/exec";

// --- FUNCTION 1: SAVE TO SHEET (The Database Connection) ---
export const sendToSheet = async (data: any) => {
  console.log("Sending to Sheet:", data);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain", // Crucial for Google Apps Script
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Sheet Response:", result);
    return result;
  } catch (error) {
    console.error("Sheet Error:", error);
    return { status: "error", message: "Failed to connect to Database" };
  }
};


// --- FUNCTION 2: ANALYZE TEAM (The AI Brain) ---
export const analyzeTeamPerformance = async (logs: TaskLog[]): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    Analyze these team logs for MNJ & SCF (Telecalling, Web Dev, Blogs, Social Media).
    Data: ${JSON.stringify(logs)}
    Evaluate: Volume, Distribution, and Bottlenecks.
    Provide a professional management analysis in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { 
              type: Type.STRING,
              description: "A summary of the team's performance."
            },
            productivityGaps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Identified productivity gaps."
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable recommendations for the manager."
            }
          },
          required: ["summary", "productivityGaps", "recommendations"]
        }
      }
    });

    const resultText = response.text; 
    if (!resultText) throw new Error("Empty AI Response");
    
    return JSON.parse(resultText);

  } catch (error) {
    console.error("AI Error:", error);
    return {
      summary: "AI Analysis unavailable due to a configuration or processing error.",
      productivityGaps: ["Unable to fetch real-time data analysis."],
      recommendations: ["Review manual logs until AI services are restored."]
    };
  }
};
