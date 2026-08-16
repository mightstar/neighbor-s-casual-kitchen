import { BrandMark } from "@/components/brand-mark";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark size={42} className="shadow-[0_4px_14px_rgba(28,49,40,0.22)]" />
      <span className="leading-tight">
        <span className="display block text-[1.15rem] tracking-tight">Neighbor&apos;s</span>
        <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-muted">
          Casual Kitchen
        </span>
      </span>
    </span>
  );
}
