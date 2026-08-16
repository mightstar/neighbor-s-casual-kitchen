import { validatePassword, validateReservation, validateSignup } from "../validators";

describe("validators", () => {
  it("rejects a short password", () => {
    expect(validatePassword("short")).toBe("Password must be at least 8 characters.");
  });

  it("accepts a complete signup", () => {
    expect(
      validateSignup({
        name: "Ada",
        email: "ada@neighbors.kitchen",
        password: "Neighbor123",
      }),
    ).toBeNull();
  });

  it("requires a real phone on reservations", () => {
    expect(
      validateReservation({
        tableId: "t4",
        date: "2026-08-16",
        start: "18:00",
        durationMinutes: 90,
        partySize: 2,
        name: "Ada",
        phone: "123",
      }),
    ).toMatch(/phone/i);
  });
});
