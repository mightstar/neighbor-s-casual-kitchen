import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { getMenuItem, menuItems } from "@/lib/menu";
import { formatCents } from "@/lib/money";

export function generateStaticParams() {
  return menuItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) return { title: "Dish" };
  return { title: item.name, description: item.description };
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="relative min-h-[360px] overflow-hidden rounded-[32px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col justify-center">
        <Link href="/menu" className="text-sm text-copper">
          ← Back to menu
        </Link>
        <h1 className="display mt-4 text-5xl">{item.name}</h1>
        <p className="mt-3 text-2xl text-copper">{formatCents(item.priceCents)}</p>
        <p className="mt-4 max-w-md text-base leading-7 text-muted">{item.description}</p>
        <div className="mt-8">
          <AddToCart id={item.id} name={item.name} />
        </div>
      </div>
    </div>
  );
}
