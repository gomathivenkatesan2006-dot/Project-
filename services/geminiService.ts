
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeLogEntry = async (logContent: string): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following network log or packet data for malicious activity: \n\n${logContent}`,
    config: {
      systemInstruction: "You are a senior cybersecurity analyst. Analyze network logs and return structured JSON. Identify if the activity is benign or malicious (DDoS, Brute Force, SQLi, etc.). Be precise and concise.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          threatLevel: {
            type: Type.STRING,
            description: "The calculated threat level: INFO, LOW, MEDIUM, HIGH, or CRITICAL.",
          },
          classification: {
            type: Type.STRING,
            description: "The specific type of attack or activity found (e.g., 'SYN Flood', 'Credential Stuffing').",
          },
          description: {
            type: Type.STRING,
            description: "A short technical summary of what was detected.",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0 to 1.",
          },
          recommendation: {
            type: Type.STRING,
            description: "Actionable remediation steps for the SOC team.",
          },
          affectedAssets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of IP addresses or hostnames targeted.",
          },
        },
        required: ["threatLevel", "classification", "description", "confidence", "recommendation", "affectedAssets"]
      },
    },
  });

  try {
    return JSON.parse(response.text.trim()) as AIAnalysisResult;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to process AI analysis.");
  }
};
