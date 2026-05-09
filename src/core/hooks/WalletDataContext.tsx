"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import type { WalletSummary } from "@/core/types/wallet";

interface WalletDataContextValue {
  address?: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  summary: WalletSummary | null;
  refreshSummary: () => Promise<void>;
}

const WalletDataContext = createContext<WalletDataContextValue | null>(null);

export function WalletDataProvider({ children }: PropsWithChildren) {
  const { connected, publicKey } = useWallet();
  const address = publicKey?.toBase58();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshSummary(): Promise<void> {
    if (!address) {
      return;
    }

    const walletAddress = address;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/wallet/summary?address=${encodeURIComponent(walletAddress)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load wallet summary.");
      }

      const data = (await response.json()) as WalletSummary;
      setSummary(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load wallet summary.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!address) {
      return;
    }

    const walletAddress = address;

    async function loadSummary() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/wallet/summary?address=${encodeURIComponent(walletAddress)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load wallet summary.");
        }

        const data = (await response.json()) as WalletSummary;
        setSummary(data);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load wallet summary.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadSummary();
  }, [address]);

  return (
    <WalletDataContext.Provider
      value={{
        address,
        error: address ? error : null,
        isConnected: connected && Boolean(address),
        isLoading: address ? isLoading : false,
        refreshSummary,
        summary: address ? summary : null,
      }}
    >
      {children}
    </WalletDataContext.Provider>
  );
}

export function useWalletData(): WalletDataContextValue {
  const context = useContext(WalletDataContext);

  if (!context) {
    throw new Error("useWalletData must be used within a WalletDataProvider.");
  }

  return context;
}
