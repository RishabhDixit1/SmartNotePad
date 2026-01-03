
import { GoogleGenAI } from "@google/genai";
import { AIAction } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const processNoteWithAI = async (content: string, action: AIAction): Promise<string> => {
  if (!content || content.trim().length < 5) {
    throw new Error("Please write a bit more before using AI features.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  switch (action) {
    case 'summarize':
      prompt = `Provide a concise summary of the following text in bullet points:\n\n${content}`;
      break;
    case 'refine':
      prompt = `Fix any grammar mistakes and improve the professional tone of the following text while keeping the original meaning:\n\n${content}`;
      break;
    case 'brainstorm':
      prompt = `Based on the following notes, suggest 5 creative ideas or next steps:\n\n${content}`;
      break;
    case 'translate':
      prompt = `Translate the following text to Spanish while maintaining a natural tone:\n\n${content}`;
      break;
    case 'shorter':
      prompt = `Make this text significantly shorter and more punchy without losing the core message:\n\n${content}`;
      break;
    case 'longer':
      prompt = `Expand on the following thoughts, adding more detail and context to make it a more comprehensive note:\n\n${content}`;
      break;
    default:
      prompt = content;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the AI service. Please check your connection.");
  }
};

export const generateTitle = async (content: string): Promise<string> => {
  if (!content || content.trim().length < 10) return "New Note";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Suggest a short, 3-5 word title for this note:\n\n${content}`,
      config: {
        maxOutputTokens: 20,
      }
    });
    return response.text?.replace(/"/g, '').trim() || "Untitled Note";
  } catch {
    return "New Note";
  }
};
