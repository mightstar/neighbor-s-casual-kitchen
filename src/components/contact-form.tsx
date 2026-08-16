"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send that note.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="text-sm text-forest">Got it. We will write back shortly.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Name"
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Phone"
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
      />
      <textarea
        required
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="How can we help?"
        rows={4}
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-copper-deep">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-forest px-5 py-2.5 text-sm text-cream disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
