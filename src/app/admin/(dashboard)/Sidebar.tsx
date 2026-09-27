"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTION_KEYS, SECTION_LABELS } from "@/lib/content/schema";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/stats", label: "Stats" },
  ...SECTION_KEYS.map((key) => ({ href: `/admin/${key}`, label: SECTION_LABELS[key] })),
];

export function SidebarNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={horizontal ? "flex gap-1" : "flex flex-col gap-0.5"}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition ${
              active
                ? "bg-white/10 text-ink-primary"
                : "text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
