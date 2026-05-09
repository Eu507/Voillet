export type WalletNetwork = "devnet" | "mainnet-beta";

export interface SolBalance {
  rawLamports: string;
  formattedAmount: string;
}

export interface AssetBalance {
  mint: string;
  symbol: string;
  name: string;
  rawAmount: string;
  formattedAmount: string;
  logoUrl?: string;
  isNative: boolean;
}

export type ActivityKind =
  | "received"
  | "sent"
  | "swap"
  | "other"
  | "unknown";

export type ActivityStatus = "confirmed" | "pending" | "failed" | "unknown";

export interface ActivityItem {
  signature: string;
  kind: ActivityKind;
  status: ActivityStatus;
  timestamp: number | null;
  amount?: string;
  symbol?: string;
  explorerUrl: string;
}

export interface WalletSummary {
  address: string;
  network: WalletNetwork;
  solBalance: SolBalance;
  assets: AssetBalance[];
  activityPreview: ActivityItem[];
}
