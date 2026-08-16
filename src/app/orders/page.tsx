import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orders",
  description: "Pickup order confirmation for Neighbor's Casual Kitchen.",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ placed?: string }>;
}) {
  const { placed } = await searchParams;
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Takeout</p>
      <h1 className="display mt-2 text-5xl">
        {placed ? "Order placed" : "Your orders"}
      </h1>
      <p className="mt-4 text-muted">
        {placed
          ? "We will have it ready at the counter. Pay when you pick up at 9661 Audelia Road, Suite 105."
          : "Sign in to see pickup orders from this account."}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account" className="rounded-full bg-forest px-5 py-3 text-sm text-cream">
          View account
        </Link>
        <Link href="/menu" className="rounded-full border border-line px-5 py-3 text-sm">
          Back to menu
        </Link>
      </div>
    </div>
  );
}
