import { canSeat, rangesOverlap, tableIsBooked } from "../reservations";

describe("rangesOverlap", () => {
  it("detects overlapping periods on the same date", () => {
    expect(
      rangesOverlap(
        { date: "2026-08-16", start: "18:00", durationMinutes: 90 },
        { date: "2026-08-16", start: "18:30", durationMinutes: 60 },
      ),
    ).toBe(true);
  });

  it("allows back-to-back reservations", () => {
    expect(
      rangesOverlap(
        { date: "2026-08-16", start: "18:00", durationMinutes: 90 },
        { date: "2026-08-16", start: "19:30", durationMinutes: 60 },
      ),
    ).toBe(false);
  });

  it("ignores a different date", () => {
    expect(
      rangesOverlap(
        { date: "2026-08-16", start: "18:00", durationMinutes: 90 },
        { date: "2026-08-17", start: "18:00", durationMinutes: 90 },
      ),
    ).toBe(false);
  });
});

describe("tableIsBooked", () => {
  const bookings = [
    { tableId: "t4", date: "2026-08-16", start: "18:00", durationMinutes: 90, status: "confirmed" },
  ];

  it("locks the table during the booked period", () => {
    expect(
      tableIsBooked("t4", { date: "2026-08-16", start: "18:30", durationMinutes: 60 }, bookings),
    ).toBe(true);
  });

  it("leaves other tables open", () => {
    expect(
      tableIsBooked("t5", { date: "2026-08-16", start: "18:30", durationMinutes: 60 }, bookings),
    ).toBe(false);
  });

  it("ignores cancelled bookings", () => {
    expect(
      tableIsBooked(
        "t4",
        { date: "2026-08-16", start: "18:30", durationMinutes: 60 },
        [{ ...bookings[0], status: "cancelled" }],
      ),
    ).toBe(false);
  });
});

describe("canSeat", () => {
  it("allows a party that fits", () => {
    expect(canSeat(4, 3)).toBe(true);
  });

  it("rejects a party that is too large", () => {
    expect(canSeat(2, 4)).toBe(false);
  });
});
