import { NextResponse } from "next/server";
import { listOpenTables } from "@/lib/availability";
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
    const result = await listOpenTables({ date, start, durationMinutes, partySize: 1 });
    if (!("tables" in result)) {
      return NextResponse.json({ bookedTableIds: floorTables.map((table) => table.id) });
    }
    const open = new Set(result.tables.map((table) => table.id));
    return NextResponse.json({
      bookedTableIds: floorTables.filter((table) => !open.has(table.id)).map((table) => table.id),
    });
  } catch {
    return NextResponse.json({ bookedTableIds: [] });
  }
}
