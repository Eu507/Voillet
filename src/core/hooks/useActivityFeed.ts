"use client";

import { useEffect, useState } from "react";

import type { ActivityItem } from "@/core/types/wallet";
import { useWalletData } from "@/core/hooks/WalletDataContext";

export function useActivityFeed(limit = 16) {
  const { address, isConnected } = useWalletData();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh(): Promise<void> {
    if (!address) {
      return;
    }

    const walletAddress = address;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/wallet/activity?address=${encodeURIComponent(walletAddress)}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load wallet activity.");
      }

      const data = (await response.json()) as ActivityItem[];
      setItems(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load wallet activity.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isConnected || !address) {
      return;
    }

    const walletAddress = address;

    async function loadActivity() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/wallet/activity?address=${encodeURIComponent(walletAddress)}&limit=${limit}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load wallet activity.");
        }

        const data = (await response.json()) as ActivityItem[];
        setItems(data);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load wallet activity.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadActivity();
  }, [address, isConnected, limit]);

  return {
    items: isConnected ? items : [],
    isLoading: isConnected ? isLoading : false,
    error: isConnected ? error : null,
    refresh,
  };
}
