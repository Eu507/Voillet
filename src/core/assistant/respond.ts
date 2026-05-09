import type {
  AssistantRequest,
  AssistantResponse,
  AssistantUiAction,
} from "@/core/types/assistant";
import type { ActivityItem, WalletSummary } from "@/core/types/wallet";
import { detectAssistantIntent } from "@/core/assistant/intents";
import { formatAddress, formatRelativeTime } from "@/core/utils/format";

function buildActivityLine(activity: ActivityItem): string {
  const when = formatRelativeTime(activity.timestamp);
  const amount = activity.amount ? ` for ${activity.amount}` : "";

  return `${activity.kind} ${when}${amount}`;
}

function buildUiAction(href: string, label: string): AssistantUiAction {
  return {
    type: "navigate",
    href,
    label,
  };
}

function buildUnsupportedResponse(summary?: WalletSummary): AssistantResponse {
  if (!summary) {
    return {
      intent: "unsupported",
      confidence: 0.42,
      message:
        "Connect a wallet first and then ask me about your balance, recent activity, receive address, or active network.",
      spokenText:
        "Connect a wallet first. Then ask me about your balance, recent activity, receive address, or network.",
      referencedData: {},
    };
  }

  return {
    intent: "unsupported",
    confidence: 0.42,
    message:
      "I can help with your SOL balance, token balances, recent activity, network status, and your receive address. Try asking “What’s my balance?” or “Show my recent activity.”",
    spokenText:
      "I can help with your balance, token balances, recent activity, network, and receive address.",
    referencedData: {
      address: summary.address,
      network: summary.network,
    },
  };
}

export function buildAssistantResponse(
  request: AssistantRequest,
  summary?: WalletSummary,
): AssistantResponse {
  if (!summary && !request.walletAddress) {
    return buildUnsupportedResponse();
  }

  const intentMatch = detectAssistantIntent(request.transcript, summary);

  if (!summary) {
    return buildUnsupportedResponse();
  }

  switch (intentMatch.intent) {
    case "balance_overview":
      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: `Your wallet currently holds ${summary.solBalance.formattedAmount} SOL and ${summary.assets.length} tracked token positions.`,
        spokenText: `You currently have ${summary.solBalance.formattedAmount} SOL and ${summary.assets.length} token positions.`,
        referencedData: {
          solBalance: summary.solBalance,
          assets: summary.assets,
        },
      };

    case "token_balance":
      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: intentMatch.matchedAsset
          ? `You hold ${intentMatch.matchedAsset.formattedAmount} ${intentMatch.matchedAsset.symbol}.`
          : "I could not match that token yet, but your dashboard asset list is already in sync with the connected wallet.",
        spokenText: intentMatch.matchedAsset
          ? `You hold ${intentMatch.matchedAsset.formattedAmount} ${intentMatch.matchedAsset.symbol}.`
          : "I could not match that token yet.",
        referencedData: {
          asset: intentMatch.matchedAsset,
          assets: summary.assets,
        },
      };

    case "recent_activity":
      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: summary.activityPreview.length
          ? `Your latest wallet activity includes ${summary.activityPreview
              .slice(0, 3)
              .map(buildActivityLine)
              .join(", ")}.`
          : "I could not find recent wallet activity yet on this network.",
        spokenText: summary.activityPreview.length
          ? `Your latest activity includes ${summary.activityPreview
              .slice(0, 2)
              .map(buildActivityLine)
              .join(", ")}.`
          : "I could not find recent wallet activity yet.",
        referencedData: {
          activityPreview: summary.activityPreview,
        },
        uiAction: buildUiAction("/activity", "Open activity"),
      };

    case "wallet_address":
      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: `Your receive address is ${summary.address}.`,
        spokenText: `Your wallet address starts with ${summary.address.slice(
          0,
          4,
        )} and ends with ${summary.address.slice(-4)}.`,
        referencedData: {
          address: summary.address,
        },
        uiAction: buildUiAction("/receive", "Open receive"),
      };

    case "receive_help":
      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: `Open the Receive screen to copy or share ${formatAddress(
          summary.address,
        )} and display its QR code.`,
        spokenText:
          "Open the receive screen to copy your wallet address or show the QR code.",
        referencedData: {
          address: summary.address,
        },
        uiAction: buildUiAction("/receive", "Go to receive"),
      };

    case "network_status":
      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: `Voillet is currently reading from ${summary.network}. This setting controls both the wallet context and the explorer links.`,
        spokenText: `Voillet is currently using ${summary.network}.`,
        referencedData: {
          network: summary.network,
        },
        uiAction: buildUiAction("/settings", "Open settings"),
      };

    case "portfolio_explain": {
      const topAsset = summary.assets[0];
      const topAssetMessage = topAsset
        ? `Your largest tracked token position is ${topAsset.formattedAmount} ${topAsset.symbol}.`
        : "You do not have tracked SPL token balances beyond SOL yet.";

      return {
        intent: intentMatch.intent,
        confidence: intentMatch.confidence,
        message: `${topAssetMessage} Combined with ${summary.solBalance.formattedAmount} SOL, this wallet looks ready for a simple Solana demo flow.`,
        spokenText: `${topAssetMessage} You also have ${summary.solBalance.formattedAmount} SOL.`,
        referencedData: {
          solBalance: summary.solBalance,
          assets: summary.assets,
        },
      };
    }

    case "unsupported":
    default:
      return buildUnsupportedResponse(summary);
  }
}
