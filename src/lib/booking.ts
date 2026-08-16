import type { SessionUser } from "@/lib/auth";
import { isWithinHours, todayISO } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { canSeat, tableIsBooked } from "@/lib/reservations";
import { getTable } from "@/lib/tables";
import { validateReservation } from "@/lib/validators";

export type BookingInput = {
  tableId: string;
  date: string;
  start: string;
  durationMinutes: number;
  partySize: number;
  name: string;
  phone: string;
  notes?: string;
};

export type BookingResult =
  | { ok: false; error: string; status: 400 | 409 }
  | {
      ok: true;
      status: 201;
      reservation: Awaited<ReturnType<typeof prisma.reservation.create>>;
      table: NonNullable<ReturnType<typeof getTable>>;
    };

export async function createReservation(
  user: SessionUser,
  input: BookingInput,
): Promise<BookingResult> {
  const payload = {
    tableId: input.tableId,
    date: input.date,
    start: input.start,
    durationMinutes: Number(input.durationMinutes),
    partySize: Number(input.partySize),
    name: input.name.trim() || user.name,
    phone: input.phone.trim(),
  };

  const error = validateReservation(payload);
  if (error) {
    return { ok: false, error, status: 400 };
  }

  if (payload.date < todayISO()) {
    return { ok: false, error: "Choose a date from today forward.", status: 400 };
  }

  if (!isWithinHours(payload.date, payload.start, payload.durationMinutes)) {
    return { ok: false, error: "That time is outside our hours for the day.", status: 400 };
  }

  const table = getTable(payload.tableId);
  if (!table) {
    return { ok: false, error: "That table is not on the floor plan.", status: 400 };
  }
  if (!canSeat(table.seats, payload.partySize)) {
    return {
      ok: false,
      error: `Table ${table.label} seats ${table.seats}. Choose a larger table.`,
      status: 400,
    };
  }

  const existing = await prisma.reservation.findMany({
    where: { tableId: table.id, date: payload.date, status: "confirmed" },
  });

  if (tableIsBooked(table.id, payload, existing)) {
    return { ok: false, error: "That table is already booked for this time.", status: 409 };
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: user.id,
      tableId: table.id,
      date: payload.date,
      start: payload.start,
      durationMinutes: payload.durationMinutes,
      partySize: payload.partySize,
      name: payload.name,
      phone: payload.phone,
      notes: input.notes?.trim() ?? "Booked in chat",
      status: "confirmed",
    },
  });

  return { ok: true, reservation, table, status: 201 };
}
