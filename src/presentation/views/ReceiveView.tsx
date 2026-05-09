"use client";

import QRCode from "react-qr-code";

import { useWalletData } from "@/core/hooks/WalletDataContext";
import { getExplorerAddressUrl } from "@/core/utils/network";

export function ReceiveView() {
  const { isConnected, summary } = useWalletData();

  if (!isConnected || !summary) {
    return (
      <section className="hero-panel">
        <p className="eyebrow">Receive</p>
        <h2 className="hero-panel__title">Connect a wallet to generate the receive card.</h2>
        <p className="hero-panel__copy">
          This screen exposes the connected Solana address as text, QR, clipboard copy,
          and explorer link.
        </p>
      </section>
    );
  }

  const walletSummary = summary;
  const explorerUrl = getExplorerAddressUrl(
    walletSummary.address,
    walletSummary.network,
  );

  async function handleCopyAddress() {
    await navigator.clipboard.writeText(walletSummary.address);
  }

  async function handleShareAddress() {
    if (navigator.share) {
      await navigator.share({
        title: "Voillet address",
        text: walletSummary.address,
      });
      return;
    }

    await handleCopyAddress();
  }

  return (
    <section className="receive-shell">
      <div className="panel-card receive-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Receive</p>
            <h2 className="panel-title">Wallet address</h2>
          </div>

          <span className="pill pill--success">ready</span>
        </div>

        <div className="receive-card__qr">
          <QRCode
            value={walletSummary.address}
            size={190}
            bgColor="transparent"
            fgColor="#9effd4"
          />
        </div>

        <p className="receive-card__address">{walletSummary.address}</p>

        <div className="receive-card__actions">
          <button type="button" className="button-primary" onClick={() => void handleCopyAddress()}>
            Copy address
          </button>
          <button type="button" className="button-secondary" onClick={() => void handleShareAddress()}>
            Share
          </button>
          <a href={explorerUrl} target="_blank" rel="noreferrer" className="button-secondary button-secondary--link">
            Explorer
          </a>
        </div>
      </div>
    </section>
  );
}
