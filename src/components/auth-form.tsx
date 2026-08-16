"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: "login" | "signup";
  nextPath: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = (await res.json()) as {
      error?: string;
      user?: { id: string; name: string; email: string };
    };
    setBusy(false);
    if (!res.ok || !data.user) {
      setError(data.error ?? "Could not complete that.");
      return;
    }
    dispatch(setUser(data.user));
    router.push(nextPath.startsWith("/") ? nextPath : "/account");
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-[28px] bg-white p-6">
      {mode === "signup" && (
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
        />
      )}
      <input
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder={mode === "signup" ? "Password (8+ characters)" : "Password"}
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-copper-deep">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-copper py-3 text-sm text-white disabled:opacity-60"
      >
        {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="text-copper">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have one?{" "}
            <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-copper">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
