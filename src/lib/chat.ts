import type { SessionUser } from "@/lib/auth";
import { listOpenTables } from "@/lib/availability";
import { createReservation } from "@/lib/booking";
import type { ChatUi } from "@/lib/chat-types";
import { formatCents } from "@/lib/money";
import { isOpenNow } from "@/lib/hours";
import { searchMenu } from "@/lib/menu";
import { prisma } from "@/lib/prisma";
import { restaurant } from "@/lib/restaurant";
import { getTable, zoneLabel } from "@/lib/tables";

export type { BookingContext, ChatDish, ChatTable, ChatUi } from "@/lib/chat-types";

export const chatTools = [
  {
    type: "function" as const,
    function: {
      name: "get_restaurant_info",
      description:
        "Get Neighbor's address, phone, hours, brunch, parking, price range, and amenities.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_open_status",
      description: "Check whether the restaurant is open right now in Dallas time.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_menu",
      description: "Search the menu for dishes, prices, and brunch or dinner items.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Dish, ingredient, or category" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_available_tables",
      description:
        "List open tables for a Dallas date and time. Use this whenever the guest asks what is free.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "YYYY-MM-DD in America/Chicago" },
          start: { type: "string", description: "24-hour HH:mm start time" },
          durationMinutes: { type: "number", enum: [60, 90, 120] },
          partySize: { type: "number", description: "Guests, 1-6" },
        },
        required: ["date", "start"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "book_table",
      description:
        "Book a table for the signed-in guest. Requires login. Need tableId, date, time, party size, and a 10-digit phone.",
      parameters: {
        type: "object",
        properties: {
          tableId: { type: "string" },
          date: { type: "string" },
          start: { type: "string" },
          durationMinutes: { type: "number", enum: [60, 90, 120] },
          partySize: { type: "number" },
          phone: { type: "string" },
          notes: { type: "string" },
        },
        required: ["tableId", "date", "start", "phone"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_my_reservations",
      description: "List the signed-in guest's reservations.",
      parameters: { type: "object", properties: {} },
    },
  },
];

export function restaurantBrief() {
  return {
    name: restaurant.name,
    tagline: restaurant.tagline,
    address: `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`,
    neighborhood: restaurant.address.neighborhood,
    crossStreet: restaurant.address.crossStreet,
    phone: restaurant.phone,
    hours: restaurant.hours,
    brunch: restaurant.brunch,
    priceRange: restaurant.priceRange,
    cuisines: restaurant.cuisines,
    parking: restaurant.parking,
    amenities: restaurant.amenities,
    mapsUrl: restaurant.mapsUrl,
  };
}

export async function runChatTool(
  name: string,
  rawArgs: string,
  user: SessionUser | null,
  ui: ChatUi,
) {
  const args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};

  if (name === "get_restaurant_info") {
    return restaurantBrief();
  }

  if (name === "get_open_status") {
    return isOpenNow();
  }

  if (name === "search_menu") {
    const dishes = searchMenu(String(args.query ?? "")).map((item) => ({
      name: item.name,
      slug: item.slug,
      price: formatCents(item.priceCents),
      description: item.description,
    }));
    ui.dishes = dishes.map(({ name, slug, price }) => ({ name, slug, price }));
    return { dishes };
  }

  if (name === "get_available_tables") {
    const result = await listOpenTables({
      date: String(args.date ?? ""),
      start: String(args.start ?? ""),
      durationMinutes: Number(args.durationMinutes ?? 90),
      partySize: Number(args.partySize ?? 2),
    });
    if ("tables" in result) {
      ui.tables = result.tables;
      ui.context = {
        date: result.date,
        start: result.start,
        durationMinutes: result.durationMinutes,
        partySize: result.partySize,
      };
    }
    return result;
  }

  if (name === "book_table") {
    if (!user) {
      ui.needLogin = true;
      return { error: "login_required", message: "Ask the guest to sign in, then book again." };
    }
    const booked = await createReservation(user, {
      tableId: String(args.tableId ?? ""),
      date: String(args.date ?? ""),
      start: String(args.start ?? ""),
      durationMinutes: Number(args.durationMinutes ?? 90),
      partySize: Number(args.partySize ?? 2),
      name: user.name,
      phone: String(args.phone ?? ""),
      notes: String(args.notes ?? "Booked in chat"),
    });
    if (!booked.ok) {
      return { error: booked.error };
    }
    ui.reservation = {
      tableLabel: booked.table.label,
      date: booked.reservation.date,
      start: booked.reservation.start,
      durationMinutes: booked.reservation.durationMinutes,
      partySize: booked.reservation.partySize,
    };
    return {
      ok: true,
      table: {
        label: booked.table.label,
        zone: zoneLabel(booked.table.zone),
        seats: booked.table.seats,
      },
      date: booked.reservation.date,
      start: booked.reservation.start,
    };
  }

  if (name === "get_my_reservations") {
    if (!user) {
      ui.needLogin = true;
      return { error: "login_required" };
    }
    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "asc" }, { start: "asc" }],
      take: 8,
    });
    return {
      reservations: reservations.map((item: { tableId: string; date: string; start: string; durationMinutes: number; partySize: number; status: string }) => {
        const table = getTable(item.tableId);
        return {
          table: table?.label ?? item.tableId,
          zone: table ? zoneLabel(table.zone) : "",
          date: item.date,
          start: item.start,
          durationMinutes: item.durationMinutes,
          partySize: item.partySize,
          status: item.status,
        };
      }),
    };
  }

  return { error: `Unknown tool ${name}` };
}
