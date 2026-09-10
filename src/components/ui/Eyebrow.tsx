import { cn } from "@/lib/cn";

/** Small uppercase label with a leading hairline, used above section titles. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}
