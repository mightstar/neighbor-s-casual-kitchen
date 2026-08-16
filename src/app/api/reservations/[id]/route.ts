import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { id } = await context.params;
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation || reservation.userId !== user.id) {
    return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
  }

  await prisma.reservation.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ ok: true });
}
