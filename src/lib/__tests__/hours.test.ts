import { isWithinHours, reservationSlots, timeToMinutes } from "../hours";

describe("hours", () => {
  it("converts clock time to minutes", () => {
    expect(timeToMinutes("18:30")).toBe(18 * 60 + 30);
  });

  it("keeps Monday lunch inside hours and late night out", () => {
    expect(isWithinHours("2026-08-17", "12:00", 90)).toBe(true);
    expect(isWithinHours("2026-08-17", "20:00", 90)).toBe(false);
  });

  it("builds 30-minute slots that fit the period", () => {
    const slots = reservationSlots("2026-08-16", 90);
    expect(slots[0]).toBe("09:00");
    expect(slots.at(-1)).toBe("19:30");
  });
});
