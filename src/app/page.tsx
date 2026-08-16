import Image from "next/image";
import Link from "next/link";
import { RestaurantJsonLd } from "@/components/json-ld";
import { getFeaturedItems } from "@/lib/menu";
import { formatCents } from "@/lib/money";
import { restaurant } from "@/lib/restaurant";

const hero =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80";
const patio =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const featured = getFeaturedItems().slice(0, 6);

  return (
    <div className="grain">
      <RestaurantJsonLd />
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src={hero}
          alt="Warm dining room at a neighborhood cafe"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/20" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sand">
            Lake Highlands · Dallas · {restaurant.priceRange}
          </p>
          <h1 className="display mt-4 max-w-3xl text-5xl leading-[1.05] text-cream sm:text-7xl">
            Come over. Dinner&apos;s on the table.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-cream/85">
            {restaurant.tagline} Homemade burgers, salads, weekend brunch, and a full bar —
            the cafe at Walnut Hill and Audelia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/reserve"
              className="rounded-full bg-copper px-6 py-3 text-sm text-white hover:bg-copper-deep"
            >
              Reserve a table
            </Link>
            <Link
              href="/menu"
              className="rounded-full bg-cream px-6 py-3 text-sm text-ink hover:bg-white"
            >
              Order from the menu
            </Link>
            <a
              href={`tel:${restaurant.phoneTel}`}
              className="rounded-full border border-cream/40 px-6 py-3 text-sm text-cream"
            >
              Call {restaurant.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cream/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {restaurant.hours.map((row) => (
            <div key={row.days}>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{row.days}</p>
              <p className="mt-1 text-sm">{row.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-copper">From the board</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">What neighbors order</h2>
          </div>
          <Link href="/menu" className="text-sm text-copper underline underline-offset-4">
            See the full menu
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.slug}`}
              className="group overflow-hidden rounded-[28px] bg-white shadow-[0_10px_40px_rgba(27,23,18,0.06)]"
            >
              <div className="relative h-56">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="display text-2xl">{item.name}</h3>
                  <p className="text-sm text-copper">{formatCents(item.priceCents)}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sand">Click a table</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Reserve from the floor plan</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-cream/80">
              Two-tops on the patio, four-tops in the dining room, six-top booths, and bar
              seats. Pick a time, click an open table, and it locks for that period.
            </p>
            <Link
              href="/reserve"
              className="mt-6 inline-block rounded-full bg-cream px-6 py-3 text-sm text-ink"
            >
              Open the canvas
            </Link>
          </div>
          <div className="relative h-80 overflow-hidden rounded-[32px]">
            <Image src={patio} alt="Shrimp and grits" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-copper">OpenTable, 4.2</p>
        <h2 className="display mt-2 text-4xl">From the neighborhood</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {restaurant.reviews.map((review) => (
            <blockquote key={review.quote} className="rounded-[28px] bg-white p-6">
              <p className="display text-2xl leading-snug">“{review.quote}”</p>
              <footer className="mt-4 text-sm text-muted">{review.source}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-cream/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="display text-4xl">9661 Audelia, Suite 105</h2>
            <p className="mt-2 text-muted">
              Private lot · Patio · Full bar · Weekend brunch 9 AM–2 PM
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={restaurant.mapsUrl}
              className="rounded-full bg-forest px-5 py-3 text-sm text-cream"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
            <Link href="/visit" className="rounded-full border border-line px-5 py-3 text-sm">
              Hours & parking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
