import type { Config, Context } from "@netlify/functions"
import { orchestrate, type ChatMessage } from "../../shared/agent/orchestrator"
import { blobStore } from "../../shared/agent/store-blobs"

const MAX_MESSAGES = 20
const MAX_CHARS = 4000

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 12
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })

  const ip = context.ip || req.headers.get("x-nf-client-connection-ip") || "unknown"
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many questions at once. Give it a minute." }, { status: 429 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "The assistant is not configured yet. ANTHROPIC_API_KEY is missing." },
      { status: 503 },
    )
  }

  let body: { messages?: ChatMessage[]; knowledge?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const messages = (body.messages || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

  if (messages.length === 0) {
    return Response.json({ error: "No messages supplied." }, { status: 400 })
  }

  try {
    const result = await orchestrate({
      messages,
      baseProfile: (body.knowledge || "").slice(0, 20000),
      store: blobStore,
      apiKey,
      askerEmail: body.email,
    })

    // Suggestions ride along as a header so the body stays a clean text
    // stream. Base64 keeps non-ASCII safe in a header value.
    const headers = {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-suggestions": Buffer.from(JSON.stringify(result.suggestions), "utf8").toString("base64"),
      "access-control-expose-headers": "x-suggestions",
    }

    if (result.kind === "answer") return new Response(result.stream, { headers })

    // Escalations and declines are plain text too, so the widget renders them
    // exactly like any other reply.
    return new Response(result.message, { headers })
  } catch (err) {
    console.error("orchestrator failed", err)
    return Response.json(
      { error: "The assistant is having trouble right now. Please try again." },
      { status: 502 },
    )
  }
}

export const config: Config = { path: "/api/chat" }
