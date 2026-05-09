import clsx from "clsx";

import type { ActivityItem } from "@/core/types/wallet";
import { formatAddress, formatRelativeTime } from "@/core/utils/format";

interface ActivityListProps {
  items: ActivityItem[];
  emptyLabel?: string;
}

export function ActivityList({
  items,
  emptyLabel = "No recent onchain activity found for this wallet yet.",
}: ActivityListProps) {
  if (!items.length) {
    return <p className="empty-copy">{emptyLabel}</p>;
  }

  return (
    <div className="activity-list">
      {items.map((item) => (
        <article key={item.signature} className="activity-list__item">
          <div>
            <div className="activity-list__heading">
              <span
                className={clsx("pill", {
                  "pill--success": item.kind === "received",
                  "pill--alert": item.kind === "sent",
                  "pill--pending": item.kind === "other" || item.kind === "unknown",
                })}
              >
                {item.kind}
              </span>

              <span className="activity-list__signature">
                {formatAddress(item.signature, 5)}
              </span>
            </div>

            <p className="activity-list__time">{formatRelativeTime(item.timestamp)}</p>
          </div>

          <div className="activity-list__side">
            {item.amount ? <span className="activity-list__amount">{item.amount}</span> : null}
            <a
              href={item.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              explorer
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
