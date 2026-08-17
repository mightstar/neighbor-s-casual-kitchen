import { NextResponse } from "next/server";
import { runVoiceTool } from "@/lib/voice";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    arguments?: string | Record<string, unknown>;
  };
  const name = body.name ?? "";
  if (!name) {
    return NextResponse.json({ error: "Tool name is required." }, { status: 400 });
  }

  try {
    const output = await runVoiceTool(name, body.arguments ?? {});
    return NextResponse.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tool failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
