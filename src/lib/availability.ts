import { getHoursForDate, isWithinHours, todayISO } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { tableIsBooked } from "@/lib/reservations";
import { floorTables, zoneLabel } from "@/lib/tables";

export type AvailabilityQuery = {
  date: string;
  start: string;
  durationMinutes?: number;
  partySize?: number;
};

export type OpenTable = {
  id: string;
  label: string;
  seats: number;
  zone: string;
};

export type AvailabilityResult =
  | { error: string }
  | {
      date: string;
      start: string;
      durationMinutes: number;
      partySize: number;
      count: number;
      tables: OpenTable[];
    };

export async function listOpenTables(query: AvailabilityQuery): Promise<AvailabilityResult> {
  const date = query.date;
  const start = query.start;
  const durationMinutes = [60, 90, 120].includes(Number(query.durationMinutes))
    ? Number(query.durationMinutes)
    : 90;
  const partySize = Math.min(6, Math.max(1, Number(query.partySize) || 2));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start)) {
    return { error: "I need a date (YYYY-MM-DD) and a time (HH:mm)." };
  }

  if (date < todayISO()) {
    return { error: "That date has already passed. Try today or a future day." };
  }

  if (!isWithinHours(date, start, durationMinutes)) {
    const hours = getHoursForDate(date);
    return {
      error: hours
        ? `We are open ${hours.open}–${hours.close} that day. Pick a time that fits a ${durationMinutes}-minute sit.`
        : "We are closed that day.",
    };
  }

  const bookings = await prisma.reservation.findMany({
    where: { date, status: "confirmed" },
    select: { tableId: true, date: true, start: true, durationMinutes: true, status: true },
  });

  const requested = { date, start, durationMinutes };
  const tables = floorTables
    .filter((table) => table.seats >= partySize && !tableIsBooked(table.id, requested, bookings))
    .map((table) => ({
      id: table.id,
      label: table.label,
      seats: table.seats,
      zone: zoneLabel(table.zone),
    }));

  return {
    date,
    start,
    durationMinutes,
    partySize,
    count: tables.length,
    tables,
  };
}
