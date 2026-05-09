import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

import {
  getElevenLabsSttModel,
  getElevenLabsTtsModel,
  getElevenLabsVoiceId,
} from "@/core/utils/env";

let elevenLabsClient: ElevenLabsClient | null = null;

export function isElevenLabsConfigured(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}

function getElevenLabsClient(): ElevenLabsClient {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured.");
  }

  if (!elevenLabsClient) {
    elevenLabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }

  return elevenLabsClient;
}

export async function transcribeAudioFile(
  file: File,
  languageCode?: string,
): Promise<string> {
  const response = await getElevenLabsClient().speechToText.convert({
    file,
    languageCode,
    modelId: getElevenLabsSttModel() as never,
  });

  return response.text.trim();
}

export async function synthesizeSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
  return getElevenLabsClient().textToSpeech.convert(getElevenLabsVoiceId(), {
    text,
    modelId: getElevenLabsTtsModel() as never,
  });
}
