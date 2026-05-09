import type {
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";

import type {
  ActivityItem,
  ActivityKind,
  ActivityStatus,
  WalletNetwork,
} from "@/core/types/wallet";
import { getSolanaConnection } from "@/core/solana/connection";
import { formatSignedSol } from "@/core/utils/format";
import { getExplorerTransactionUrl } from "@/core/utils/network";

export function deriveActivityStatus(
  confirmationStatus: ConfirmedSignatureInfo["confirmationStatus"],
  hasError: boolean,
): ActivityStatus {
  if (hasError) {
    return "failed";
  }

  if (confirmationStatus === "confirmed" || confirmationStatus === "finalized") {
    return "confirmed";
  }

  if (confirmationStatus === "processed") {
    return "pending";
  }

  return "unknown";
}

export function deriveActivityKind(
  lamportDelta: number,
  status: ActivityStatus,
): ActivityKind {
  if (lamportDelta > 0) {
    return "received";
  }

  if (lamportDelta < 0) {
    return "sent";
  }

  if (status === "pending" || status === "unknown") {
    return "unknown";
  }

  return "other";
}

function extractAccountKey(accountKey: unknown): string {
  if (typeof accountKey === "string") {
    return accountKey;
  }

  if (
    typeof accountKey === "object" &&
    accountKey !== null &&
    "pubkey" in accountKey &&
    accountKey.pubkey instanceof PublicKey
  ) {
    return accountKey.pubkey.toBase58();
  }

  if (accountKey instanceof PublicKey) {
    return accountKey.toBase58();
  }

  return "";
}

function getLamportDelta(
  parsedTransaction: ParsedTransactionWithMeta | null,
  ownerAddress: string,
): number {
  if (!parsedTransaction?.meta) {
    return 0;
  }

  const ownerIndex = parsedTransaction.transaction.message.accountKeys.findIndex(
    (accountKey) => extractAccountKey(accountKey) === ownerAddress,
  );

  if (ownerIndex < 0) {
    return 0;
  }

  const preBalance = parsedTransaction.meta.preBalances[ownerIndex] ?? 0;
  const postBalance = parsedTransaction.meta.postBalances[ownerIndex] ?? 0;

  return postBalance - preBalance;
}

export function normalizeActivityItem(
  signatureInfo: ConfirmedSignatureInfo,
  parsedTransaction: ParsedTransactionWithMeta | null,
  ownerAddress: string,
  network: WalletNetwork,
): ActivityItem {
  const status = deriveActivityStatus(
    signatureInfo.confirmationStatus,
    Boolean(parsedTransaction?.meta?.err),
  );
  const lamportDelta = getLamportDelta(parsedTransaction, ownerAddress);
  const kind = deriveActivityKind(lamportDelta, status);

  return {
    signature: signatureInfo.signature,
    kind,
    status,
    timestamp: signatureInfo.blockTime ?? null,
    amount: lamportDelta ? formatSignedSol(lamportDelta) : undefined,
    symbol: lamportDelta ? "SOL" : undefined,
    explorerUrl: getExplorerTransactionUrl(signatureInfo.signature, network),
  };
}

export async function getWalletActivity(
  address: string,
  network: WalletNetwork,
  limit = 12,
): Promise<ActivityItem[]> {
  const owner = new PublicKey(address);
  const connection = getSolanaConnection(network);
  const signatures = await connection.getSignaturesForAddress(owner, { limit });

  if (!signatures.length) {
    return [];
  }

  const parsedTransactions = await connection.getParsedTransactions(
    signatures.map((signatureInfo) => signatureInfo.signature),
    {
      maxSupportedTransactionVersion: 0,
    },
  );

  return signatures.map((signatureInfo, index) =>
    normalizeActivityItem(
      signatureInfo,
      parsedTransactions[index] ?? null,
      address,
      network,
    ),
  );
}
