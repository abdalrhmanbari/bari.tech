import { cn } from "@/lib/cn";

/**
 * Shared section shell — vertical rhythm, centred max-width, responsive
 * gutter and header-aware scroll offset. (Was the `.section` class.)
 */
export function Section({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-[5] mx-auto max-w-section scroll-mt-header px-12 py-40 bp-nav:px-6 bp-nav:py-[120px]",
        className,
      )}
    >
      {children}
    </section>
  );
}
