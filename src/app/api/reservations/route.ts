import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isWithinHours, todayISO } from "@/lib/hours";
import { databaseErrorMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canSeat, tableIsBooked } from "@/lib/reservations";
import { getTable } from "@/lib/tables";
import { validateReservation } from "@/lib/validators";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view reservations." }, { status: 401 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "asc" }, { start: "asc" }],
    });
    return NextResponse.json({ reservations });
  } catch (error) {
    return NextResponse.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to book a table." }, { status: 401 });
  }

  const body = (await request.json()) as {
    tableId?: string;
    date?: string;
    start?: string;
    durationMinutes?: number;
    partySize?: number;
    name?: string;
    phone?: string;
    notes?: string;
  };

  const payload = {
    tableId: body.tableId ?? "",
    date: body.date ?? "",
    start: body.start ?? "",
    durationMinutes: Number(body.durationMinutes ?? 90),
    partySize: Number(body.partySize ?? 2),
    name: body.name?.trim() ?? user.name,
    phone: body.phone?.trim() ?? "",
  };

  const error = validateReservation(payload);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (payload.date < todayISO()) {
    return NextResponse.json({ error: "Choose a date from today forward." }, { status: 400 });
  }

  if (!isWithinHours(payload.date, payload.start, payload.durationMinutes)) {
    return NextResponse.json(
      { error: "That time is outside our hours for the day." },
      { status: 400 },
    );
  }

  const table = getTable(payload.tableId);
  if (!table) {
    return NextResponse.json({ error: "That table is not on the floor plan." }, { status: 400 });
  }
  if (!canSeat(table.seats, payload.partySize)) {
    return NextResponse.json(
      { error: `Table ${table.label} seats ${table.seats}. Choose a larger table.` },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.reservation.findMany({
      where: { tableId: table.id, date: payload.date, status: "confirmed" },
    });

    if (tableIsBooked(table.id, payload, existing)) {
      return NextResponse.json(
        { error: "That table is already booked for this time." },
        { status: 409 },
      );
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
        notes: body.notes?.trim() ?? "",
        status: "confirmed",
      },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}
