import Link from "next/link";
import { SECTION_KEYS, SECTION_LABELS } from "@/lib/content/schema";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-medium text-ink-primary">Overview</h1>
      <p className="mb-6 text-sm text-ink-secondary">
        Pick a section to edit. Each one has separate English and Arabic content —
        use the language tabs on the section page to edit both. Changes go live on
        the site immediately after saving.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/admin/messages"
          className="rounded-lg border border-white/10 bg-card p-4 text-sm text-ink-primary transition hover:border-white/20"
        >
          Messages
        </Link>
        {SECTION_KEYS.map((key) => (
          <Link
            key={key}
            href={`/admin/${key}`}
            className="rounded-lg border border-white/10 bg-card p-4 text-sm text-ink-primary transition hover:border-white/20"
          >
            {SECTION_LABELS[key]}
          </Link>
        ))}
      </div>
    </div>
  );
}
