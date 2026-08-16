import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { chatTools, runChatTool, type ChatUi } from "@/lib/chat";
import { chicagoClock, todayISO } from "@/lib/hours";
import { restaurant } from "@/lib/restaurant";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Add OPENAI_API_KEY to .env and restart the server." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    messages?: Array<{ role?: string; content?: string }>;
  };
  const incoming = (body.messages ?? [])
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-16)
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: String(message.content ?? "").slice(0, 2000),
    }));

  if (!incoming.length || incoming.at(-1)?.role !== "user") {
    return NextResponse.json({ error: "Send a question first." }, { status: 400 });
  }

  const user = await getSessionUser();
  const ui: ChatUi = {};
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are the host at ${restaurant.name} in Lake Highlands, Dallas. Warm, brief, and useful — like a neighbor who knows the room.

Today in America/Chicago is ${todayISO()} ${chicagoClock()}.
The guest is ${user ? `signed in as ${user.name} <${user.email}>` : "not signed in"}.

Use tools for hours, address, menu, open tables, and bookings. Never invent a table as free. Never invent a price.
If they want to book and they are not signed in, tell them to sign in. Do not pretend the booking went through.
When you list open tables, invite them to tap a table chip in the chat.
Default party size 2 and 90 minutes unless they say otherwise.
If a date is a weekday name, resolve it to the next upcoming YYYY-MM-DD from today.
Keep answers to a few short sentences.`,
    },
    ...incoming,
  ];

  try {
    for (let step = 0; step < 5; step += 1) {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0.4,
        messages,
        tools: chatTools,
      });
      const choice = completion.choices[0]?.message;
      if (!choice) break;

      messages.push(choice);
      const calls = choice.tool_calls ?? [];
      if (!calls.length) {
        return NextResponse.json({
          reply: choice.content?.trim() || "What can I help you with?",
          ...ui,
        });
      }

      for (const call of calls) {
        if (call.type !== "function") continue;
        const result = await runChatTool(call.function.name, call.function.arguments, user, ui);
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    }

    return NextResponse.json({
      reply: "I found that — ask me again if you want me to book one of those tables.",
      ...ui,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat is unavailable.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
