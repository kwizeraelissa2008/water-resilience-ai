import { cn } from "@/lib/utils";

export function WaterIOMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-label="WaterIO logo" className={cn("size-9", className)}>
      <defs>
        <linearGradient id="wio-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.75 0.12 205)" />
          <stop offset="55%" stopColor="oklch(0.6 0.13 234)" />
          <stop offset="100%" stopColor="oklch(0.66 0.16 148)" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="none" stroke="url(#wio-grad)" strokeWidth="2" strokeDasharray="4 4" opacity="0.65" />
      <path
        d="M20 8.5c4.6 5.2 7.6 9.2 7.6 13.1A7.6 7.6 0 0 1 20 29.2a7.6 7.6 0 0 1-7.6-7.6c0-3.9 3-7.9 7.6-13.1Z"
        fill="url(#wio-grad)"
      />
      <circle cx="20" cy="22" r="2.6" fill="oklch(1 0 0)" opacity="0.9" />
    </svg>
  );
}

export function WaterIOLogo({
  className,
  descriptor = true,
  tone = "light",
}: {
  className?: string;
  descriptor?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <WaterIOMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-tight",
            tone === "light" ? "text-foreground" : "text-navy-foreground",
          )}
        >
          WaterIO
        </span>
        {descriptor && (
          <span
            className={cn(
              "mt-1 text-[10px] font-medium uppercase tracking-[0.14em]",
              tone === "light" ? "text-muted-foreground" : "text-navy-foreground/65",
            )}
          >
            Smart Water. Secure Future.
          </span>
        )}
      </span>
    </span>
  );
}
