import type { Metadata } from "next";
import { ReserveBoard } from "@/components/reserve-board";

export const metadata: Metadata = {
  title: "Reserve a table",
  description:
    "Book a 2-top, 4-top, booth, or bar seat at Neighbor's Casual Kitchen from the dining-room canvas.",
};

export default function ReservePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">The room</p>
      <h1 className="display mt-2 text-5xl">Reserve a table</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Choose a date, time, and how long you want the table. Then click one on the canvas.
        Booked tables stay disabled for that period so another guest cannot take them.
      </p>
      <div className="mt-8">
        <ReserveBoard />
      </div>
    </div>
  );
}
