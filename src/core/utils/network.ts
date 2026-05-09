import type { WalletNetwork } from "@/core/types/wallet";

export function getExplorerTransactionUrl(
  signature: string,
  network: WalletNetwork,
): string {
  const clusterSuffix = network === "devnet" ? "?cluster=devnet" : "";

  return `https://explorer.solana.com/tx/${signature}${clusterSuffix}`;
}

export function getExplorerAddressUrl(
  address: string,
  network: WalletNetwork,
): string {
  const clusterSuffix = network === "devnet" ? "?cluster=devnet" : "";

  return `https://explorer.solana.com/address/${address}${clusterSuffix}`;
}
