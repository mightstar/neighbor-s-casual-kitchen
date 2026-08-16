# Neighbor's Casual Kitchen

A production v1 website for the Lake Highlands cafe at 9661 Audelia Road, Dallas. Built as an independent take-home reconstruction from public listings — OpenTable, the Lake Highlands Advocate, and local directories. Not affiliated with the original restaurant.

The original site (`neighborscasualkitchen.com`) is gone. Directory pages and a stale OpenTable listing were the whole web presence. This rebuild gives the neighborhood a site they can actually use: real hours, a real menu, pickup ordering, and a canvas floor plan for table reservations.

## Stack

- Next.js 16 (App Router) + TypeScript
- Redux Toolkit for cart and session UI
- Prisma + Neon / Postgres
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

Demo account after seed:

- Email: `guest@neighbors.kitchen`
- Password: `Neighbor123`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm test` | Jest unit tests |
| `npm run build` | Production build |
| `npx prisma db push` | Sync the schema |
| `npx prisma db seed` | Create the demo guest |

## Docker

```bash
docker compose up --build
```

The web container expects `DATABASE_URL` and `JWT_SECRET`. After first boot, run `npx prisma db push` and `npx prisma db seed` against that database (or point `DATABASE_URL` at Neon and skip local Postgres).

## Vercel + Neon

1. Create a Neon project and copy the pooled `DATABASE_URL`.
2. Import the GitHub repo into Vercel.
3. Set `DATABASE_URL`, `JWT_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
4. Vercel runs `prisma generate` on install. After the first deploy, run `prisma db push` and `prisma db seed` once against Neon.

## What is real

Hours, address, phone, price band, cuisine, amenities, owner, brunch dishes, burger prices, shrimp & grits, and OpenTable quotes come from public sources. A few supporting plates (house salad, fries, soup of the day) fill categories the restaurant advertised but did not publish item-by-item. Food photos are licensed Unsplash stand-ins, not the cafe's own photography.

## Pages

Home, menu, dish, cart / pickup checkout, canvas reservations, visit / map / contact, about, sign in, sign up, account.
