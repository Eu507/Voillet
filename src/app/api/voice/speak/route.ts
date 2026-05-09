import { NextResponse } from "next/server";
import { z } from "zod";

import {
  isElevenLabsConfigured,
  synthesizeSpeech,
} from "@/core/voice/elevenlabs";

export const runtime = "nodejs";

const speakSchema = z.object({
  text: z.string().min(1).max(1200),
});

export async function POST(request: Request) {
  if (!isElevenLabsConfigured()) {
    return NextResponse.json(
      {
        error: "ELEVENLABS_API_KEY is missing. Voice output has fallen back to text mode.",
      },
      { status: 503 },
    );
  }

  try {
    const payload = speakSchema.parse(await request.json());
    const audioStream = await synthesizeSpeech(payload.text);

    return new Response(audioStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Voice output failed. Text mode is still available.",
      },
      { status: 500 },
    );
  }
}
