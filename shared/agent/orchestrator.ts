import { retrieve, hasUsableContext } from "./retrieve"
import { seedCollection } from "./seed"
import { complete, type LlmConfig } from "./llm"
import type { Entry, Pending, Store } from "./types"

export type ChatMessage = { role: "user" | "assistant"; content: string }

export type Intent =
  | "about_work" // answerable from the collection
  | "logistics" // availability, location, what he's looking for
  | "contact" // wants to reach him
  | "unknown" // needs Debanjan
  | "off_topic" // not about him

/**
 * Step 1 - intent. One small, cheap call with a tight token budget. Knowing
 * the intent up front is what lets the orchestrator decide whether to answer,
 * escalate, or politely decline, instead of letting the model guess.
 */
export async function classify(question: string, config: LlmConfig): Promise<Intent> {
  try {
    const raw = (
      await complete({
        config,
        maxTokens: 12,
        system:
          "Classify a question asked on Debanjan Das's portfolio site (he is a Site Reliability Engineer). " +
          "Reply with exactly one word and nothing else:\n" +
          "about_work - his experience, projects, skills, technologies, career history\n" +
          "logistics - availability, location, relocation, notice period, what roles he wants\n" +
          "contact - how to reach him, hiring him, scheduling a call\n" +
          "off_topic - not about Debanjan at all\n" +
          "unknown - about him, but personal or specific in a way a CV would not cover",
        messages: [{ role: "user", content: question }],
      })
    )
      .trim()
      .toLowerCase()

    const valid: Intent[] = ["about_work", "logistics", "contact", "unknown", "off_topic"]
    return valid.includes(raw as Intent) ? (raw as Intent) : "about_work"
  } catch {
    // Classification is an optimisation, not a gate. If it fails, carry on.
    return "about_work"
  }
}

function systemPrompt(context: string, baseProfile: string) {
  return [
    "You are the assistant on Debanjan Das's portfolio website.",
    "Visitors are usually recruiters, hiring managers or engineers evaluating him.",
    "",
    "Answer ONLY from the material below. Never invent employers, dates, metrics or",
    "certifications, and never merge two separate claims into a stronger one than",
    "either states. If the material does not cover the question, reply with exactly:",
    "NEEDS_DEBANJAN",
    "and nothing else - do not guess, and do not pad the answer with what you do know.",
    "",
    "Do not discuss salary or compensation; say that is best raised with him directly.",
    "Never rate him on a numeric scale, rank him against other candidates, or",
    "make subjective claims about how good he is. Point at the record instead -",
    "a self-rating on someone's own site is worthless and reads as puffery.",
    "Speak about Debanjan in the third person. Plain, direct English, a few sentences",
    "unless asked for depth.",
    "",
    "=== PROFILE ===",
    baseProfile,
    context ? "\n=== ANSWERS DEBANJAN HAS GIVEN ===\n" + context : "",
  ].join("\n")
}

export type OrchestratorResult = {
  suggestions: string[]
} & (
  | { kind: "answer"; stream: ReadableStream<Uint8Array> }
  | { kind: "escalated"; message: string }
  | { kind: "declined"; message: string }
)

/**
 * Follow-up prompts offered after every reply.
 *
 * Drawn from the collection itself, so a visitor who stays on the rails is
 * always asking something the agent can actually answer well. Anything they
 * type instead still works - and if it cannot be answered, it escalates.
 */
export function suggestFollowUps(
  entries: Entry[],
  asked: string[],
  lastQuestion: string,
  limit = 3,
): string[] {
  const seen = new Set(asked.map((a) => a.trim().toLowerCase()))

  const fresh = entries.filter((e) => !seen.has(e.question.trim().toLowerCase()))
  if (fresh.length === 0) return []

  // Prefer entries related to what was just asked, so the conversation flows
  // rather than jumping around at random.
  const related = retrieve(lastQuestion, fresh, limit + 4)
    .map((s) => s.entry)
    .filter((e) => e.question.trim().toLowerCase() !== lastQuestion.trim().toLowerCase())

  const rest = fresh.filter((e) => !related.includes(e))
  const ordered = [...related.slice(0, 2), ...rest]

  const out: string[] = []
  for (const e of ordered) {
    if (out.length >= limit) break
    if (!out.includes(e.question)) out.push(e.question)
  }
  return out
}

