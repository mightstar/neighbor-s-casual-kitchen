"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { readJson } from "@/lib/http";
import {
  reservePathFromEscalate,
  voiceFirstMessage,
  voiceSpeakingPlan,
  voiceSystemPrompt,
  voiceTools,
} from "@/lib/voice-client";
import { restaurant } from "@/lib/restaurant";

type Line = { id: string; role: "user" | "assistant"; text: string };

function publicSite() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return url.startsWith("https://") ? url.replace(/\/$/, "") : "";
}

export function VoiceWidget() {
  const router = useRouter();
  const vapiRef = useRef<import("@vapi-ai/web").default | null>(null);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [volume, setVolume] = useState(0);

  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  useEffect(() => {
    const open = () => {
      void toggle(true);
    };
    window.addEventListener("nck-open-voice", open);
    return () => window.removeEventListener("nck-open-voice", open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!publicKey || typeof window === "undefined") return;
    let cancelled = false;

    import("@vapi-ai/web").then(({ default: Vapi }) => {
      if (cancelled) return;
      const client = new Vapi(publicKey);
      vapiRef.current = client;

      client.on("call-start", () => {
        setLive(true);
        setError("");
        setLines([
          {
            id: "start",
            role: "assistant",
            text: "You're on with the host. Ask about hours, the menu, or what's open.",
          },
        ]);
      });
      client.on("call-end", () => {
        setLive(false);
        setSpeaking(false);
      });
      client.on("speech-start", () => setSpeaking(true));
      client.on("speech-end", () => setSpeaking(false));
      client.on("volume-level", (level: number) => setVolume(level));
      client.on("error", (event: unknown) => {
        const message = event instanceof Error ? event.message : "The call could not start.";
        setError(message);
        setLive(false);
      });
      client.on("message", (message: Record<string, unknown>) => {
        void handleMessage(client, message);
      });
      setReady(true);
    });

    return () => {
      cancelled = true;
      vapiRef.current?.stop();
      vapiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  async function handleMessage(
    client: import("@vapi-ai/web").default,
    message: Record<string, unknown>,
  ) {
    if (message.type === "transcript" && message.transcriptType === "final") {
      const text = String(message.transcript ?? "");
      const role = message.role === "user" ? "user" : "assistant";
      if (text) {
        setLines((current) => [...current.slice(-12), { id: `${Date.now()}`, role, text }]);
      }
    }

    if (message.type !== "tool-calls" && message.type !== "function-call") return;

    const raw = (message.toolCallList ??
      message.toolWithToolCallList ??
      message.toolCalls ??
      (message.functionCall ? [message.functionCall] : [])) as Array<{
      id?: string;
      name?: string;
      arguments?: unknown;
      function?: { name?: string; arguments?: unknown };
      toolCall?: { id?: string; name?: string; parameters?: unknown };
    }>;

    for (const call of raw) {
      const name = call.name ?? call.function?.name ?? call.toolCall?.name ?? "";
      const args = call.arguments ?? call.function?.arguments ?? call.toolCall?.parameters ?? {};
      if (!name) continue;

      const data = await readJson<{
        result?: unknown;
        escalate?: {
          date?: string;
          start?: string;
          durationMinutes?: number;
          partySize?: number;
          notes?: string;
        };
      }>(
        await fetch("/api/voice/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, arguments: args }),
        }),
      );

      if (data.escalate) {
        router.push(reservePathFromEscalate(data.escalate));
      }

      if (!publicSite()) {
        client.send({
          type: "add-message",
          triggerResponseEnabled: true,
          message: {
            role: "system",
            content: `Tool ${name} finished. Result: ${JSON.stringify(data.result)}. Speak this to the guest now.`,
          },
        });
      }
    }
  }

  async function toggle(forceStart = false) {
    const client = vapiRef.current;
    if (!client || !assistantId) {
      setError("Add NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID, then restart.");
      return;
    }

    if (live && !forceStart) {
      client.stop();
      return;
    }

    const serverUrl = publicSite() ? `${publicSite()}/api/vapi` : undefined;
    const tools = voiceTools.map((tool) =>
      serverUrl ? { ...tool, server: { url: serverUrl } } : tool,
    );

    try {
      await client.start(assistantId, {
        firstMessage: voiceFirstMessage,
        ...voiceSpeakingPlan,
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: voiceSystemPrompt() }],
          tools,
        },
        // Vapi's published types mark this as one string; the API takes the list.
        clientMessages: [
          "transcript",
          "tool-calls",
          "function-call",
          "hang",
          "speech-update",
          "status-update",
        ],
      } as unknown as Parameters<import("@vapi-ai/web").default["start"]>[1]);
    } catch (event) {
      setError(event instanceof Error ? event.message : "Could not start the call.");
    }
  }

  if (!publicKey || !assistantId) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3">
      {live && (
        <section className="w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_20px_60px_rgba(27,23,18,0.18)]">
          <header className="flex items-center justify-between bg-forest px-4 py-3 text-cream">
            <div className="flex items-center gap-2.5">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full ${
                  speaking ? "bg-copper" : "bg-forest-deep"
                }`}
                style={{ transform: `scale(${1 + volume * 0.15})` }}
              >
                <BrandMark size={36} alt="" />
              </span>
              <div>
                <p className="display text-xl leading-none">Call the host</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sand">
                  {speaking ? "Speaking" : "Listening"} · {restaurant.phone}
                </p>
              </div>
            </div>
            <button type="button" onClick={() => void toggle()} className="text-sm text-cream/80">
              Hang up
            </button>
          </header>
          <div className="max-h-48 space-y-2 overflow-y-auto px-3 py-3">
            {lines.map((line) => (
              <p
                key={line.id}
                className={`rounded-2xl px-3 py-2 text-sm ${
                  line.role === "user" ? "ml-8 bg-forest text-cream" : "mr-8 bg-white"
                }`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </section>
      )}

      {error && (
        <p className="max-w-[220px] rounded-2xl bg-white px-3 py-2 text-xs text-copper-deep shadow">
          {error}
        </p>
      )}

      {!live && (
        <a
          href={`tel:${restaurant.phoneTel}`}
          className="rounded-full bg-white px-3 py-1.5 text-xs text-forest shadow"
        >
          {restaurant.phone}
        </a>
      )}
      <button
        type="button"
        disabled={!ready}
        onClick={() => void toggle()}
        className={`grid h-14 w-14 place-items-center rounded-full shadow-[0_12px_28px_rgba(28,49,40,0.35)] ring-2 ring-cream transition hover:scale-105 disabled:opacity-60 ${
          live ? "bg-copper text-white" : "bg-forest text-cream"
        }`}
        aria-label={live ? "Hang up" : "Call the restaurant host"}
      >
        {live ? (
          <span className="text-lg">■</span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
            <path d="M6.6 10.8c1.4 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
