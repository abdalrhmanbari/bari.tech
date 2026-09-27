import { LogoutButton } from "./LogoutButton";
import { SidebarNav } from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Sidebar: pinned flush to the left edge, never scrolls with the page. */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-white/10 bg-bg-primary md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-5">
          <p className="text-sm font-medium text-ink-primary">Content Dashboard</p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav />
        </div>
      </aside>

      {/* Top bar: fixed across the top, to the right of the sidebar. */}
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-bg-primary/95 backdrop-blur md:left-56">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-8">
          <p className="text-sm font-medium text-ink-primary md:hidden">Content Dashboard</p>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-ink-secondary hover:text-ink-primary"
            >
              View live site ↗
            </a>
            <LogoutButton />
          </div>
        </div>
        <div className="overflow-x-auto border-t border-white/10 px-2 py-2 md:hidden">
          <SidebarNav horizontal />
        </div>
      </header>

      <main className="min-w-0 px-4 pb-28 pt-32 md:ml-56 md:px-8 md:pt-20">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
