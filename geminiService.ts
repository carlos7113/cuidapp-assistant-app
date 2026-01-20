
import { GoogleGenAI, Type, Modality } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Use process.env.API_KEY directly for initialization as per GenAI guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // General Chat with Search Grounding
  async chatWithSearch(prompt: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Cuida, a helpful senior care assistant. Provide accurate, empathetic advice using up-to-date information."
      }
    });
    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  // Maps Grounding for finding places
  async findNearbyServices(query: string, lat?: number, lng?: number) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: lat && lng ? {
            latLng: { latitude: lat, longitude: lng }
          } : undefined
        }
      }
    });
    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  // Image Analysis
  async analyzeImage(prompt: string, base64Image: string, mimeType: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Image, mimeType } }
        ]
      }
    });
    return response.text;
  }

  // Thinking Mode for complex health reasoning
  async complexHealthReasoning(query: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  }

  // TTS
  async generateSpeech(text: string): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }
}

export const gemini = new GeminiService();
