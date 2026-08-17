import type { Metadata } from "next";
import { ReserveBoard } from "@/components/reserve-board";

export const metadata: Metadata = {
  title: "Reserve a table",
  description:
    "Book a 2-top, 4-top, booth, or bar seat at Neighbor's Casual Kitchen from the dining-room canvas.",
};

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    start?: string;
    duration?: string;
    party?: string;
    notes?: string;
    from?: string;
  }>;
}) {
  const params = await searchParams;
  const duration = Number(params.duration);
  const partySize = Number(params.party);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">The room</p>
      <h1 className="display mt-2 text-5xl">Reserve a table</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Choose a date, time, and how long you want the table. Then click one on the canvas.
        Booked tables stay disabled for that period so another guest cannot take them.
      </p>
      <div className="mt-8">
        <ReserveBoard
          fromCall={params.from === "call"}
          initial={{
            date: params.date,
            start: params.start,
            duration: [60, 90, 120].includes(duration) ? duration : undefined,
            partySize: partySize >= 1 && partySize <= 6 ? partySize : undefined,
            notes: params.notes,
          }}
        />
      </div>
    </div>
  );
}
