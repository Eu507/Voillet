import type { PropsWithChildren, ReactNode } from "react";

interface StatCardProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  value?: string;
  aside?: ReactNode;
}

export function StatCard({
  aside,
  children,
  eyebrow,
  title,
  value,
}: StatCardProps) {
  return (
    <section className="panel-card stat-card">
      <div className="stat-card__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="panel-title">{title}</h2>
        </div>

        {aside}
      </div>

      {value ? <p className="stat-card__value">{value}</p> : null}
      {children}
    </section>
  );
}
