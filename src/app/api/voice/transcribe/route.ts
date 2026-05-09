import { NextResponse } from "next/server";

import {
  isElevenLabsConfigured,
  transcribeAudioFile,
} from "@/core/voice/elevenlabs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isElevenLabsConfigured()) {
    return NextResponse.json(
      {
        error: "ELEVENLABS_API_KEY is missing. Voice input has fallen back to text mode.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const languageCode = formData.get("languageCode");

    if (!(audioFile instanceof File)) {
      return NextResponse.json(
        {
          error: "No audio file was provided for transcription.",
        },
        { status: 400 },
      );
    }

    const transcript = await transcribeAudioFile(
      audioFile,
      typeof languageCode === "string" ? languageCode : undefined,
    );

    return NextResponse.json({ transcript });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Voice transcription failed. Text mode is still available.",
      },
      { status: 500 },
    );
  }
}
