import Link from "next/link";
import { restaurant } from "@/lib/restaurant";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display text-3xl">Neighbor&apos;s</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-sand">Casual Kitchen</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-cream/80">{restaurant.tagline}</p>
          <p className="mt-4 text-sm text-cream/70">
            {restaurant.address.street}
            <br />
            {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
            <br />
            <a className="underline decoration-cream/30 underline-offset-4" href={`tel:${restaurant.phoneTel}`}>
              {restaurant.phone}
            </a>
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sand">Visit</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            {restaurant.hours.map((row) => (
              <li key={row.days}>
                <span className="block text-cream">{row.days}</span>
                {row.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sand">Pages</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/menu">Menu & order</Link></li>
            <li><Link href="/reserve">Reserve a table</Link></li>
            <li><Link href="/visit">Hours & map</Link></li>
            <li><Link href="/about">Our story</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-cream/55 sm:px-6">
          <p>
            {restaurant.priceRange} · {restaurant.cuisines.join(" · ")} · {restaurant.address.neighborhood}
          </p>
          <p>{restaurant.legalNote}</p>
        </div>
      </div>
    </footer>
  );
}
