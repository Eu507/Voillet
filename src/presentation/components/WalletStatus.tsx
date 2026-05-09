"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { useWalletData } from "@/core/hooks/WalletDataContext";
import { formatAddress } from "@/core/utils/format";
import { getWalletNetwork } from "@/core/utils/env";

export function WalletStatus() {
  const { summary } = useWalletData();
  const network = getWalletNetwork();

  return (
    <div className="wallet-status">
      <div className="wallet-status__meta">
        <span className="pill pill--network">{network}</span>
        {summary?.address ? (
          <span className="wallet-status__address">
            {formatAddress(summary.address)}
          </span>
        ) : (
          <span className="wallet-status__address">No wallet connected</span>
        )}
      </div>

      <WalletMultiButton className="wallet-connect-button" />
    </div>
  );
}
