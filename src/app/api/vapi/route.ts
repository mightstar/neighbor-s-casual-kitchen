import { NextResponse } from "next/server";
import { runVoiceTool } from "@/lib/voice";

type ToolCall = {
  id?: string;
  name?: string;
  arguments?: unknown;
  function?: { name?: string; arguments?: unknown; parameters?: unknown };
};

function authorized(request: Request) {
  const expected = process.env.VAPI_PRIVATE_KEY;
  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  const secret = request.headers.get("x-vapi-secret") ?? "";
  return token === expected || secret === expected;
}

function extractCalls(payload: Record<string, unknown>): ToolCall[] {
  const message = (payload.message ?? payload) as Record<string, unknown>;
  const list = (message.toolCallList ??
    message.toolCalls ??
    message.toolWithToolCallList ??
    []) as ToolCall[];
  if (Array.isArray(list) && list.length) return list;
  if (message.type === "function-call" && message.functionCall) {
    return [message.functionCall as ToolCall];
  }
  return [];
}

function callName(call: ToolCall) {
  return call.name ?? call.function?.name ?? "";
}

function callArgs(call: ToolCall) {
  return call.arguments ?? call.function?.arguments ?? call.function?.parameters ?? {};
}

function callId(call: ToolCall) {
  return call.id ?? (call as { toolCall?: { id?: string } }).toolCall?.id ?? "";
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const message = (payload.message ?? payload) as Record<string, unknown>;
  const type = String(message.type ?? "");

  if (type && type !== "tool-calls" && type !== "function-call") {
    return NextResponse.json({ ok: true });
  }

  const calls = extractCalls(payload);
  const results = [];

  for (const call of calls) {
    const name = callName(call);
    const output = await runVoiceTool(name, callArgs(call) as string | Record<string, unknown>);
    results.push({
      name,
      toolCallId: callId(call),
      result: JSON.stringify(output.result),
    });
  }

  return NextResponse.json({ results });
}
