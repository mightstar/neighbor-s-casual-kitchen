export const restaurant = {
  name: "Neighbor's Casual Kitchen",
  shortName: "Neighbor's",
  legalNote:
    "Independent take-home reconstruction from public listings. Not affiliated with or employed by the original restaurant.",
  tagline: "Your friends next door in Lake Highlands.",
  description:
    "A family-friendly New American cafe in Lake Highlands serving homemade casual food — sandwiches with hand-cut fries, soups, salads, weekend brunch, and a full bar.",
  longDescription:
    "Neighbor's Casual Kitchen is a locally owned cafe in the Lake Highlands neighborhood of Dallas. Think of us as your friends next door who can't wait to have you over for a home-cooked meal. We serve lunch and dinner daily, breakfast energy on the weekends, and a full bar with patio seating. The room is casual and family-friendly, with local and children's art on the walls and a small-cafe feel that is very much part of the neighborhood.",
  phone: "(469) 314-8252",
  phoneTel: "+14693148252",
  listingPhone: "(214) 349-2233",
  email: "hello@neighborscasualkitchen.com",
  website: "https://neighborscasualkitchen.com",
  address: {
    street: "9661 Audelia Road, Suite 105",
    city: "Dallas",
    state: "TX",
    zip: "75238",
    neighborhood: "Lake Highlands",
    crossStreet: "Walnut Hill & Audelia",
    region: "Northeast Dallas",
  },
  mapsQuery: "9661 Audelia Road Suite 105, Dallas, TX 75238",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=9661+Audelia+Road+Suite+105+Dallas+TX+75238",
  mapsEmbed:
    "https://maps.google.com/maps?q=9661%20Audelia%20Road%20Suite%20105%20Dallas%20TX%2075238&t=&z=16&ie=UTF8&iwloc=&output=embed",
  priceRange: "$30 and under",
  priceSymbol: "$$",
  cuisines: ["American", "Comfort Food", "Vegetarian"],
  diningStyle: "Casual Dining",
  dressCode: "Business Casual",
  parking: "Private lot",
  payments: ["AMEX", "Discover", "Mastercard", "Visa"],
  amenities: [
    "Full bar",
    "Wine & beer",
    "Patio / outdoor dining",
    "Weekend brunch",
    "Takeout",
    "Kid-friendly",
    "Counter seating",
    "Local art",
  ],
  owner: "Peter Touris",
  established: "2014",
  hours: [
    { days: "Monday – Wednesday", open: "11:00", close: "21:00", label: "11:00 AM – 9:00 PM" },
    { days: "Thursday – Friday", open: "11:00", close: "22:00", label: "11:00 AM – 10:00 PM" },
    { days: "Saturday", open: "09:00", close: "22:00", label: "9:00 AM – 10:00 PM" },
    { days: "Sunday", open: "09:00", close: "21:00", label: "9:00 AM – 9:00 PM" },
  ],
  brunch: {
    days: "Saturday & Sunday",
    window: "9:00 AM – 2:00 PM",
    note: "Pulled pork eggs Benedict, New Orleans French toast, and $2.95 mimosas.",
  },
  weeklyHours: {
    0: { open: "09:00", close: "21:00" },
    1: { open: "11:00", close: "21:00" },
    2: { open: "11:00", close: "21:00" },
    3: { open: "11:00", close: "21:00" },
    4: { open: "11:00", close: "22:00" },
    5: { open: "11:00", close: "22:00" },
    6: { open: "09:00", close: "22:00" },
  } as Record<number, { open: string; close: string }>,
  reviews: [
    {
      quote:
        "Nice spot. Very integrated into the neighborhood. Nice ambiance. Had a live performance during brunch.",
      source: "OpenTable diner",
      rating: 4,
    },
    {
      quote:
        "Really enjoyed the food and the small cafe feel. Brought my husband back for breakfast. Sat outside and he had a great fajita omelet.",
      source: "OpenTable diner",
      rating: 5,
    },
    {
      quote: "We've eaten at Neighbor's a couple of times — very nice. Good food, pleasant.",
      source: "OpenTable diner",
      rating: 4,
    },
  ],
  rating: {
    score: 4.2,
    count: 6,
    source: "OpenTable",
  },
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
