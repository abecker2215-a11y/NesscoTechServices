import { NextRequest, NextResponse } from "next/server";
import { chatEntries } from "@/lib/chat-knowledge";
import { siteConfig } from "@/lib/config";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildSystemPrompt(): string {
  const knowledgeBase = chatEntries
    .map((e) => `- ${e.title}: ${e.answer}`)
    .join("\n");

  return `You are Nessco Tech Services' AI assistant for nesscotech.com. You help Tampa Bay residents and businesses with IT problems.

RULES:
- Be concise, friendly, and jargon-free
- Always end with a clear next step (link to service, guide, or get-help form)
- For emergencies (ransomware, breach, data loss), tell them to call ${siteConfig.phone} immediately
- Don't make up pricing — only use the rates below
- If you can't help, direct them to /get-help or ${siteConfig.phone}
- Keep responses under 100 words when possible
- If the visitor wants a human, a callback, or to book service, tell them they can file a ticket right here in this chat and get a reference number

PRICING:
- Remote support: $75/hour
- On-site support: $125/hour
- Business plans: Essentials $149/mo, Managed $349/mo, Complete $599/mo
- Hours: Mon-Fri 8am-6pm ET

KNOWLEDGE BASE:
${knowledgeBase}

AVAILABLE LINKS:
- Get Help: /get-help
- Services: /services
- Pricing: /pricing
- Guides: /guides
- Contact: /contact
- Computer Repair: /services/computer-repair
- Wi-Fi & Networking: /services/wifi-networking
- Microsoft 365: /services/microsoft-365
- Security: /services/cybersecurity
- Data Backup: /services/data-backup
- Business IT: /services/business-it
- Remote Support: /services/remote-support`;
}

function findRelevantEntry(query: string) {
  const q = query.toLowerCase();
  let best: (typeof chatEntries)[0] | null = null;
  let bestScore = 0;
  for (const entry of chatEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    const relevant = findRelevantEntry(lastUserMsg.content);

    const apiMessages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt() },
      ...messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const hasAzureKey = !!process.env.AZURE_OPENAI_API_KEY;

    if (hasAzureKey) {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";

      const res = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-06-01`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY!,
        },
        body: JSON.stringify({
          messages: apiMessages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "";
        if (reply) {
          return NextResponse.json({
            reply,
            links: relevant?.links ?? [
              { label: "Start a service request", href: "/get-help" },
              { label: "Browse services", href: "/services" },
            ],
            source: "ai",
          });
        }
      }
    }

    if (relevant) {
      return NextResponse.json({
        reply: relevant.answer,
        links: relevant.links,
        source: "rule",
      });
    }

    return NextResponse.json({
      reply: `I want to make sure you get the right help. Can you tell me a bit more about what's happening? Or call us at ${siteConfig.phone} — we're happy to talk it through.`,
      links: [
        { label: "Start a service request", href: "/get-help" },
        { label: "Browse Fix-It Guides", href: "/guides" },
      ],
      source: "fallback",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}
