import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import type { WalletNetwork } from "@/core/types/wallet";
import { getRpcUrl, getWalletNetwork } from "@/core/utils/env";

const connections = new Map<string, Connection>();

export const SPL_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

export function getSolanaEndpoint(network = getWalletNetwork()): string {
  return getRpcUrl() || clusterApiUrl(network);
}

export function getSolanaConnection(network = getWalletNetwork()): Connection {
  const endpoint = getSolanaEndpoint(network);
  const cachedConnection = connections.get(endpoint);

  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = new Connection(endpoint, "confirmed");
  connections.set(endpoint, connection);

  return connection;
}

export function resolveWalletNetwork(network?: string): WalletNetwork {
  return network === "mainnet-beta" ? "mainnet-beta" : getWalletNetwork();
}
