import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

/**
 * Dev-time twin of netlify/functions/chat.mts.
 *
 * In production Netlify serves /api/chat from the function. Locally there is
 * no function runtime, and Vite's catch-all was answering /api/chat with
 * index.html - which the widget then streamed into the chat as raw HTML.
 * This route makes `npm run dev` behave like production.
 */

const MODEL = process.env.AGENT_MODEL || "claude-sonnet-4-5";

// Same per-IP throttle the deployed function applies, so dev behaves like
// production rather than being quietly more permissive.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}
const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function systemPrompt(knowledge: string) {
  return [
    "You are the assistant embedded in Debanjan Das's portfolio website.",
    "Visitors are usually recruiters, hiring managers or engineers evaluating him.",
    "",
    "Rules:",
    "- Answer only from the profile below. If something is not covered, say you don't have that detail and point them at his email.",
    "- Never invent employers, dates, metrics or certifications.",
    "- Do not discuss salary or compensation expectations; say that is best raised with him directly.",
    "- Keep answers to a few sentences unless asked for depth. Plain, direct English.",
    "- Speak about Debanjan in the third person. You are his site's assistant, not him.",
    "- Decline anything unrelated to his work and redirect politely.",
    "",
    "PROFILE",
    knowledge,
  ].join("\n");
}

async function handleChat(req: Request, res: Response) {
  if (rateLimited(req.ip || "unknown")) {
    return res.status(429).json({ error: "Too many questions at once. Give it a minute." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error:
        "The assistant isn't configured locally. Set ANTHROPIC_API_KEY and restart the dev server.",
    });
  }

  const body = req.body as { messages?: ChatMessage[]; knowledge?: string };
  const messages = (body?.messages || [])
    .filter(
      (m) =>
        m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0) {
    return res.status(400).json({ error: "No messages supplied." });
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      system: systemPrompt(body?.knowledge || ""),
      messages,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("anthropic upstream error", upstream.status, detail.slice(0, 500));
    return res
      .status(502)
      .json({ error: "The assistant is having trouble right now. Please try again." });
  }

  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload);
        if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
          res.write(event.delta.text);
        }
      } catch {
        // partial or keepalive frame
      }
    }
  }
  res.end();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", (req, res) => {
    handleChat(req, res).catch((err) => {
      console.error("chat route failed", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "The assistant failed unexpectedly." });
      } else {
        res.end();
      }
    });
  });

  // Anything else under /api is genuinely missing - answer as JSON so the
  // client never receives Vite's HTML fallback and try to render it.
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  return createServer(app);
}
