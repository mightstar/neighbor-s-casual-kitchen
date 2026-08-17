"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FloorPlan } from "@/components/floor-plan";
import { formatTimeLabel, reservationSlots, todayISO } from "@/lib/hours";
import { floorTables, getTable, zoneLabel, type FloorTable } from "@/lib/tables";
import { useAppSelector } from "@/store/hooks";

const durations = [60, 90, 120];

export function ReserveBoard({
  initial,
  fromCall = false,
}: {
  initial?: {
    date?: string;
    start?: string;
    duration?: number;
    partySize?: number;
    notes?: string;
  };
  fromCall?: boolean;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const authReady = useAppSelector((state) => state.auth.status === "ready");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [start, setStart] = useState(initial?.start || "18:00");
  const [duration, setDuration] = useState(initial?.duration || 90);
  const [partySize, setPartySize] = useState(initial?.partySize || 2);
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<FloorTable | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const slots = useMemo(() => reservationSlots(date, duration), [date, duration]);
  const startValue = slots.includes(start)
    ? start
    : (slots[Math.floor(slots.length / 2)] ?? start);
  const guestName = name || user?.name || "";

  useEffect(() => {
    let ignore = false;
    fetch(
      `/api/reservations/availability?date=${date}&start=${startValue}&duration=${duration}`,
    )
      .then((res) => res.json())
      .then((data: { bookedTableIds?: string[] }) => {
        if (!ignore) setBookedIds(data.bookedTableIds ?? []);
      })
      .catch(() => {
        if (!ignore) setBookedIds([]);
      });
    return () => {
      ignore = true;
    };
  }, [date, startValue, duration, success]);

  async function book() {
    setError("");
    setSuccess("");
    if (!selected) {
      setError("Click an open table on the floor plan.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: selected.id,
        date,
        start: startValue,
        durationMinutes: duration,
        partySize,
        name: guestName,
        phone,
        notes,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not book that table.");
      return;
    }
    setSuccess(`Table ${selected.label} is reserved for ${formatTimeLabel(startValue)}.`);
    setSelected(null);
    setNotes("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-4 grid gap-3 rounded-3xl border border-line bg-white/70 p-4 sm:grid-cols-4">
          <label className="text-xs uppercase tracking-[0.16em] text-muted">
            Date
            <input
              type="date"
              min={todayISO()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.16em] text-muted">
            Time
            <select
              value={startValue}
              onChange={(event) => setStart(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
            >
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTimeLabel(slot)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.16em] text-muted">
            Period
            <select
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
            >
              {durations.map((mins) => (
                <option key={mins} value={mins}>
                  {mins} minutes
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.16em] text-muted">
            Party
            <select
              value={partySize}
              onChange={(event) => {
                const next = Number(event.target.value);
                setPartySize(next);
                if (selected && selected.seats < next) setSelected(null);
              }}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <FloorPlan
          bookedIds={bookedIds}
          partySize={partySize}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <Legend color="bg-forest" label="Open" />
          <Legend color="bg-copper" label="Selected" />
          <Legend color="bg-[#b7aa97]" label="Booked for this period" />
          <Legend color="bg-[#d9cfc0]" label="Too small for your party" />
        </div>
      </div>

      <aside className="rounded-3xl border border-line bg-white/80 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-copper">Hold a table</p>
        <h2 className="display mt-2 text-3xl">Book the room</h2>
        {fromCall && (
          <p className="mt-3 rounded-2xl bg-cream px-4 py-3 text-sm">
            The host sent you here to finish the reservation. Pick a table and confirm.
          </p>
        )}
        <p className="mt-2 text-sm leading-6 text-muted">
          Click a table on the canvas. Once it is booked, it stays disabled for that period so
          nobody else can take it.
        </p>

        {selected ? (
          <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm">
            Table {selected.label} · {zoneLabel(selected.zone)} · seats {selected.seats}
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted">No table selected yet.</p>
        )}

        <div className="mt-4 space-y-3">
          <Field label="Name" value={guestName} onChange={setName} />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="214-555-0100" />
          <label className="block text-xs uppercase tracking-[0.16em] text-muted">
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
              placeholder="High chair, patio preference, birthday..."
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-copper-deep">{error}</p>}
        {success && <p className="mt-3 text-sm text-forest">{success}</p>}

        {authReady && !user ? (
          <p className="mt-5 text-sm">
            <Link href="/login?next=/reserve" className="text-copper underline underline-offset-4">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/signup?next=/reserve" className="text-copper underline underline-offset-4">
              create an account
            </Link>{" "}
            to confirm a table.
          </p>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={book}
            className="mt-5 w-full rounded-full bg-copper py-3 text-sm text-white hover:bg-copper-deep disabled:opacity-60"
          >
            {busy ? "Booking…" : "Confirm reservation"}
          </button>
        )}

        <ul className="mt-6 space-y-2 text-sm text-muted">
          {floorTables.map((table) => {
            const booked = bookedIds.includes(table.id);
            const small = table.seats < partySize;
            return (
              <li key={table.id} className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    if (!booked && !small) setSelected(getTable(table.id) ?? table);
                  }}
                >
                  {table.label} · {table.seats}-top · {zoneLabel(table.zone)}
                </button>
                <span>{booked ? "Held" : small ? "Small" : "Open"}</span>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.16em] text-muted">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
      />
    </label>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}
