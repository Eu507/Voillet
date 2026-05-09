import type { AssistantIntent } from "@/core/types/assistant";
import type { AssetBalance, WalletSummary } from "@/core/types/wallet";

export interface IntentMatch {
  intent: AssistantIntent;
  confidence: number;
  matchedAsset?: AssetBalance;
}

function includesAny(transcript: string, keywords: string[]): boolean {
  return keywords.some((keyword) => transcript.includes(keyword));
}

function findMatchingAsset(
  transcript: string,
  summary?: WalletSummary,
): AssetBalance | undefined {
  return summary?.assets.find((asset) => {
    const haystack = `${asset.symbol} ${asset.name} ${asset.mint}`.toLowerCase();
    return haystack.split(" ").some((fragment) => transcript.includes(fragment));
  });
}

export function detectAssistantIntent(
  transcript: string,
  summary?: WalletSummary,
): IntentMatch {
  const normalizedTranscript = transcript.toLowerCase();
  const matchedAsset = findMatchingAsset(normalizedTranscript, summary);

  if (
    includesAny(normalizedTranscript, [
      "receive",
      "receber",
      "deposit",
      "address",
      "endereco",
      "endereço",
      "qr",
    ])
  ) {
    return {
      intent: includesAny(normalizedTranscript, ["address", "endereco", "endereço"])
        ? "wallet_address"
        : "receive_help",
      confidence: 0.95,
    };
  }

  if (
    includesAny(normalizedTranscript, [
      "network",
      "rede",
      "cluster",
      "rpc",
      "devnet",
      "mainnet",
    ])
  ) {
    return { intent: "network_status", confidence: 0.94 };
  }

  if (
    includesAny(normalizedTranscript, [
      "activity",
      "history",
      "transactions",
      "historico",
      "histórico",
      "transacoes",
      "transações",
      "sent recently",
    ])
  ) {
    return { intent: "recent_activity", confidence: 0.91 };
  }

  if (
    matchedAsset &&
    includesAny(normalizedTranscript, [
      "balance",
      "saldo",
      "how much",
      "quanto",
      "hold",
      "tenho",
    ])
  ) {
    return { intent: "token_balance", confidence: 0.9, matchedAsset };
  }

  if (
    includesAny(normalizedTranscript, [
      "portfolio",
      "allocation",
      "positions",
      "carteira",
      "assets",
      "holdings",
      "diversified",
    ])
  ) {
    return { intent: "portfolio_explain", confidence: 0.84 };
  }

  if (
    includesAny(normalizedTranscript, [
      "balance",
      "saldo",
      "worth",
      "total",
      "sol",
      "funds",
    ])
  ) {
    return { intent: "balance_overview", confidence: 0.9 };
  }

  return { intent: "unsupported", confidence: 0.42 };
}
