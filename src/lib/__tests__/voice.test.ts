import { reservePathFromEscalate, runVoiceTool } from "../voice";

describe("voice tools", () => {
  it("escalates a booking request instead of reserving", async () => {
    const output = await runVoiceTool("escalate_booking", {
      date: "2026-08-16",
      start: "18:00",
      partySize: 2,
    });
    expect(output.escalate?.date).toBe("2026-08-16");
    expect(output.result).toEqual(
      expect.objectContaining({ escalated: true }),
    );
  });

  it("treats book_table as an escalation", async () => {
    const output = await runVoiceTool("book_table", { tableId: "t4" });
    expect(output.escalate).toBeDefined();
  });

  it("builds a reserve URL from the call", () => {
    expect(
      reservePathFromEscalate({ date: "2026-08-16", start: "18:00", partySize: 4 }),
    ).toBe("/reserve?from=call&date=2026-08-16&start=18%3A00&party=4");
  });
});
