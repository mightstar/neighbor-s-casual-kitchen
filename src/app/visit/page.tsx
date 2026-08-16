import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { restaurant } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Hours, address, parking, and directions for Neighbor's Casual Kitchen in Lake Highlands, Dallas.",
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Lake Highlands</p>
      <h1 className="display mt-2 text-5xl">Visit us</h1>
      <p className="mt-3 max-w-2xl text-muted">
        At the corner of Walnut Hill and Audelia, in Lake Highlands Plaza. Private lot parking,
        patio tables, and a full bar.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-[28px] bg-white p-6">
            <h2 className="display text-3xl">Hours</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {restaurant.hours.map((row) => (
                <li key={row.days} className="flex justify-between gap-4 border-b border-line/70 py-2">
                  <span>{row.days}</span>
                  <span>{row.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Weekend brunch {restaurant.brunch.window}. {restaurant.brunch.note}
            </p>
          </section>

          <section className="rounded-[28px] bg-white p-6">
            <h2 className="display text-3xl">The details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Address" value={`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`} />
              <Row label="Neighborhood" value={`${restaurant.address.neighborhood} · ${restaurant.address.region}`} />
              <Row label="Cross street" value={restaurant.address.crossStreet} />
              <Row label="Phone" value={restaurant.phone} href={`tel:${restaurant.phoneTel}`} />
              <Row label="Price" value={restaurant.priceRange} />
              <Row label="Cuisine" value={restaurant.cuisines.join(", ")} />
              <Row label="Parking" value={restaurant.parking} />
              <Row label="Dress" value={restaurant.dressCode} />
              <Row label="Cards" value={restaurant.payments.join(", ")} />
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {restaurant.amenities.map((item) => (
                <span key={item} className="rounded-full bg-cream px-3 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[28px] border border-line">
            <iframe
              title="Map to Neighbor's Casual Kitchen"
              src={restaurant.mapsEmbed}
              className="h-[320px] w-full border-0"
              loading="lazy"
            />
          </div>
          <section className="rounded-[28px] bg-white p-6">
            <h2 className="display text-3xl">Write us</h2>
            <p className="mt-2 text-sm text-muted">
              Private events, large parties, or a question about the room.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex justify-between gap-6 border-b border-line/70 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">
        {href ? (
          <a href={href} className="underline underline-offset-4">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
