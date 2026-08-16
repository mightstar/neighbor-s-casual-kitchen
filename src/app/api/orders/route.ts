import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getMenuItem } from "@/lib/menu";
import { cartTotals } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view orders." }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to place an order." }, { status: 401 });
  }

  const body = (await request.json()) as {
    items?: Array<{ id: string; quantity: number }>;
  };
  const raw = body.items ?? [];
  if (!raw.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const items = raw
    .map((line) => {
      const item = getMenuItem(line.id);
      if (!item || line.quantity < 1) return null;
      return {
        id: item.id,
        name: item.name,
        priceCents: item.priceCents,
        quantity: Math.min(20, Math.floor(line.quantity)),
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  if (!items.length) {
    return NextResponse.json({ error: "No valid menu items in the cart." }, { status: 400 });
  }

  const totals = cartTotals(items);
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      items,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      status: "placed",
      pickupNote: "Pay at pickup · 9661 Audelia Road, Suite 105",
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
