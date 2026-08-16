import { restaurant } from "./restaurant";

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatTimeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return m === 0 ? `${hour}:00 ${suffix}` : `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function getHoursForDate(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return restaurant.weeklyHours[day];
}

export function isWithinHours(date: string, start: string, durationMinutes: number) {
  const hours = getHoursForDate(date);
  if (!hours) return false;
  const startMin = timeToMinutes(start);
  const endMin = startMin + durationMinutes;
  return startMin >= timeToMinutes(hours.open) && endMin <= timeToMinutes(hours.close);
}

export function reservationSlots(date: string, durationMinutes: number) {
  const hours = getHoursForDate(date);
  if (!hours) return [];
  const start = timeToMinutes(hours.open);
  const lastStart = timeToMinutes(hours.close) - durationMinutes;
  const slots: string[] = [];
  for (let t = start; t <= lastStart; t += 30) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function todayISO(now = new Date()) {
  const tz = "America/Chicago";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
