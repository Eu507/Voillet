"use client";

import { useState, type PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { primaryNavigation } from "@/configs/navigation";
import { AssistantPanel } from "@/presentation/components/AssistantPanel";
import { SidebarNav } from "@/presentation/components/SidebarNav";
import { WalletStatus } from "@/presentation/components/WalletStatus";

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <SidebarNav />
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hackathon v1</p>
            <h1 className="topbar__title">Solana wallet, guided by voice</h1>
          </div>

          <div className="topbar__actions">
            <button
              type="button"
              className="button-secondary button-secondary--mobile"
              onClick={() => setIsAssistantOpen((currentState) => !currentState)}
            >
              {isAssistantOpen ? "Close assistant" : "Open assistant"}
            </button>
            <WalletStatus />
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>

      <aside
        className={clsx("assistant-column", {
          "assistant-column--open": isAssistantOpen,
        })}
      >
        <AssistantPanel onRequestNavigate={() => setIsAssistantOpen(false)} />
      </aside>

      <nav className="mobile-nav">
        {primaryNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx("mobile-nav__item", {
              "mobile-nav__item--active": pathname === item.href,
            })}
          >
            {item.shortLabel}
          </Link>
        ))}
      </nav>
    </div>
  );
}
