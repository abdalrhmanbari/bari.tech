import Link from "next/link";
import { SECTION_KEYS, SECTION_LABELS } from "@/lib/content/schema";
import { LogoutButton } from "./LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10">
      <aside className="shrink-0 md:w-48">
        <div className="mb-4 flex items-center justify-between md:block">
          <p className="text-sm font-medium text-ink-primary">Content Dashboard</p>
          <LogoutButton />
        </div>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          <Link
            href="/admin"
            className="rounded-md px-3 py-1.5 text-sm text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
          >
            Overview
          </Link>
          <Link
            href="/admin/messages"
            className="rounded-md px-3 py-1.5 text-sm text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
          >
            Messages
          </Link>
          <Link
            href="/admin/stats"
            className="rounded-md px-3 py-1.5 text-sm text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
          >
            Stats
          </Link>
          {SECTION_KEYS.map((key) => (
            <Link
              key={key}
              href={`/admin/${key}`}
              className="rounded-md px-3 py-1.5 text-sm text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
            >
              {SECTION_LABELS[key]}
            </Link>
          ))}
        </nav>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 hidden text-xs text-ink-secondary/70 hover:text-ink-secondary md:block"
        >
          View live site ↗
        </a>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
