import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  voiceFirstMessage,
  voiceSpeakingPlan,
  voiceSystemPrompt,
  voiceToolFillers,
  voiceTools,
} from "../src/lib/voice-client";

function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] == null) process.env[key] = value;
    }
  } catch {
    // Use the process environment when .env is absent.
  }
}

loadEnv();

const API = "https://api.vapi.ai";

type VapiTool = {
  id: string;
  type?: string;
  function?: { name?: string };
  server?: { url?: string };
};

type VapiAssistant = {
  id: string;
  name?: string;
  model?: {
    provider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    emotionRecognitionEnabled?: boolean;
    toolIds?: string[];
    messages?: Array<{ role?: string; content?: string }>;
  };
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} in .env`);
  }
  return value;
}

function webhookServer() {
  const raw = (process.env.VAPI_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(
    /\/$/,
    "",
  );
  if (!raw.startsWith("https://")) return undefined;
  const secret = required("VAPI_PRIVATE_KEY");
  return {
    url: `${raw}/api/vapi`,
    timeoutSeconds: 20,
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    secret,
  };
}

async function vapi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${required("VAPI_PRIVATE_KEY")}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as T & { message?: string }) : ({} as T);
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} failed (${response.status}): ${text}`);
  }
  return body;
}

async function main() {
  const assistantId = required("NEXT_PUBLIC_VAPI_ASSISTANT_ID");
  const server = webhookServer();
  const listed = await vapi<VapiTool[] | { results?: VapiTool[] }>("/tool");
  const existing = Array.isArray(listed) ? listed : (listed.results ?? []);
  const byName = new Map(
    existing
      .filter((tool) => tool.function?.name)
      .map((tool) => [tool.function!.name as string, tool]),
  );

  const toolIds: string[] = [];

  for (const tool of voiceTools) {
    const name = tool.function.name;
    const payload = {
      type: "function" as const,
      function: tool.function,
      messages: [
        {
          type: "request-start" as const,
          content: voiceToolFillers[name] ?? "One moment.",
        },
      ],
      ...(server ? { server } : {}),
    };

    const found = byName.get(name);
    const saved = found
      ? await vapi<VapiTool>(`/tool/${found.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await vapi<VapiTool>("/tool", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    toolIds.push(saved.id);
    console.log(`${found ? "updated" : "created"} tool ${name} ${saved.id}`);
  }

  const assistant = await vapi<VapiAssistant>(`/assistant/${assistantId}`);
  const model = assistant.model ?? {};

  await vapi(`/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: assistant.name || "Neighbor's Casual Kitchen host",
      firstMessage: voiceFirstMessage,
      clientMessages: [
        "transcript",
        "tool-calls",
        "function-call",
        "hang",
        "speech-update",
        "status-update",
      ],
      serverMessages: ["tool-calls", "end-of-call-report"],
      ...voiceSpeakingPlan,
      ...(server ? { server } : {}),
      model: {
        provider: model.provider ?? "openai",
        model: model.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        ...(model.temperature != null ? { temperature: model.temperature } : {}),
        ...(model.maxTokens != null ? { maxTokens: model.maxTokens } : {}),
        ...(model.emotionRecognitionEnabled != null
          ? { emotionRecognitionEnabled: model.emotionRecognitionEnabled }
          : {}),
        toolIds,
        messages: [{ role: "system", content: voiceSystemPrompt() }],
      },
    }),
  });

  console.log(`updated assistant ${assistantId}`);
  console.log(`tools: ${toolIds.join(", ")}`);
  console.log(
    server
      ? `webhook: ${server.url}`
      : "no public https webhook — Vapi will send tool-calls to the browser; local /api/voice/tools still runs them. Set NEXT_PUBLIC_SITE_URL or VAPI_SERVER_URL to https://... and re-run.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
