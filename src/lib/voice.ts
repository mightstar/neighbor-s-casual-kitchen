import { runChatTool } from "@/lib/chat";
import type { ChatUi } from "@/lib/chat-types";
import type { VoiceEscalate } from "@/lib/voice-client";

export {
  reservePathFromEscalate,
  voiceFirstMessage,
  voiceSpeakingPlan,
  voiceSystemPrompt,
  voiceToolFillers,
  voiceTools,
  type VoiceEscalate,
} from "@/lib/voice-client";

export type VoiceToolResult = {
  result: unknown;
  escalate?: VoiceEscalate;
};

export async function runVoiceTool(
  name: string,
  rawArgs: string | Record<string, unknown>,
): Promise<VoiceToolResult> {
  const args =
    typeof rawArgs === "string"
      ? rawArgs
        ? (JSON.parse(rawArgs) as Record<string, unknown>)
        : {}
      : rawArgs;

  // Voice never books. book_table is rejected if an old prompt still emits it.
  if (name === "book_table" || name === "escalate_booking") {
    const escalate = {
      date: args.date ? String(args.date) : undefined,
      start: args.start ? String(args.start) : undefined,
      durationMinutes: args.durationMinutes ? Number(args.durationMinutes) : undefined,
      partySize: args.partySize ? Number(args.partySize) : undefined,
      notes: args.notes ? String(args.notes) : undefined,
    };
    return {
      escalate,
      result: {
        escalated: true,
        message:
          "Booking is not taken on this line. Tell them to finish on the website reserve page. Do not hold or confirm a table.",
        ...escalate,
      },
    };
  }

  if (name === "get_my_reservations") {
    return {
      result: {
        error: "Voice cannot look up an account. Ask them to sign in on the website.",
      },
    };
  }

  const ui: ChatUi = {};
  const result = await runChatTool(name, JSON.stringify(args), null, ui);
  return { result };
}
