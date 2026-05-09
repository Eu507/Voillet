import type { WalletSummary } from "@/core/types/wallet";

export type AssistantMode = "text" | "voice";

export type AssistantIntent =
  | "balance_overview"
  | "token_balance"
  | "recent_activity"
  | "wallet_address"
  | "receive_help"
  | "network_status"
  | "portfolio_explain"
  | "unsupported";

export interface AssistantRequest {
  mode: AssistantMode;
  transcript: string;
  walletAddress?: string;
  routeContext?: string;
}

export interface AssistantUiAction {
  type: "navigate";
  href: string;
  label: string;
}

export interface AssistantResponse {
  message: string;
  spokenText: string;
  intent: AssistantIntent;
  confidence: number;
  referencedData: Partial<WalletSummary> | Record<string, unknown>;
  uiAction?: AssistantUiAction;
}
