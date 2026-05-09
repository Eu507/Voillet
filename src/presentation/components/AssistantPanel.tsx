"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type MutableRefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import type { AssistantResponse } from "@/core/types/assistant";
import { useWalletData } from "@/core/hooks/WalletDataContext";
import { isVoiceEnabled } from "@/core/utils/env";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  action?: AssistantResponse["uiAction"];
}

interface AssistantPanelProps {
  onRequestNavigate?: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "intro",
  role: "assistant",
  text: "Ask about your balance, recent activity, receive address, or active network. Voice mode is available when microphone access works.",
};

function stopStreamTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

async function playSpeechWithFallback(text: string) {
  try {
    const response = await fetch("/api/voice/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Voice output is currently unavailable.");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    await audio.play();
    audio.onended = () => URL.revokeObjectURL(audioUrl);
  } catch {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  }
}

export function AssistantPanel({ onRequestNavigate }: AssistantPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { summary } = useWalletData();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  function pushMessage(message: ChatMessage) {
    setMessages((currentMessages) => [...currentMessages, message]);
  }

  async function sendPrompt(transcript: string, mode: "text" | "voice") {
    if (!transcript.trim()) {
      return;
    }

    pushMessage({
      id: crypto.randomUUID(),
      role: "user",
      text: transcript.trim(),
    });
    setIsBusy(true);
    setError(null);
    setInput("");

    try {
      const response = await fetch("/api/assistant/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          transcript,
          walletAddress: summary?.address,
          routeContext: pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("The assistant could not answer right now.");
      }

      const payload = (await response.json()) as AssistantResponse;

      pushMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        text: payload.message,
        action: payload.uiAction,
      });

      if (mode === "voice") {
        await playSpeechWithFallback(payload.spokenText);
      }
    } catch (sendError) {
      const message =
        sendError instanceof Error
          ? sendError.message
          : "The assistant could not answer right now.";

      setError(message);
      pushMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        text: `${message} You can keep using text mode while voice services recover.`,
      });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendPrompt(input, "text");
  }

  async function handleTranscription(
    streamRefObject: MutableRefObject<MediaStream | null>,
  ) {
    try {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const audioFile = new File([audioBlob], "voice-input.webm", {
        type: "audio/webm",
      });
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Voice transcription is unavailable. Try typing instead.");
      }

      const payload = (await response.json()) as { transcript: string };
      await sendPrompt(payload.transcript, "voice");
    } catch (transcribeError) {
      const message =
        transcribeError instanceof Error
          ? transcribeError.message
          : "Voice transcription is unavailable.";

      setError(message);
      pushMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        text: `${message} The chat is still live in text mode.`,
      });
    } finally {
      chunksRef.current = [];
      stopStreamTracks(streamRefObject.current);
      streamRefObject.current = null;
    }
  }

  async function toggleRecording() {
    if (!isVoiceEnabled()) {
      setError("Voice mode is disabled in the current environment.");
      return;
    }

    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser does not support microphone capture for Voillet.");
      return;
    }

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      setError(null);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        void handleTranscription(streamRef);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone permission was denied or unavailable.");
      stopStreamTracks(streamRef.current);
      streamRef.current = null;
    }
  }

  function handleActionClick(action: AssistantResponse["uiAction"]) {
    if (!action) {
      return;
    }

    router.push(action.href);
    onRequestNavigate?.();
  }

  return (
    <section className="assistant-panel">
      <div className="assistant-panel__header">
        <div>
          <p className="eyebrow">Voice assistant</p>
          <h2 className="panel-title">Voillet guide</h2>
        </div>

        <span className={`pill ${isRecording ? "pill--voice" : "pill--network"}`}>
          {isRecording ? "listening" : "read-only"}
        </span>
      </div>

      <div className="assistant-panel__messages">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`chat-bubble chat-bubble--${message.role}`}
          >
            <p>{message.text}</p>
            {message.action ? (
              <button
                type="button"
                className="text-link text-link--button"
                onClick={() => handleActionClick(message.action)}
              >
                {message.action.label}
              </button>
            ) : null}
          </article>
        ))}
      </div>

      {error ? <p className="inline-error">{error}</p> : null}

      <form className="assistant-panel__composer" onSubmit={handleSubmit}>
        <textarea
          className="input-shell input-shell--textarea"
          rows={3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about balance, activity, network, or receive address..."
        />

        <div className="assistant-panel__actions">
          <button
            type="button"
            className={`button-secondary ${isRecording ? "button-secondary--active" : ""}`}
            onClick={() => void toggleRecording()}
          >
            {isRecording ? "Stop mic" : "Use mic"}
          </button>

          <button
            type="submit"
            className="button-primary"
            disabled={isBusy || !input.trim()}
          >
            {isBusy ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
}
