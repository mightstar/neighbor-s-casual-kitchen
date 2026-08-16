import Image from "next/image";

export function BrandMark({
  size = 40,
  className = "",
  alt = "Neighbor's Casual Kitchen",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <Image
      src="/brand-mark.png"
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      priority={size >= 40}
    />
  );
}
