import { cn } from "@/lib/cn";

/** Small uppercase label with a leading hairline, used above section titles. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-7 flex items-center gap-3.5 font-grotesk text-[12px] uppercase tracking-[0.22em] text-ink-muted",
        "before:inline-block before:h-px before:w-6 before:shrink-0 before:bg-hair before:content-['']",
        className,
      )}
    >
      {children}
    </p>
  );
}
