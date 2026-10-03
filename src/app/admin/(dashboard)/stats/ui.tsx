"use client";

/** Presentational building blocks shared by the stats dashboard's cards. */

export function StatTile({
  label,
  value,
  live = false,
  hint,
}: {
  label: string;
  value: number | string;
  live?: boolean;
  /** Small line under the value, e.g. what a percentage is out of. */
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-4">
      <p className="mb-1 flex items-center gap-2 text-xs text-ink-secondary">
        {live && (
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {Number(value) > 0 && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${Number(value) > 0 ? "bg-emerald-400" : "bg-ink-muted"}`}
            />
          </span>
        )}
        {label}
      </p>
      <p className="text-2xl font-medium text-ink-primary">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Card({
  title,
  note,
  children,
}: {
  title: string;
  /** One-line explanation of what the card counts, shown under the title. */
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-card p-4">
      <h2 className={`text-xs text-ink-secondary ${note ? "mb-1" : "mb-4"}`}>{title}</h2>
      {note && <p className="mb-4 text-[11px] text-ink-muted">{note}</p>}
      {children}
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-ink-muted">{children}</p>;
}

export type BarRow = { key: string; label: string; badge: string; value: string; ratio: number };

export function BarList({ rows }: { rows: BarRow[] }) {
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.key} className="text-sm">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink-primary">
              <span className="inline-flex w-7 shrink-0 justify-center rounded border border-white/10 py-0.5 text-[10px] font-medium text-ink-secondary">
                {row.badge}
              </span>
              {row.label}
            </span>
            <span className="tabular-nums text-ink-secondary">{row.value}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5">
            <div
              aria-hidden="true"
              className="h-full rounded-full bg-accent/70"
              style={{ width: `${Math.max(2, row.ratio * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
