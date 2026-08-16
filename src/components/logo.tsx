export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-cream">
        <span className="display text-[1.15rem] leading-none">N</span>
      </span>
      <span className="leading-tight">
        <span className="display block text-[1.15rem] tracking-tight">Neighbor&apos;s</span>
        <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-muted">
          Casual Kitchen
        </span>
      </span>
    </span>
  );
}
