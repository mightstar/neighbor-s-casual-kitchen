import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { categories, getItemsByCategory } from "@/lib/menu";
import { formatCents } from "@/lib/money";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Brunch, burgers, salads, shrimp and grits, and a full bar at Neighbor's Casual Kitchen in Lake Highlands.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">The board</p>
      <h1 className="display mt-2 text-5xl">Menu</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Prices and dishes are taken from the public OpenTable menu and the Lake Highlands
        Advocate brunch review. Burgers and sandwiches come with hand-cut fries.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-[0.14em]"
          >
            {category.label}
          </a>
        ))}
      </div>

      <div className="mt-14 space-y-16">
        {categories.map((category) => {
          const items = getItemsByCategory(category.id);
          return (
            <section key={category.id} id={category.id}>
              <h2 className="display text-3xl">{category.label}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">{category.blurb}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-[24px] bg-white p-3 shadow-[0_8px_30px_rgba(27,23,18,0.04)]"
                  >
                    <Link href={`/menu/${item.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                    </Link>
                    <div className="min-w-0 flex-1 py-1 pr-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/menu/${item.slug}`} className="display text-xl leading-tight">
                          {item.name}
                        </Link>
                        <span className="text-sm text-copper">{formatCents(item.priceCents)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                      <div className="mt-3">
                        <AddToCart id={item.id} name={item.name} compact />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