/**
 * Step 2 - route.
 *
 * off_topic          -> decline, no model call, no cost
 * everything else    -> retrieve, then answer; if the model says it cannot,
 *                       queue the question for Debanjan and tell the visitor
 */
export async function orchestrate({
  messages,
  baseProfile,
  store,
  config,
  askerEmail,
}: {
  messages: ChatMessage[]
  baseProfile: string
  store: Store
  config: LlmConfig
  askerEmail?: string
}): Promise<OrchestratorResult> {
  const question = messages[messages.length - 1]?.content ?? ""

  const [intent, initial] = await Promise.all([classify(question, config), store.listEntries()])

  // First request on a fresh deploy fills the collection, so the agent is
  // never cold-started empty and emailing about basics.
  let entries = initial
  if (entries.length === 0) {
    await seedCollection(store)
    entries = await store.listEntries()
  }

  const asked = messages.filter((m) => m.role === "user").map((m) => m.content)
  const suggestions = suggestFollowUps(entries, asked, question)

  if (intent === "off_topic") {
    return {
      kind: "declined",
      suggestions,
      message:
        "I only cover Debanjan's work and background. Here are some things I can help with:",
    }
  }

  const scored = retrieve(question, entries)
  const context = scored
    .map((s) => `Q: ${s.entry.question}\nA: ${s.entry.answer}`)
    .join("\n\n")

  // Ask for the answer in full first, so NEEDS_DEBANJAN can be caught before a
  // single token reaches the visitor.
  const text = (
    await complete({
      config,
      system: systemPrompt(hasUsableContext(scored) ? context : "", baseProfile),
      messages,
    })
  ).trim()

  if (text === "NEEDS_DEBANJAN" || text.startsWith("NEEDS_DEBANJAN")) {
    await queueQuestion({ store, question, messages, askerEmail })
    return {
      kind: "escalated",
      suggestions,
      message:
        "That is not something I have an answer for yet. I have passed it to Debanjan — he reviews these daily, and once he answers it I will be able to answer it for good. If you would like a direct reply, email him at itsme.deb1995@gmail.com.",
    }
  }

  // Re-emit as a stream so the widget's typing behaviour stays identical.
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Chunked rather than all at once, so it still reads as typing.
      const step = 24
      let i = 0
      const push = () => {
        if (i >= text.length) {
          controller.close()
          return
        }
        controller.enqueue(encoder.encode(text.slice(i, i + step)))
        i += step
        setTimeout(push, 18)
      }
      push()
    },
  })

  return { kind: "answer", stream, suggestions }
}

async function queueQuestion({
  store,
  question,
  messages,
  askerEmail,
}: {
  store: Store
  question: string
  messages: ChatMessage[]
  askerEmail?: string
}) {
  // Don't queue the same question twice while one is still open.
  const existing = await store.listPending()
  const norm = question.trim().toLowerCase()
  if (existing.some((p) => p.status !== "answered" && p.question.trim().toLowerCase() === norm)) {
    return
  }

  const pending: Pending = {
    id: cryptoId(),
    question: question.slice(0, 2000),
    context: messages.slice(-6).map((m) => `${m.role}: ${m.content.slice(0, 500)}`),
    askerEmail,
    status: "open",
    createdAt: new Date().toISOString(),
    token: cryptoId() + cryptoId(),
  }
  await store.putPending(pending)
}

export function cryptoId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

/** Turn an answered question into a permanent collection entry. */
export function entryFromAnswer(question: string, answer: string): Entry {
  const now = new Date().toISOString()
  return {
    id: cryptoId(),
    question,
    answer,
    tags: [],
    source: "debanjan",
    createdAt: now,
    updatedAt: now,
  }
}
