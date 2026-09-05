import type { Config, Context } from "@netlify/functions"

/**
 * "Ask about Debanjan" agent endpoint.
 *
 * Proxies to the Anthropic Messages API so the key never reaches the browser.
 * Set ANTHROPIC_API_KEY in the Netlify site environment variables.
 * Optionally set AGENT_MODEL to pin a different model.
 */

const MODEL = process.env.AGENT_MODEL || "claude-sonnet-4-5"
const MAX_MESSAGES = 20
const MAX_CHARS = 4000

type ChatMessage = { role: "user" | "assistant"; content: string }

function systemPrompt(knowledge: string) {
  return [
    "You are the assistant embedded in Debanjan Das's portfolio website.",
    "Visitors are usually recruiters, hiring managers or engineers evaluating him.",
    "",
    "Rules:",
    "- Answer only from the profile below. If something is not covered, say you don't have that detail and point them at the contact form.",
    "- Never invent employers, dates, metrics, certifications or salary expectations.",
    "- Keep answers to a few sentences unless asked for depth. Plain, direct English.",
    "- Speak about Debanjan in the third person. You are his site's assistant, not him.",
    "- Decline anything unrelated to his work and redirect politely.",
    "",
    "PROFILE",
    knowledge,
  ].join("\n")
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "The assistant is not configured yet. ANTHROPIC_API_KEY is missing." },
      { status: 503 },
    )
  }

  let body: { messages?: ChatMessage[]; knowledge?: string }
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
      system: systemPrompt(body.knowledge || ""),
      messages,
      stream: true,
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    console.error("anthropic upstream error", upstream.status, detail.slice(0, 500))
    return Response.json(
      { error: "The assistant is having trouble right now. Please try again." },
      { status: 502 },
    )
  }

  // Re-emit only the text deltas, so the browser never sees the raw API shape.
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ""

  const stream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        if (!line.startsWith("data:")) continue
        const payload = line.slice(5).trim()
        if (!payload || payload === "[DONE]") continue
        try {
          const event = JSON.parse(payload)
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        } catch {
          // Ignore partial or non-JSON keepalive frames.
        }
      }
    },
  })

  return new Response(upstream.body.pipeThrough(stream), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}

export const config: Config = {
  path: "/api/chat",
}
