
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Defensive initialization: disable AI silently if key is missing
const _apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!_apiKey) {
  console.warn('VITE_GEMINI_API_KEY no encontrada. IA desactivada.');
}

export class GeminiService {
  private ai: GoogleGenAI | null;

  constructor() {
    this.ai = _apiKey ? new GoogleGenAI({ apiKey: _apiKey }) : null;
  }

  // General Chat with Search Grounding
  async chatWithSearch(prompt: string) {
    if (!this.ai) return { text: 'IA no disponible (sin API Key).', grounding: [] };
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
    if (!this.ai) return { text: 'IA no disponible (sin API Key).', grounding: [] };
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
    if (!this.ai) return 'IA no disponible (sin API Key).';
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
    if (!this.ai) return 'IA no disponible (sin API Key).';
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
    if (!this.ai) return undefined;
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
