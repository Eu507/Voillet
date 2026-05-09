// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/voice/elevenlabs", () => ({
  isElevenLabsConfigured: vi.fn(),
  transcribeAudioFile: vi.fn(),
}));

import {
  isElevenLabsConfigured,
  transcribeAudioFile,
} from "@/core/voice/elevenlabs";
import { POST } from "@/app/api/voice/transcribe/route";

describe("POST /api/voice/transcribe", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 503 when ElevenLabs is unavailable", async () => {
    vi.mocked(isElevenLabsConfigured).mockReturnValue(false);

    const request = new Request("http://localhost/api/voice/transcribe", {
      method: "POST",
      body: new FormData(),
    });
    const response = await POST(request);

    expect(response.status).toBe(503);
  });

  it("returns a transcript when voice input succeeds", async () => {
    vi.mocked(isElevenLabsConfigured).mockReturnValue(true);
    vi.mocked(transcribeAudioFile).mockResolvedValue("show my recent activity");

    const formData = new FormData();
    formData.append(
      "audio",
      new File(["voice"], "voice-input.webm", { type: "audio/webm" }),
    );

    const request = new Request("http://localhost/api/voice/transcribe", {
      method: "POST",
      body: formData,
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.transcript).toBe("show my recent activity");
  });
});
