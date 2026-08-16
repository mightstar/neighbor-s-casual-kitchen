import { cartTotals, formatCents, lineTotal } from "../money";

describe("money", () => {
  it("formats cents as USD", () => {
    expect(formatCents(955)).toBe("$9.55");
    expect(formatCents(295)).toBe("$2.95");
  });

  it("multiplies a line", () => {
    expect(lineTotal(895, 2)).toBe(1790);
  });

  it("applies Dallas tax", () => {
    const totals = cartTotals([{ priceCents: 1000, quantity: 1 }]);
    expect(totals.subtotalCents).toBe(1000);
    expect(totals.taxCents).toBe(83);
    expect(totals.totalCents).toBe(1083);
  });
});
