"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { primaryNavigation } from "@/configs/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="brand-mark">
        <div className="brand-mark__badge">V</div>
        <div>
          <p className="brand-mark__title">voillet</p>
          <p className="brand-mark__subtitle">voice-native solana wallet</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {primaryNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx("sidebar-nav__item", {
              "sidebar-nav__item--active": pathname === item.href,
            })}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-note">
        <span className="status-dot status-dot--voice" />
        Read-only assistant mode for the hackathon demo.
      </div>
    </>
  );
}
