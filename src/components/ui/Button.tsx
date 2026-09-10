import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

/**
 * Pill button styling shared by links and the contact form's submit.
 * (Was `.btn` / `.btn-primary` / `.btn-ghost`.)
 */
export function buttonClass(variant: Variant, className?: string): string {
  return cn(
    "inline-flex items-center gap-2.5 rounded-full px-[34px] py-4 font-grotesk text-[13px] uppercase tracking-[0.08em] transition-[transform,background,color,box-shadow,border-color] duration-[400ms] ease-smooth will-change-transform",
    variant === "primary" &&
      "bg-[linear-gradient(155deg,#ededed,#b9bbbe)] text-[#141414] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)]",
    variant === "ghost" &&
      "border border-hair text-ink-primary hover:-translate-y-[3px] hover:border-accent-dim",
    className,
  );
}
