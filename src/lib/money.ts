export const DALLAS_TAX_RATE = 0.0825;

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function lineTotal(priceCents: number, quantity: number) {
  return priceCents * quantity;
}

export function cartTotals(lines: Array<{ priceCents: number; quantity: number }>) {
  const subtotalCents = lines.reduce(
    (sum, line) => sum + lineTotal(line.priceCents, line.quantity),
    0,
  );
  const taxCents = Math.round(subtotalCents * DALLAS_TAX_RATE);
  const totalCents = subtotalCents + taxCents;
  return { subtotalCents, taxCents, totalCents };
}
