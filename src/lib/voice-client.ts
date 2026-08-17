import { chicagoClock, formatTimeLabel, isOpenNow, todayISO } from "@/lib/hours";
import { restaurant } from "@/lib/restaurant";

export const voiceTools = [
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
        "List open tables for a Dallas date and time. Use this when the guest asks what is free. Do not book.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "YYYY-MM-DD in America/Chicago" },
          start: { type: "string", description: "24-hour HH:mm start time" },
          durationMinutes: { type: "number", description: "60, 90, or 120" },
          partySize: { type: "number", description: "Guests, 1-6" },
        },
        required: ["date", "start"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "escalate_booking",
      description:
        "Required whenever the guest wants to reserve, hold, or book a table. Never book on the call. Escalate to the website reservation page.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "YYYY-MM-DD if known" },
          start: { type: "string", description: "HH:mm if known" },
          durationMinutes: { type: "number" },
          partySize: { type: "number" },
          notes: { type: "string", description: "Patio, booth, or other preference" },
        },
      },
    },
  },
];

export const voiceFirstMessage =
  "Hey neighbor, this is Neighbor's. I can help with hours, the menu, and what's open. If you want a table, I'll send you to the reserve page.";

export const voiceToolFillers: Record<string, string> = {
  search_menu: "Looking at the menu.",
  get_available_tables: "Checking the floor.",
  escalate_booking: "I'll send you to the reserve page.",
};

export const voiceSpeakingPlan = {
  startSpeakingPlan: {
    waitSeconds: 1.4,
    smartEndpointingPlan: { provider: "livekit" as const },
    transcriptionEndpointingPlan: {
      onNoPunctuationSeconds: 1.8,
      onPunctuationSeconds: 0.7,
      onNumberSeconds: 1.0,
    },
  },
  stopSpeakingPlan: {
    numWords: 2,
    backoffSeconds: 1.5,
  },
};

export function voiceFacts() {
  const status = isOpenNow();
  const hours = restaurant.hours.map((row) => `${row.days} ${row.label}`).join(". ");
  return {
    address: `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`,
    neighborhood: restaurant.address.neighborhood,
    crossStreet: restaurant.address.crossStreet,
    phone: restaurant.phone,
    hours,
    brunch: `${restaurant.brunch.days} ${restaurant.brunch.window}. ${restaurant.brunch.note}`,
    parking: restaurant.parking,
    priceRange: restaurant.priceRange,
    amenities: restaurant.amenities.join(", "),
    open: status.open,
    now: `${status.date} ${status.time ? formatTimeLabel(status.time) : ""}`.trim(),
  };
}

export function voiceSystemPrompt(today = `${todayISO()} ${chicagoClock()}`) {
  const facts = voiceFacts();
  return `You are the voice host at ${restaurant.name} in Lake Highlands, Dallas. Warm, brief, and spoken-friendly.

Today in America/Chicago is ${today}. Right now the restaurant is ${facts.open ? "OPEN" : "CLOSED"}.

Answer hours, address, phone, parking, brunch, and open/closed from this card. Do not call a tool for those. Never say you had trouble fetching them.

- Address: ${facts.address}
- Neighborhood: ${facts.neighborhood}, ${facts.crossStreet}
- Host phone: ${facts.phone}
- Hours: ${facts.hours}
- Brunch: ${facts.brunch}
- Parking: ${facts.parking}
- Price: ${facts.priceRange}
- Amenities: ${facts.amenities}

Use search_menu only for dishes and prices.
Use get_available_tables when they ask what tables are free.
Use escalate_booking when they want to reserve, hold, or book. Then tell them you are sending them to the reserve page.
You cannot book, hold, or confirm a reservation on this call.
Never invent a free table or a price.
If a weekday name is given, resolve it to the next YYYY-MM-DD from today.
Wait until they finish speaking. Keep answers to one or two short spoken sentences.`;
}

export type VoiceEscalate = {
  date?: string;
  start?: string;
  durationMinutes?: number;
  partySize?: number;
  notes?: string;
};

export function reservePathFromEscalate(escalate: VoiceEscalate) {
  const params = new URLSearchParams({ from: "call" });
  if (escalate.date) params.set("date", escalate.date);
  if (escalate.start) params.set("start", escalate.start);
  if (escalate.partySize) params.set("party", String(escalate.partySize));
  if (escalate.durationMinutes) params.set("duration", String(escalate.durationMinutes));
  if (escalate.notes) params.set("notes", escalate.notes);
  return `/reserve?${params.toString()}`;
}
