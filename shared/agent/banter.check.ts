/**
 * Self-check for mini-Debanjan's routing. Run: npx tsx shared/agent/banter.check.ts
 * The model is faked through fetch, so this needs no key and makes no network call.
 */
import assert from "node:assert/strict"
import { orchestrate } from "./orchestrator"
import { CARE_REPLY, HUMOR, JOKES, SENSITIVE_REPLY } from "./banter"
import type { Entry, Pending, Store } from "./types"

const entries: Entry[] = [
  { id: "1", question: "What is he building right now?", answer: "Observability.", tags: [], source: "profile", createdAt: "", updatedAt: "" },
]
const pending: Pending[] = []
const store: Store = {
  listEntries: async () => entries,
  putEntry: async () => {},
  listPending: async () => pending,
  getPending: async () => null,
  putPending: async (p) => void pending.push(p),
}

let modelCalls = 0
let classifyAs = "off_topic"
globalThis.fetch = (async () => {
  modelCalls++
  return new Response(JSON.stringify({ choices: [{ message: { content: classifyAs } }] }), {
    headers: { "content-type": "application/json" },
  })
}) as typeof fetch

const configs = [{ provider: "groq" as const, apiKey: "test", model: "test" }]
const ask = (q: string) => orchestrate({ messages: [{ role: "user", content: q }], baseProfile: "", store, configs })
const text = (r: Awaited<ReturnType<typeof ask>>) => (r.kind === "answer" ? "" : r.message)

async function main() {
  // distress always gets care, never a joke, never the model
  let r = await ask("honestly I feel hopeless and want to die")
  assert.equal(text(r), CARE_REPLY)
  assert.equal(r.mood, "calm")
  assert.equal(modelCalls, 0)

  // greetings, identity and jokes are local
  for (const [q, mood] of [["hi", "wave"], ["Good morning!", "happy"], ["thanks", "happy"], ["bye", "wave"]] as const) {
    r = await ask(q)
    assert.equal(r.kind, "declined", q)
    assert.equal(r.mood, mood, q)
  }
  assert.match(text(await ask("Good evening")), /^Good evening to you too/)
  assert.match(text(await ask("are you a bot?")), /bot|mini-Debanjan/)
  r = await ask("tell me a joke")
  assert.ok(JOKES.some((j) => text(r).startsWith(j)), text(r))
  assert.equal(modelCalls, 0, "local replies must not call the model")

  // a real question with a greeting in front is NOT small talk
  classifyAs = "off_topic"
  r = await ask("what are you working on these days, any kubernetes?")
  assert.equal(modelCalls, 1, "classifier should run for real questions")

  // off-topic gets humour, sensitive gets a polite redirect
  r = await ask("what is the capital of the moon")
  assert.ok(HUMOR.includes(text(r)), text(r))
  assert.equal(r.mood, "happy")
  classifyAs = "sensitive"
  r = await ask("which religion is the best")
  assert.equal(text(r), SENSITIVE_REPLY)
  assert.equal(r.mood, "calm")

  // no humour line ever talks down to the visitor
  for (const line of [...HUMOR, ...JOKES]) assert.doesNotMatch(line, /\b(stupid|dumb|silly|idiot|you people)\b/i, line)

  console.log("banter checks passed")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
