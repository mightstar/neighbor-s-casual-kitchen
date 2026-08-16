export type TimeRange = {
  date: string;
  start: string;
  durationMinutes: number;
};

export function rangeEndMinutes(start: string, durationMinutes: number) {
  const [h, m] = start.split(":").map(Number);
  return h * 60 + m + durationMinutes;
}

export function rangesOverlap(a: TimeRange, b: TimeRange) {
  if (a.date !== b.date) return false;
  const aStart = rangeEndMinutes(a.start, 0);
  const aEnd = rangeEndMinutes(a.start, a.durationMinutes);
  const bStart = rangeEndMinutes(b.start, 0);
  const bEnd = rangeEndMinutes(b.start, b.durationMinutes);
  return aStart < bEnd && bStart < aEnd;
}

export function tableIsBooked(
  tableId: string,
  requested: TimeRange,
  bookings: Array<TimeRange & { tableId: string; status?: string }>,
) {
  return bookings.some(
    (booking) =>
      booking.tableId === tableId &&
      booking.status !== "cancelled" &&
      rangesOverlap(requested, booking),
  );
}

export function canSeat(seats: number, partySize: number) {
  return Number.isInteger(partySize) && partySize >= 1 && partySize <= seats;
}
