import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your takeout order from Neighbor's Casual Kitchen.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Takeout</p>
      <h1 className="display mt-2 text-5xl">Cart</h1>
      <p className="mt-3 text-muted">
        Pickup at 9661 Audelia Road, Suite 105. Pay at the counter when you arrive.
      </p>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
