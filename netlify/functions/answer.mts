import type { Config } from "@netlify/functions"
import { blobStore } from "../../shared/agent/store-blobs"
import { entryFromAnswer } from "../../shared/agent/orchestrator"

/**
 * The magic-link endpoint the digest email points at.
 *
 * GET  -> return the question, so the page can show what is being answered
 * POST -> save the answer straight into the collection
 *
 * The single-use token in the link is the only credential. It is long and
 * random, and it stops working the moment the question is answered.
 */
export default async (req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get("id") || ""
  const token = url.searchParams.get("token") || ""

  const pending = await blobStore.getPending(id)
  if (!pending || pending.token !== token) {
    return Response.json({ error: "This link is not valid." }, { status: 404 })
  }

  if (req.method === "GET") {
    return Response.json({
      question: pending.question,
      context: pending.context,
      status: pending.status,
      answer: pending.answer ?? "",
      askedAt: pending.createdAt,
    })
  }

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })

  let body: { answer?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const answer = (body.answer || "").trim()
  if (answer.length < 2) {
    return Response.json({ error: "Answer is empty." }, { status: 400 })
  }

  // Live immediately - the collection is read on every request, so the next
  // visitor gets this without any rebuild or redeploy.
  await blobStore.putEntry(entryFromAnswer(pending.question, answer.slice(0, 5000)))
  await blobStore.putPending({
    ...pending,
    status: "answered",
    answer: answer.slice(0, 5000),
    answeredAt: new Date().toISOString(),
  })

  return Response.json({ ok: true })
}

export const config: Config = { path: "/api/answer" }
