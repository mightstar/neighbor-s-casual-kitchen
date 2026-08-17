"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readJson } from "@/lib/http";
import { formatCents } from "@/lib/money";
import { clearCart, removeItem, selectCartTotals, setQuantity } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CartView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lines = useAppSelector((state) => state.cart.lines);
  const user = useAppSelector((state) => state.auth.user);
  const totals = selectCartTotals(lines);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkout() {
    setError("");
    if (!user) {
      router.push("/login?next=/cart");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
      }),
    });
    const data = await readJson<{ error?: string; order?: { id: string } }>(res);
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not place the order.");
      return;
    }
    dispatch(clearCart());
    router.push(`/orders?placed=${data.order?.id ?? ""}`);
  }

  if (!lines.length) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center">
        <p className="text-muted">The cart is empty.</p>
        <Link href="/menu" className="mt-4 inline-block text-copper underline underline-offset-4">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lines.map((line) => (
        <div key={line.id} className="flex gap-4 rounded-[24px] bg-white p-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
            <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
          </div>
          <div className="flex flex-1 items-center justify-between gap-3">
            <div>
              <p className="display text-xl">{line.name}</p>
              <p className="text-sm text-muted">{formatCents(line.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 w-8 rounded-full border border-line"
                onClick={() => dispatch(setQuantity({ id: line.id, quantity: line.quantity - 1 }))}
              >
                –
              </button>
              <span className="w-6 text-center text-sm">{line.quantity}</span>
              <button
                type="button"
                className="h-8 w-8 rounded-full border border-line"
                onClick={() => dispatch(setQuantity({ id: line.id, quantity: line.quantity + 1 }))}
              >
                +
              </button>
              <button
                type="button"
                className="ml-2 text-xs text-muted"
                onClick={() => dispatch(removeItem(line.id))}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-[24px] bg-cream p-5 text-sm">
        <Row label="Subtotal" value={formatCents(totals.subtotalCents)} />
        <Row label="Dallas tax (8.25%)" value={formatCents(totals.taxCents)} />
        <Row label="Total" value={formatCents(totals.totalCents)} strong />
      </div>

      {error && <p className="text-sm text-copper-deep">{error}</p>}

      <button
        type="button"
        disabled={busy}
        onClick={checkout}
        className="w-full rounded-full bg-copper py-3 text-sm text-white hover:bg-copper-deep disabled:opacity-60"
      >
        {busy ? "Placing order…" : user ? "Place pickup order" : "Sign in to check out"}
      </button>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${strong ? "text-base" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
