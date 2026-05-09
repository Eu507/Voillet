"use client";

import { ActivityList } from "@/presentation/components/ActivityList";
import { StatCard } from "@/presentation/components/StatCard";
import { useWalletData } from "@/core/hooks/WalletDataContext";

export function DashboardView() {
  const { error, isConnected, isLoading, refreshSummary, summary } = useWalletData();

  if (!isConnected) {
    return (
      <section className="hero-panel">
        <p className="eyebrow">Connect to begin</p>
        <h2 className="hero-panel__title">Voillet is ready for a Solana wallet.</h2>
        <p className="hero-panel__copy">
          Connect Phantom or Solflare to load balances, recent activity, and the
          voice assistant’s read-only wallet guidance.
        </p>
      </section>
    );
  }

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div className="hero-panel__header">
          <div>
            <p className="eyebrow">Wallet overview</p>
            <h2 className="hero-panel__title">
              {summary?.solBalance.formattedAmount ?? "--"} SOL
            </h2>
          </div>

          <button type="button" className="button-secondary" onClick={() => void refreshSummary()}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <p className="hero-panel__copy">
          Solana remains the primary asset in this v1 shell, while SPL balances and
          recent activity stay readable to both the dashboard and assistant.
        </p>

        {error ? <p className="inline-error">{error}</p> : null}
      </section>

      <div className="grid-two">
        <StatCard
          eyebrow="Connection"
          title="Active network"
          value={summary?.network ?? "--"}
        >
          <p className="support-copy">Explorer links and wallet reads stay aligned.</p>
        </StatCard>

        <StatCard
          eyebrow="Tracked tokens"
          title="SPL positions"
          value={String(summary?.assets.length ?? 0)}
        >
          <p className="support-copy">
            Known symbols are labeled when possible, with mint fallbacks for the rest.
          </p>
        </StatCard>
      </div>

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Assets</p>
            <h2 className="panel-title">Detected balances</h2>
          </div>
        </div>

        {summary?.assets.length ? (
          <div className="token-grid">
            {summary.assets.map((asset) => (
              <article key={asset.mint} className="token-card">
                <div>
                  <p className="token-card__symbol">{asset.symbol}</p>
                  <p className="token-card__name">{asset.name}</p>
                </div>

                <p className="token-card__amount">{asset.formattedAmount}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-copy">
            No non-zero SPL token accounts were detected yet. This is normal for a fresh
            devnet wallet.
          </p>
        )}
      </section>

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Activity preview</p>
            <h2 className="panel-title">Recent wallet moves</h2>
          </div>
        </div>

        <ActivityList items={summary?.activityPreview ?? []} />
      </section>
    </div>
  );
}
