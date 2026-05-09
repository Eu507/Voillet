"use client";

import { ActivityList } from "@/presentation/components/ActivityList";
import { useActivityFeed } from "@/core/hooks/useActivityFeed";
import { useWalletData } from "@/core/hooks/WalletDataContext";

export function ActivityView() {
  const { isConnected } = useWalletData();
  const { error, isLoading, items, refresh } = useActivityFeed(18);

  if (!isConnected) {
    return (
      <section className="hero-panel">
        <p className="eyebrow">Activity</p>
        <h2 className="hero-panel__title">Connect a wallet to inspect movement.</h2>
        <p className="hero-panel__copy">
          Once connected, Voillet normalizes recent Solana signatures into a cleaner
          activity feed for both humans and the assistant.
        </p>
      </section>
    );
  }

  return (
    <section className="panel-card">
      <div className="panel-card__header">
        <div>
          <p className="eyebrow">Onchain timeline</p>
          <h2 className="panel-title">Normalized activity</h2>
        </div>

        <button type="button" className="button-secondary" onClick={() => void refresh()}>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <p className="inline-error">{error}</p> : null}
      <ActivityList items={items} />
    </section>
  );
}
