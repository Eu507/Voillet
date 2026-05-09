import { PublicKey } from "@solana/web3.js";

import type { AssetBalance, WalletNetwork, WalletSummary } from "@/core/types/wallet";
import { getWalletActivity } from "@/core/solana/activity";
import {
  SPL_TOKEN_PROGRAM_ID,
  getSolanaConnection,
} from "@/core/solana/connection";
import { formatSol, formatTokenAmount } from "@/core/utils/format";

const KNOWN_TOKEN_LABELS: Record<string, { symbol: string; name: string }> = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: "USDC",
    name: "USD Coin",
  },
  Es9vMFrzaCERmJfrF4H2ZPq9VHtV6fRvWmvMRdqg1Y7T: {
    symbol: "USDT",
    name: "Tether USD",
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6fFbbqNKG5nNz3Yh: {
    symbol: "BONK",
    name: "Bonk",
  },
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: {
    symbol: "JUP",
    name: "Jupiter",
  },
  So11111111111111111111111111111111111111112: {
    symbol: "wSOL",
    name: "Wrapped SOL",
  },
};

function resolveTokenLabel(mint: string): { symbol: string; name: string } {
  const knownToken = KNOWN_TOKEN_LABELS[mint];

  if (knownToken) {
    return knownToken;
  }

  return {
    symbol: mint.slice(0, 4).toUpperCase(),
    name: `Token ${mint.slice(0, 4)}`,
  };
}

function normalizeAssetBalances(tokenAccounts: Awaited<
  ReturnType<ReturnType<typeof getSolanaConnection>["getParsedTokenAccountsByOwner"]>
>["value"]): AssetBalance[] {
  const assets: AssetBalance[] = [];

  for (const { account } of tokenAccounts) {
    const parsedInfo = account.data.parsed.info;
    const mint = parsedInfo.mint as string;
    const tokenAmount = parsedInfo.tokenAmount;
    const uiAmount = Number(tokenAmount.uiAmountString ?? tokenAmount.uiAmount ?? 0);

    if (!uiAmount) {
      continue;
    }

    const label = resolveTokenLabel(mint);

    assets.push({
      mint,
      symbol: label.symbol,
      name: label.name,
      rawAmount: tokenAmount.amount as string,
      formattedAmount: formatTokenAmount(uiAmount),
      isNative: false,
    });
  }

  return assets
    .sort((left, right) => Number(right.rawAmount) - Number(left.rawAmount))
    .slice(0, 8);
}

export async function getWalletSummary(
  address: string,
  network: WalletNetwork,
): Promise<WalletSummary> {
  const owner = new PublicKey(address);
  const connection = getSolanaConnection(network);
  const [lamports, tokenAccounts, activityPreview] = await Promise.all([
    connection.getBalance(owner),
    connection.getParsedTokenAccountsByOwner(owner, {
      programId: SPL_TOKEN_PROGRAM_ID,
    }),
    getWalletActivity(address, network, 5),
  ]);

  return {
    address,
    network,
    solBalance: {
      rawLamports: String(lamports),
      formattedAmount: formatSol(lamports),
    },
    assets: normalizeAssetBalances(tokenAccounts.value),
    activityPreview,
  };
}
