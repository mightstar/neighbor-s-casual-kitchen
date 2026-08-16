import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createReservation } from "@/lib/booking";
import { databaseErrorMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";

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

  try {
    const result = await createReservation(user, {
      tableId: body.tableId ?? "",
      date: body.date ?? "",
      start: body.start ?? "",
      durationMinutes: Number(body.durationMinutes ?? 90),
      partySize: Number(body.partySize ?? 2),
      name: body.name?.trim() ?? user.name,
      phone: body.phone?.trim() ?? "",
      notes: body.notes,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ reservation: result.reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}
