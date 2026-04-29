import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const voiceMap: Record<string, string> = {
  'voice-peach': 'Kore',
  'voice-sister': 'Charon',
  'voice-loli': 'Puck',
  'voice-boy': 'Zephyr',
};

export async function generateSpeech(text: string, voiceId: string): Promise<string | null> {
  try {
    const voiceName = voiceMap[voiceId] || 'Kore';

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("Failed to generate speech:", error);
    return null;
  }
}

export function playPCMAudio(base64Data: string, sampleRate = 24000) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    // Convert 16-bit PCM to Float32
    const float32Array = new Float32Array(bytes.length / 2);
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < float32Array.length; i++) {
        const int16 = dataView.getInt16(i * 2, true); // Little-endian
        float32Array[i] = int16 / 32768.0;
    }
    
    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);
    
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (error) {
    console.error("Failed to play PCM audio:", error);
  }
}

