# debanjan.das — portfolio

Personal site for **Debanjan Das**, Senior Site Reliability Engineer at Hitachi
Digital Services. A dark, single-canvas React site with an AI assistant that
answers questions about his work — and, when it cannot, asks him and learns the
answer permanently.

Live: [debanjansre.online](https://debanjansre.online)

---

## What makes this different from a template portfolio

Most portfolio sites are a static CV with animations. Two things here are not:

**1. The assistant is grounded, not generative.**
It retrieves from a curated collection and is instructed to emit
`NEEDS_DEBANJAN` rather than fill a gap. That marker is checked *before a single
token reaches the visitor*, so a half-written guess can never be displayed. It
will not invent an employer, a metric, or a date — the failure mode is silence
and an email, not a confident lie.

**2. It learns from Debanjan, on a loop.**

```
visitor asks something new
      ↓
  can't answer  ──→  queued with its conversation context
      ↓
  23:00 IST      ──→  one email, every open question, each with a link
      ↓
  he answers     ──→  written into the collection
      ↓
  next visitor   ──→  answered, in his words, no rebuild, no redeploy
```

The collection is read per request, so an answer is live the moment it is saved.
Quiet days send no email at all.

---

## Architecture

```
client/          React 19 + Vite + Tailwind. One dark canvas, no section
  src/sections/  backgrounds — a fixed ambient field sits behind everything,
  src/lib/       so sections blend by rhythm rather than meeting at an edge.
  src/data/      profile.ts is the single source of truth: the page and the
                 assistant render from the same object and cannot disagree.

shared/agent/    The whole agent, framework-free and runtime-free:
  llm.ts         provider-agnostic (Gemini / Groq / OpenAI / Anthropic)
  retrieve.ts    BM25-ish keyword scoring over the collection
  orchestrator.ts intent → retrieve → answer or escalate
  seed.ts        starting collection, refreshable
  digest.ts      the nightly email
  types.ts       Store interface — the only thing storage must satisfy

netlify/functions/  Production: chat, answer, digest (scheduled)
server/             Dev twins of the same, so `npm run dev` runs the real
                    orchestrator rather than a stub
```

The orchestrator depends on a `Store` interface and an `LlmConfig`, nothing
else. Netlify Blobs in production, a gitignored JSON file in dev — swapping
either is one file.

### Request path

| Step | What happens | Cost |
|---|---|---|
| Classify | intent: work / logistics / contact / off-topic / unknown | tiny call |
| Off-topic | declined immediately | **no model call** |
| Retrieve | keyword scoring over the collection | free, local |
| Answer | model sees *only* retrieved entries + profile | one call |
| Escalate | `NEEDS_DEBANJAN` → queued, visitor told | no extra call |

Deliberately **not** embeddings. The collection is tens of entries; an
embedding call per message would add latency and cost for no accuracy gain.
Revisit past ~500 entries.

---

## Running it

```bash
npm install
cp .env.example .env      # add one LLM key
npm run dev               # http://localhost:5173
```

One key is all that is required. Free providers are chosen first:

| Env var | Provider | Free? |
|---|---|---|
| `GROQ_API_KEY` | Groq | yes, no card |
| `GEMINI_API_KEY` | Google Gemini | yes, no card |
| `OPENAI_API_KEY` | OpenAI | no |
| `ANTHROPIC_API_KEY` | Anthropic | no |

Set `LLM_PROVIDER` to force one. Models fall back automatically when an account
cannot access the configured one, so a tier-gated model name never hard-fails.

Optional, for the nightly digest: `RESEND_API_KEY` and `DIGEST_TO`. Without
them the digest is skipped and logged; everything else still works.

Dev-only helpers:

```bash
curl -X POST localhost:5173/api/seed         # (re)seed the collection
curl -X POST localhost:5173/api/digest/run   # send the digest now
curl localhost:5173/api/debug/state          # what it knows + what's queued
```

### Deploying

Push to `main`. Netlify builds automatically. Set `GROQ_API_KEY` (and the two
Resend variables if you want the email) in **Site configuration → Environment
variables**, then redeploy with cache cleared — variables only reach functions
on a fresh build. Netlify Blobs needs no setup.

---

## Editing the content

Everything factual lives in **`client/src/data/profile.ts`** — roles, projects,
skills, what he is looking for. The page and the assistant both read it, so
they can never drift apart.

The assistant's curated answers live in **`shared/agent/seed.ts`**. Editing an
answer there updates the stored one on the next run. **Answers Debanjan gave
himself are never overwritten** — his words win over a seed permanently.

---

## Design notes

One continuous dark canvas. No section paints its own background; a fixed
ambient layer (two parallax glow fields, a masked telemetry grid, a vignette,
film grain) sits behind everything, so there are no seams to blend.

- One cool accent, used sparingly. Status colours are reserved and never
  reused as decoration.
- Mono type for technical labels, hairline borders, generous whitespace.
- Motion: Lenis smooth scroll, page-load curtain, cursor glow, magnetic
  buttons, per-word headline reveals, parallax depth, and a pinned
  scroll-storytelling section for the OAA work.
- **Every animation is gated behind `prefers-reduced-motion`.**

Bundle: ~342 KB (109 KB gzipped), CSS ~25 KB. Two font families, not
twenty-four.

---

## Roadmap

Ordered by value, not difficulty.

**Multi-agent assistant.** The current orchestrator is one classifier plus one
answerer. The natural next step is specialised agents behind the same
orchestrator — a *retrieval* agent that decides what context is needed, a
*verifier* that checks a drafted answer against the collection before it is
shown, and a *conversation* agent that handles tone and follow-ups. The
orchestrator already owns routing and the `Store` boundary is already clean, so
this is additive rather than a rewrite. The verifier is the valuable one: a
second pass that catches an answer drifting past its evidence.

**Better retrieval.** Keyword scoring is right for tens of entries. Past a few
hundred, move to embeddings with a cached index — the `retrieve` module is a
single pure function, so this swaps behind an unchanged signature.

**Durable rate limiting.** In-memory today, so it resets when a function
instance recycles. Fine for portfolio traffic; a KV store would make it real.

**Answer analytics.** What gets asked most, what escalates most, which answers
lead to contact. The queue already records everything needed.

**Asker follow-up.** When a visitor leaves an email with an escalated question,
notify them once it is answered. The field exists and is stored; only the
send is missing.

**Content.** Candid photography for About, and a writing section on agentic AI
and reliability.

---

## Notes

- The Express server in `server/` is only used in development. On Netlify the
  functions serve `/api/*`; the build's esbuild step for it is vestigial.
- `.env` and `.agent-data/` are gitignored. No key is ever committed, and the
  browser never sees one — the functions proxy every model call server-side.
- Port defaults to 5173, not 5000: macOS AirPlay Receiver squats on 5000 and
  answers with its own "unauthorized" page.
