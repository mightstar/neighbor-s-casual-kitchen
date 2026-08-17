# Neighbor's Casual Kitchen

A production v1 website for the Lake Highlands cafe at 9661 Audelia Road, Dallas. Built as an independent take-home reconstruction from public listings — OpenTable, the Lake Highlands Advocate, and local directories. Not affiliated with the original restaurant.

The original site (`neighborscasualkitchen.com`) is gone. Directory pages and a stale OpenTable listing were the whole web presence. This rebuild gives the neighborhood a site they can actually use: real hours, a real menu, pickup ordering, a canvas floor plan for table reservations, and a host you can ask or call.

## What you can do

- Read hours, the menu, and the story
- Order pickup (cart in Redux, pay at the counter)
- Reserve a table by clicking the floor-plan canvas — booked tables lock for that period
- Ask the text host (OpenAI) — it can book when you are signed in
- Call the voice host (Vapi) in the browser or at **(469) 314-8252** — it will not book; it sends you to `/reserve`

Demo account after seed:

- Email: `guest@neighbors.kitchen`
- Password: `Neighbor123`

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind 4
- Redux Toolkit for cart and session UI
- Prisma + Neon / Postgres
- OpenAI `gpt-4o-mini` for chat
- Vapi for the voice host and inbound number
- Jest unit tests
- Docker + Compose
- Vercel-ready

## Local setup

```bash
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Use Neon's pooled `DATABASE_URL` for the app and the unpooled `DATABASE_URL_UNPOOLED` for Prisma CLI (`db push`, seed). Drop `channel_binding=require` — Prisma does not handle it well. Restart `npm run dev` after changing `.env`.

Chat needs `OPENAI_API_KEY`. Voice needs the three Vapi keys below.

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | server | Pooled Postgres (Neon in prod) |
| `DATABASE_URL_UNPOOLED` | Prisma CLI | Direct URL for `db push` / seed |
| `JWT_SECRET` | server | Auth cookie signing |
| `NEXT_PUBLIC_SITE_URL` | client + SEO | Site origin. Use `https://…` in prod so Vapi can reach `/api/vapi` |
| `OPENAI_API_KEY` | server | Text host |
| `OPENAI_MODEL` | server | Defaults to `gpt-4o-mini` |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | client | Web call widget |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | client | Saved Vapi assistant |
| `VAPI_PRIVATE_KEY` | server | Tool sync, webhook auth. Never put this in client code |
| `VAPI_SERVER_URL` | server | Optional public HTTPS origin (tunnel) if the site URL is still localhost |

## Chat vs voice

The text host and the voice host share restaurant data. They do not share booking.

**Chat** (`/api/chat`) can look up hours, the menu, and open tables, and it can `book_table` for a signed-in guest.

**Voice** (Vapi assistant + `/api/vapi` or local `/api/voice/tools`) answers hours, address, phone, brunch, parking, and open/closed from the system prompt. It only calls tools for:

- `search_menu`
- `get_available_tables`
- `escalate_booking` — never `book_table`

`escalate_booking` opens `/reserve?from=call&…` so the guest finishes on the canvas. The inbound host line is **(469) 314-8252**. The original directory listing, (214) 349-2233, stays on the Visit page as Listing.

Create or refresh the three Vapi tools and patch the assistant (prompt, speaking plan, tool IDs):

```bash
npm run vapi:sync
```

Vapi cloud can only hit `/api/vapi` when `NEXT_PUBLIC_SITE_URL` or `VAPI_SERVER_URL` is public HTTPS. Locally the widget runs the same tools through `/api/voice/tools`. Phone calls need that public webhook for menu and table lookups; hours and address still work from the prompt.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm test` | Jest unit tests |
| `npm run build` | Production build |
| `npx prisma db push` | Sync the schema |
| `npx prisma db seed` | Create the demo guest |
| `npm run vapi:sync` | Create/update Vapi tools and patch the assistant |

## Tests

```bash
npm test
```

Coverage is unit-level: hours, money, validators, table geometry, reservation overlap, menu search, cart slice, and voice escalation (voice must not book).

## Docker

```bash
docker compose up --build
```

The compose file includes local Postgres. The app also accepts a Neon URL — `src/lib/prisma.ts` uses the Neon adapter only when `DATABASE_URL` points at Neon.

Pass OpenAI and Vapi keys from your shell or a local `.env` if you want chat and voice inside the container. `NEXT_PUBLIC_*` values are baked in at **build** time, so rebuild after changing them.

After first boot against a fresh database:

```bash
npx prisma db push
npx prisma db seed
```

## Vercel + Neon

1. Create a Neon project and copy the pooled `DATABASE_URL` plus the unpooled `DATABASE_URL_UNPOOLED`.
2. Import the GitHub repo into Vercel.
3. Set `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL` (the Vercel `https://` URL), `OPENAI_API_KEY`, `NEXT_PUBLIC_VAPI_PUBLIC_KEY`, `NEXT_PUBLIC_VAPI_ASSISTANT_ID`, and `VAPI_PRIVATE_KEY`.
4. Vercel runs `prisma generate` on install. After the first deploy, run `prisma db push` and `prisma db seed` once against Neon.
5. Run `npm run vapi:sync` so the assistant tools point at `https://your-domain/api/vapi`.

## Project layout

```
prisma/                 schema + demo seed
scripts/sync-vapi.ts    Vapi tool + assistant sync
src/app/                pages + API routes
src/components/         UI, floor plan, chat + voice widgets
src/lib/                restaurant data, booking, chat, voice
src/store/              Redux cart + session
```

Client code never imports Prisma. Voice UI imports `@/lib/voice-client` only. Server routes use `@/lib/voice` and `@/lib/chat`.

## Pages

Home, menu, dish, cart / pickup checkout, canvas reservations, visit / map / contact, about, sign in, sign up, account, order confirmation.

## What is real

Hours, address, the original listing phone, price band, cuisine, amenities, owner, brunch dishes, burger prices, shrimp & grits, and OpenTable quotes come from public sources. A few supporting plates (house salad, fries, soup of the day) fill categories the restaurant advertised but did not publish item-by-item. Food photos are licensed Unsplash stand-ins, not the cafe's own photography. The host line **(469) 314-8252** is the connected Vapi number for this rebuild, not the cafe's original number.
