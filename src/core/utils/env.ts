import type { WalletNetwork } from "@/core/types/wallet";

const DEFAULT_NETWORK: WalletNetwork = "devnet";

export function getWalletNetwork(): WalletNetwork {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

  if (network === "mainnet-beta" || network === "devnet") {
    return network;
  }

  return DEFAULT_NETWORK;
}

export function getRpcUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim() || undefined;
}

export function isVoiceEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_VOICE !== "false";
}

export function getElevenLabsVoiceId(): string {
  return process.env.ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";
}

export function getElevenLabsTtsModel(): string {
  return process.env.ELEVENLABS_TTS_MODEL || "eleven_multilingual_v2";
}

export function getElevenLabsSttModel(): string {
  return process.env.ELEVENLABS_STT_MODEL || "scribe_v1";
}
