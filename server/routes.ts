import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { orchestrate, entryFromAnswer, type ChatMessage } from "../shared/agent/orchestrator";
import { buildAndSendDigest } from "../shared/agent/digest";
import { fileStore } from "../shared/agent/store-file";
import { seedCollection } from "../shared/agent/seed";
import { resolveConfigs } from "../shared/agent/llm";

/**
 * Dev twins of the Netlify functions. Same orchestrator, same digest builder -
 * only the storage adapter differs (a gitignored JSON file instead of Netlify
 * Blobs), so what you exercise locally is what ships.
 */

const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

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

async function handleChat(req: Request, res: Response) {
  if (rateLimited(req.ip || "unknown")) {
    return res.status(429).json({ error: "Too many questions at once. Give it a minute." });
  }

  const configs = resolveConfigs(process.env);
  if (configs.length === 0) {
    return res.status(503).json({
      error:
        "The assistant isn't configured locally. Put GEMINI_API_KEY (free) in .env and restart.",
    });
  }

  const body = req.body as { messages?: ChatMessage[]; knowledge?: string; email?: string };
  const messages = (body?.messages || [])
    .filter(
      (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0) {
    return res.status(400).json({ error: "No messages supplied." });
  }

  const result = await orchestrate({
    messages,
    baseProfile: (body?.knowledge || "").slice(0, 20000),
    store: fileStore,
    configs,
    askerEmail: body?.email,
    live: { visitorTz: Intl.DateTimeFormat().resolvedOptions().timeZone },
  });

  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader(
    "x-suggestions",
    Buffer.from(JSON.stringify(result.suggestions), "utf8").toString("base64"),
  );
  res.setHeader("access-control-expose-headers", "x-suggestions");

  if (result.kind !== "answer") {
    return res.end(result.message);
  }

  const reader = result.stream.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value, { stream: true }));
  }
  res.end();
}

async function handleAnswer(req: Request, res: Response) {
  const id = String(req.query.id || "");
  const token = String(req.query.token || "");

  const pending = await fileStore.getPending(id);
  if (!pending || pending.token !== token) {
    return res.status(404).json({ error: "This link is not valid." });
  }

  if (req.method === "GET") {
    return res.json({
      question: pending.question,
      context: pending.context,
      status: pending.status,
      answer: pending.answer ?? "",
      askedAt: pending.createdAt,
    });
  }

  const answer = String((req.body as { answer?: string })?.answer || "").trim();
  if (answer.length < 2) {
    return res.status(400).json({ error: "Answer is empty." });
  }

  await fileStore.putEntry(entryFromAnswer(pending.question, answer.slice(0, 5000)));
  await fileStore.putPending({
    ...pending,
    status: "answered",
    answer: answer.slice(0, 5000),
    answeredAt: new Date().toISOString(),
  });

  return res.json({ ok: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", (req, res) => {
    handleChat(req, res).catch((err: unknown) => {
      console.error("chat route failed:", err);
      if (!res.headersSent) {
        // In dev, show the actual upstream reason. Swallowing it behind a
        // generic message meant a provider error looked like a code bug.
        const detail = err instanceof Error ? err.message : String(err);
        res.status(500).json({
          error:
            process.env.NODE_ENV === "development"
              ? `Assistant failed: ${detail}`
              : "The assistant failed unexpectedly.",
        });
      } else {
        res.end();
      }
    });
  });

  app.all("/api/answer", (req, res) => {
    handleAnswer(req, res).catch((err) => {
      console.error("answer route failed", err);
      if (!res.headersSent) res.status(500).json({ error: "Failed to save." });
    });
  });

  // Manual trigger for the nightly digest, so you can test it without waiting
  // until 23:00. Dev only - the deployed version runs on a schedule.
  app.post("/api/digest/run", (_req, res) => {
    buildAndSendDigest({
      store: fileStore,
      siteUrl: process.env.SITE_URL || `http://localhost:${process.env.PORT || 5173}`,
      resendKey: process.env.RESEND_API_KEY || "",
      to: process.env.DIGEST_TO || "",
      from: process.env.DIGEST_FROM || "Portfolio Agent <onboarding@resend.dev>",
    })
      .then((r) => res.json(r))
      .catch((e) => res.status(500).json({ error: String(e) }));
  });

  app.post("/api/seed", (_req, res) => {
    seedCollection(fileStore)
      .then((r) => res.json(r))
      .catch((e) => res.status(500).json({ error: String(e) }));
  });

  // Inspect what the agent currently knows and what is queued.
  app.get("/api/debug/state", async (_req, res) => {
    res.json({
      entries: await fileStore.listEntries(),
      pending: await fileStore.listPending(),
    });
  });

  // Anything else under /api answers JSON, so the client never receives Vite's
  // HTML fallback and tries to render it as a reply.
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  return createServer(app);
}
