"use client";

import { useMemo, type PropsWithChildren } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { WalletDataProvider } from "@/core/hooks/WalletDataContext";
import { getSolanaEndpoint } from "@/core/solana/connection";
import { getWalletNetwork } from "@/core/utils/env";

export function ClientProviders({ children }: PropsWithChildren) {
  const network = getWalletNetwork();
  const endpoint = useMemo(() => getSolanaEndpoint(network), [network]);
  const walletNetwork =
    network === "mainnet-beta"
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: walletNetwork }),
    ],
    [walletNetwork],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletDataProvider>{children}</WalletDataProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
