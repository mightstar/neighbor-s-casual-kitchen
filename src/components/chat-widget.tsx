"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { formatTimeLabel } from "@/lib/hours";
import { readJson } from "@/lib/http";
import type { BookingContext, ChatDish, ChatTable } from "@/lib/chat-types";
import { useAppSelector } from "@/store/hooks";

type ChatItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tables?: ChatTable[];
  dishes?: ChatDish[];
  context?: BookingContext;
  needLogin?: boolean;
  reservation?: {
    tableLabel: string;
    date: string;
    start: string;
    durationMinutes: number;
    partySize: number;
  };
};

const STARTERS = [
  "What are your hours?",
  "Where are you?",
  "Patio for 2 tonight at 6",
  "What is the Benedict?",
];

const STORAGE_KEY = "nck-chat";
const PHONE_KEY = "nck-chat-phone";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ChatWidget() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");
  const [pendingTable, setPendingTable] = useState<ChatTable | null>(null);
  const [pendingContext, setPendingContext] = useState<BookingContext | null>(null);
  const [bookError, setBookError] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: "hello",
      role: "assistant",
      content:
        "Hey neighbor. Ask about hours, the menu, or a table. If you see a table you like, tap it to hold it.",
    },
  ]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const savedPhone = localStorage.getItem(PHONE_KEY);
    if (savedPhone) setPhone(savedPhone);
    if (saved) {
      try {
        setMessages(JSON.parse(saved) as ChatItem[]);
      } catch {
        /* keep hello */
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-24)));
  }, [messages]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, pendingTable]);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("nck-open-chat", openChat);
    return () => window.removeEventListener("nck-open-chat", openChat);
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: ChatItem[] = [...messages, { id: uid(), role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setPendingTable(null);
    setBookError("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: next.map((item) => ({ role: item.role, content: item.content })),
      }),
    });
    const data = await readJson<{
      error?: string;
      reply?: string;
      tables?: ChatTable[];
      dishes?: ChatDish[];
      context?: BookingContext;
      needLogin?: boolean;
      reservation?: ChatItem["reservation"];
    }>(res);
    setBusy(false);

    setMessages((current) => [
      ...current,
      {
        id: uid(),
        role: "assistant",
        content: data.reply ?? data.error ?? "I could not get that. Try again in a moment.",
        tables: data.tables,
        dishes: data.dishes,
        context: data.context,
        needLogin: data.needLogin,
        reservation: data.reservation,
      },
    ]);
  }

  async function confirmBook() {
    if (!pendingTable || !pendingContext) return;
    if (!user) return;
    setBookError("");
    if (phone.replace(/\D/g, "").length < 10) {
      setBookError("Add a phone number so we can reach you.");
      return;
    }
    localStorage.setItem(PHONE_KEY, phone);
    setBusy(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: pendingTable.id,
        date: pendingContext.date,
        start: pendingContext.start,
        durationMinutes: pendingContext.durationMinutes,
        partySize: pendingContext.partySize,
        name: user.name,
        phone,
        notes: "Booked from chat",
      }),
    });
    const data = await readJson<{ error?: string }>(res);
    setBusy(false);
    if (!res.ok) {
      setBookError(data.error ?? "Could not hold that table.");
      return;
    }
    setPendingTable(null);
    setMessages((current) => [
      ...current,
      {
        id: uid(),
        role: "assistant",
        content: `Table ${pendingTable.label} is yours on ${pendingContext.date} at ${formatTimeLabel(pendingContext.start)}. See you then.`,
        reservation: {
          tableLabel: pendingTable.label,
          ...pendingContext,
        },
      },
    ]);
  }

  function onTableClick(table: ChatTable, context?: BookingContext) {
    if (!user) {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          content: `Table ${table.label} looks good. Sign in and I can hold it for you.`,
          needLogin: true,
        },
      ]);
      return;
    }
    if (!context) {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          content: "Tell me the date and time first, then tap a table.",
        },
      ]);
      return;
    }
    setPendingTable(table);
    setPendingContext(context);
    setBookError("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <section className="flex h-[min(640px,78vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_20px_60px_rgba(27,23,18,0.18)]">
          <header className="flex items-center justify-between bg-forest px-4 py-3 text-cream">
            <div className="flex items-center gap-2.5">
              <BrandMark size={36} alt="" />
              <div>
              <p className="display text-xl leading-none">Ask Neighbor&apos;s</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sand">
                {user ? `Hi, ${user.name.split(" ")[0]}` : "Hours · menu · tables"}
              </p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-cream/80">
              Close
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((item) => (
              <article
                key={item.id}
                className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  item.role === "user" ? "ml-auto bg-forest text-cream" : "bg-white text-ink"
                }`}
              >
                <p>{item.content}</p>
                {item.tables && item.tables.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tables.map((table) => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => onTableClick(table, item.context)}
                        className="rounded-full bg-cream px-3 py-1 text-xs text-ink hover:bg-sand"
                      >
                        {table.label} · {table.seats}-top · {table.zone}
                      </button>
                    ))}
                  </div>
                )}
                {item.dishes && item.dishes.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {item.dishes.map((dish) => (
                      <Link
                        key={dish.slug}
                        href={`/menu/${dish.slug}`}
                        className="text-xs text-copper underline underline-offset-2"
                      >
                        {dish.name} · {dish.price}
                      </Link>
                    ))}
                  </div>
                )}
                {item.needLogin && (
                  <Link
                    href={`/login?next=${encodeURIComponent(pathname)}`}
                    className="mt-2 inline-block rounded-full bg-copper px-3 py-1 text-xs text-white"
                  >
                    Sign in to book
                  </Link>
                )}
              </article>
            ))}
            {busy && <p className="text-xs text-muted">Checking the board…</p>}

            {pendingTable && pendingContext && (
              <div className="rounded-2xl border border-line bg-white p-3 text-sm">
                <p className="font-medium">
                  Hold table {pendingTable.label} · {pendingContext.date} ·{" "}
                  {formatTimeLabel(pendingContext.start)}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {pendingContext.partySize} guests · {pendingContext.durationMinutes} minutes
                </p>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number"
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
                />
                {bookError && <p className="mt-2 text-xs text-copper-deep">{bookError}</p>}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={confirmBook}
                    className="rounded-full bg-copper px-3 py-1.5 text-xs text-white disabled:opacity-60"
                  >
                    Confirm reservation
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingTable(null)}
                    className="text-xs text-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white/70 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about a table or the menu"
                className="flex-1 rounded-full border border-line bg-paper px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-forest px-3 py-2 text-sm text-cream disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid h-16 w-16 place-items-center overflow-hidden rounded-full shadow-[0_12px_28px_rgba(28,49,40,0.35)] ring-2 ring-cream transition hover:scale-105"
        aria-label={open ? "Close chat" : "Open restaurant chat"}
      >
        {open ? (
          <span className="grid h-full w-full place-items-center bg-forest text-2xl text-cream">×</span>
        ) : (
          <BrandMark size={64} alt="" className="h-full w-full" />
        )}
      </button>
    </div>
  );
}
