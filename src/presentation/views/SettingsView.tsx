"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { useMicrophonePermission } from "@/core/hooks/useMicrophonePermission";
import { getWalletNetwork, isVoiceEnabled } from "@/core/utils/env";

export function SettingsView() {
  const { connected, disconnect } = useWallet();
  const microphonePermission = useMicrophonePermission();
  const network = getWalletNetwork();

  return (
    <div className="grid-two">
      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Runtime</p>
            <h2 className="panel-title">App configuration</h2>
          </div>
        </div>

        <dl className="detail-list">
          <div className="detail-list__row">
            <dt>Network</dt>
            <dd>{network}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Voice mode</dt>
            <dd>{isVoiceEnabled() ? "Enabled" : "Disabled"}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Microphone permission</dt>
            <dd>{microphonePermission}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Language</dt>
            <dd>English-first UI, Portuguese-friendly prompts</dd>
          </div>
        </dl>
      </section>

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Wallet controls</p>
            <h2 className="panel-title">Session management</h2>
          </div>
        </div>

        <p className="support-copy">
          This v1 build is intentionally read-only for assistant actions. Future send
          flows will keep explicit wallet confirmation in the loop.
        </p>

        <button
          type="button"
          className="button-secondary"
          disabled={!connected}
          onClick={() => void disconnect()}
        >
          Disconnect wallet
        </button>
      </section>
    </div>
  );
}
