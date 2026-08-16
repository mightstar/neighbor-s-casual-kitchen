import type { Metadata } from "next";
import Image from "next/image";
import { restaurant } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Neighbor's Casual Kitchen, the Lake Highlands cafe that replaced Highlands Cafe in 2014.",
};

const art =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Since {restaurant.established}</p>
      <h1 className="display mt-2 max-w-3xl text-5xl">A neighborhood kitchen, not a concept.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{restaurant.longDescription}</p>

      <div className="relative mt-10 h-80 overflow-hidden rounded-[32px]">
        <Image src={art} alt="A plated neighborhood dinner" fill className="object-cover" />
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <section className="rounded-[28px] bg-white p-6">
          <h2 className="display text-3xl">How we got here</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            In 2014, Peter Touris took over the old Highlands Cafe space at 9661 Audelia and
            rebuilt it as Neighbor&apos;s Casual Kitchen. The Lake Highlands Advocate covered the
            change: sit-down service instead of a counter, a full bar, an expanded patio, and
            children&apos;s art on the walls. The idea was simple — keep the neighborhood eating
            close to home.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Brunch became the local reason to stay on this side of Walnut Hill. Staff pointed
            first-timers to the pulled pork eggs Benedict, the chicken fried rib-eye, and the
            New Orleans French toast. OpenTable diners still talk about the small cafe feel and
            the fajita omelet on the patio.
          </p>
        </section>
        <section className="rounded-[28px] bg-forest p-6 text-cream">
          <h2 className="display text-3xl">What we cook</h2>
          <p className="mt-3 text-sm leading-7 text-cream/80">
            New American comfort food. Salads and sandwiches are the everyday backbone. The
            dinner board holds salmon and shrimp & grits. The bar pours wine, beer, $2.95
            mimosas, and $3.95 Bloody Marys. Kids have a junior brunch plate. Most of the menu
            sits under $30.
          </p>
          <p className="mt-3 text-sm leading-7 text-cream/80">
            We are not a downtown destination restaurant. We are the table you walk to after
            soccer, after church, or when you do not want to leave Lake Highlands.
          </p>
        </section>
      </div>
    </div>
  );
}
