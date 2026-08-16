import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tableIsBooked, type TimeRange } from "@/lib/reservations";
import { floorTables } from "@/lib/tables";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const start = searchParams.get("start") ?? "";
  const durationMinutes = Number(searchParams.get("duration") ?? "90");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start)) {
    return NextResponse.json({ error: "date and start are required." }, { status: 400 });
  }

  try {
    const bookings = await prisma.reservation.findMany({
      where: { date, status: "confirmed" },
      select: { tableId: true, date: true, start: true, durationMinutes: true, status: true },
    });

    const requested: TimeRange = { date, start, durationMinutes };
    const bookedTableIds = floorTables
      .filter((table) => tableIsBooked(table.id, requested, bookings))
      .map((table) => table.id);

    return NextResponse.json({ bookedTableIds });
  } catch {
    return NextResponse.json({ bookedTableIds: [] });
  }
}
