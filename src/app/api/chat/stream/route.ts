import { NextRequest } from "next/server";
import { buildSystemPrompt, findRelevantEntry, getDefaultLinks, classifyIntent, isAzureConfigured } from "@/lib/chat-server";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface StreamChunk {
  delta: string;
  done: boolean;
  links?: { label: string; href: string }[];
  source?: "ai" | "rule" | "fallback";
  intent?: "support" | "sales" | "general";
}

const MAX_MESSAGES = 50;
const MAX_MESSAGE_CHARS = 2000;
const AZURE_TIMEOUT_MS = 15000;
const MAX_AI_REPLY_CHARS = 1200;

function sendSSE(controller: ReadableStreamDefaultController, data: object): void {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

function streamText(
  controller: ReadableStreamDefaultController,
  text: string,
  links: { label: string; href: string }[],
  source: StreamChunk["source"],
  intent: StreamChunk["intent"],
  signal?: AbortSignal
): void {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) return;
    const chunk = i === 0 ? "" : " " + words[i];
    sendSSE(controller, { delta: chunk, done: false, links, source, intent });
  }
}

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AZURE_TIMEOUT_MS);

  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: "Too many messages in conversation" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const m of messages) {
      if (typeof m.content !== "string" || m.content.length > MAX_MESSAGE_CHARS) {
        return new Response(
          JSON.stringify({ error: "Message too long" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) {
      return new Response(
        JSON.stringify({ error: "No user message found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Rate limit by IP
    const ip = getClientIp(req);
    const limit = checkRateLimit(`chat-stream:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
    if (!limit.ok) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(limit.retryAfterSeconds),
          },
        }
      );
    }

    const relevant = findRelevantEntry(lastUserMsg.content);
    const intent = classifyIntent(lastUserMsg.content, messages.slice(-5).map((m) => m.content));

    const apiMessages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt() },
      ...messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const azureConfigured = isAzureConfigured();

    const stream = new ReadableStream({
      async start(ctl) {
        let aiProducedOutput = false;
        let aiReplyChars = 0;

        try {
          if (azureConfigured && !controller.signal.aborted) {
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
            const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";

            const res = await fetch(
              `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-06-01`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "api-key": process.env.AZURE_OPENAI_API_KEY!,
                },
                body: JSON.stringify({
                  messages: apiMessages,
                  max_tokens: 300,
                  temperature: 0.7,
                  stream: true,
                }),
                signal: controller.signal,
              }
            );

            if (res.ok && res.body && !controller.signal.aborted) {
              const reader = res.body.getReader();
              const decoder = new TextDecoder();
              let fullReply = "";

              while (true) {
                if (controller.signal.aborted) break;
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
                for (const line of lines) {
                  const data = line.slice(6);
                  if (data === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(data);
                    // Validate streamed chunk structure: must have choices[0].delta.content
                    const delta = parsed.choices?.[0]?.delta?.content ?? "";
                    if (delta) {
                      // Enforce per-reply size cap to prevent runaway responses.
                      if (aiReplyChars + delta.length > MAX_AI_REPLY_CHARS) break;
                      fullReply += delta;
                      aiReplyChars += delta.length;
                      aiProducedOutput = true;
                      sendSSE(ctl, { delta, done: false, links: relevant?.links ?? getDefaultLinks(), source: "ai", intent });
                    }
                  } catch {
                    // ignore parse errors
                  }
                }
              }

              if (fullReply.trim() && !controller.signal.aborted) {
                sendSSE(ctl, { delta: "", done: true, links: relevant?.links ?? getDefaultLinks(), source: "ai", intent });
                ctl.close();
                return;
              }
            }
          }

          // Rule-based fallback (Azure unavailable, failed, or produced no output)
          if (!aiProducedOutput && !controller.signal.aborted && relevant) {
            streamText(
              ctl,
              relevant.answer,
              relevant.links,
              "rule",
              intent,
              controller.signal
            );
            if (!controller.signal.aborted) {
              sendSSE(ctl, { delta: "", done: true, links: relevant.links, source: "rule", intent });
            }
            ctl.close();
            return;
          }

          // Ultimate fallback
          if (!controller.signal.aborted) {
            const fallback = `I want to make sure you get the right help. Can you tell me a bit more about what's happening? Or call us at ${siteConfig.phone} — we're happy to talk it through.`;
            streamText(ctl, fallback, getDefaultLinks(), "fallback", intent, controller.signal);
            if (!controller.signal.aborted) {
              sendSSE(ctl, { delta: "", done: true, links: getDefaultLinks(), source: "fallback", intent });
            }
            ctl.close();
          }
        } catch {
          if (!controller.signal.aborted && !aiProducedOutput) {
            const errorMsg = "Something went wrong. Please try again or call us.";
            streamText(ctl, errorMsg, getDefaultLinks(), "fallback", intent, controller.signal);
            if (!controller.signal.aborted) {
              sendSSE(ctl, { delta: "", done: true, links: getDefaultLinks(), source: "fallback", intent });
            }
          }
          ctl.close();
        } finally {
          clearTimeout(timeoutId);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch {
    clearTimeout(timeoutId);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again or call us." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
