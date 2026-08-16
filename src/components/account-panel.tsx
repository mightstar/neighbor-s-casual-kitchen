"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatTimeLabel } from "@/lib/hours";
import { formatCents } from "@/lib/money";
import { getTable, zoneLabel } from "@/lib/tables";
import { clearUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type Reservation = {
  id: string;
  tableId: string;
  date: string;
  start: string;
  durationMinutes: number;
  partySize: number;
  status: string;
};

type Order = {
  id: string;
  totalCents: number;
  status: string;
  createdAt: string;
};

export function AccountPanel() {
  const user = useAppSelector((state) => state.auth.user);
  const ready = useAppSelector((state) => state.auth.status === "ready");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data: { reservations?: Reservation[] }) => setReservations(data.reservations ?? []));
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data: { orders?: Order[] }) => setOrders(data.orders ?? []));
  }, [user]);

  if (!ready) {
    return <p className="text-muted">Loading…</p>;
  }

  if (!user) {
    return (
      <p className="text-muted">
        <Link href="/login" className="text-copper underline underline-offset-4">
          Sign in
        </Link>{" "}
        to see reservations and orders.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] bg-white p-6">
        <p className="display text-3xl">{user.name}</p>
        <p className="mt-1 text-sm text-muted">{user.email}</p>
        <button
          type="button"
          className="mt-4 text-sm text-copper"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            dispatch(clearUser());
            router.push("/");
          }}
        >
          Sign out
        </button>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="display text-3xl">Reservations</h2>
          <Link href="/reserve" className="text-sm text-copper">
            Book another
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {reservations.length === 0 && <li className="text-sm text-muted">No reservations yet.</li>}
          {reservations.map((item) => {
            const table = getTable(item.tableId);
            return (
              <li key={item.id} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium">
                  Table {table?.label ?? item.tableId} · {table ? zoneLabel(table.zone) : ""}
                </p>
                <p className="text-muted">
                  {item.date} · {formatTimeLabel(item.start)} · {item.durationMinutes} min ·{" "}
                  {item.partySize} guests · {item.status}
                </p>
                {item.status === "confirmed" && (
                  <button
                    type="button"
                    className="mt-2 text-copper"
                    onClick={async () => {
                      await fetch(`/api/reservations/${item.id}`, { method: "DELETE" });
                      setReservations((current) =>
                        current.map((row) =>
                          row.id === item.id ? { ...row, status: "cancelled" } : row,
                        ),
                      );
                    }}
                  >
                    Cancel
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="display text-3xl">Pickup orders</h2>
        <ul className="mt-4 space-y-3">
          {orders.length === 0 && <li className="text-sm text-muted">No pickup orders yet.</li>}
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white p-4 text-sm">
              <p className="font-medium">{formatCents(order.totalCents)}</p>
              <p className="text-muted">
                {new Date(order.createdAt).toLocaleString()} · {order.status}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
