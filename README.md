# debanjan.das — portfolio

Personal site for **Debanjan Das**, Senior Site Reliability Engineer at Hitachi
Digital Services.

Live: [debanjansre.online](https://debanjansre.online)

One rule shapes the whole page: **nothing on it is fake.** Every animation
replays a real run of an open-source tool, every status is read live from
GitHub, and every number links back to where it came from.

---

## What is on the page

| Section | What it shows | Where the truth comes from |
|---|---|---|
| Hero | Name, a two-line summary, the three tools with live test status | `data/profile.ts`, GitHub API |
| Watch them work | Argus, IntentOps and agent-harness-sdk replaying real runs | `data/runs.ts`, recorded from each repo's demo command |
| Telemetry | The OpenTelemetry pattern, animated, with a backend you can switch | the Hitachi and Toyota work in `data/profile.ts` |
| Security | Guardrails with links to the code, a guardrail you can try, live scan state, SOC 2 / HIPAA mapping | the three repos, `.github/workflows/security.yml` |
| Experience, About, Contact | Five roles in plain words, certification, intro video | `data/profile.ts` |
| Footer | How fast this page loaded on the visitor's own device, and the commit that is live | measured in the browser |

A **Plain words / Technical** switch rewrites the copy for the reader: plain
by default so anyone can follow it, technical for engineers.

### How the replays are recorded

`client/src/data/runs.ts` holds the output of these commands, run against the
public repos with no API key and no cluster. To refresh a replay, run the
command again and update the file.

| Tool | Command |
|---|---|
| Argus | `make demo-pr` (and `ARGUS_AUDIT_LOG=... python -m argus investigate --scenario evals/scenarios/01-bad-deploy.yaml --json` for the call list) |
| IntentOps | `intentops plan`, `compare`, `check`, `render --cloud all` and `canary` on `examples/payments-api.yaml` |
| agent-harness-sdk | `python -m incident_commander demo --scenario bad-deploy --approve ask` (answered both ways), `--scenario injection`, `--scenario db-pool` |

The guardrail demo in the Security section runs `client/src/lib/guard.ts`, a
line-for-line port of `agent_harness_sdk/guardrails.py`. `tests/guard.test.ts`
pins it to the Python output.

### Found by search engines, AI assistants and link previews

`npm run build` renders the home page to real HTML (`scripts/prerender.mjs`),
so anything that does not run JavaScript still reads the full page. The same
step writes schema.org data (person, credential, the three projects) and
`/llms.txt` from `data/profile.ts`. `robots.txt`, `sitemap.xml`, a canonical
URL and a favicon are in `client/public/`.

### Things the page works out for itself

- **Light or dark** follows the device until the visitor picks one.
- **Reduce motion** is respected: nothing loops, slides or blurs, and every
  replay shows its finished state.
- **Phone or desktop**: the telemetry diagram has a separate tall layout, the
  chat button moves into the nav where a floating one would cover content.
- **Build and scan state** come from the GitHub API through `/api/repos`. If
  GitHub cannot be reached the page shows dates only and says so.

---

## The assistant

**1. It is grounded, not generative.**
It retrieves from a curated collection and is instructed to emit
`NEEDS_DEBANJAN` rather than fill a gap. That marker is checked *before a single
token reaches the visitor*, so a half-written guess can never be displayed.

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

---

## Architecture

```
client/          React 18 + Vite + Tailwind.
  src/sections/  one file per section; stage/ holds the three replays
  src/lib/       prefs (theme, voice, motion), replay engine, live data,
                 page vitals, the guardrail port
  src/data/      profile.ts is the single source of truth for facts: the page,
                 the assistant, the schema data and llms.txt all read it.
                 runs.ts holds the recorded tool runs.

shared/live/     GitHub lookups for build and scan state (used by the
                 function and its dev twin)
scripts/         prerender.mjs: static HTML, schema data, llms.txt
tests/           node:test suites for the live data and the guardrail port

shared/agent/    The whole agent, framework-free and runtime-free:
  llm.ts         provider-agnostic (Gemini / Groq / OpenAI / Anthropic)
  retrieve.ts    BM25-ish keyword scoring over the collection
  orchestrator.ts intent → retrieve → answer or escalate
  seed.ts        starting collection, refreshable
  digest.ts      the nightly email
  types.ts       Store interface — the only thing storage must satisfy

netlify/functions/  Production: chat, answer, digest (scheduled), repos
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

Recommended, for the live build and scan status: `GITHUB_TOKEN`, a fine-grained
token with "Public repositories (read-only)" and nothing else. Without it the
anonymous GitHub limit is shared with everyone on the same address and is
often used up, in which case the page shows dates only.

```bash
npm test          # live-data and guardrail tests
npm run check     # types
npm run build     # build, prerender, bundle the dev server
npm run audit     # known vulnerabilities in what ships
```

Dev-only helpers:

```bash
curl -X POST localhost:5173/api/seed         # (re)seed the collection
curl -X POST localhost:5173/api/digest/run   # send the digest now
curl localhost:5173/api/debug/state          # what it knows + what's queued
```

### Deploying

Merge to `main`. Netlify builds automatically. Set `GROQ_API_KEY`,
`GITHUB_TOKEN` (and the two Resend variables if you want the email) in
**Site configuration → Environment variables**, then redeploy with cache cleared — variables only reach functions
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

One continuous canvas, one token set, two themes. No section paints its own
palette.

- **Liquid glass.** `.glass` and `.panel` are the same material: frosted fill,
  saturated backdrop blur and a specular rim drawn as a masked gradient border.
  Tokens live in `:root` and `[data-theme="light"]` in `index.css`.
- **One accent.** Violet and teal only appear with it, in gradients and as the
  trace and log signal colours. Status colours are never decoration.
- **Motion has a job.** There is one load sequence (the intro settles, the
  three tools come online). After that, things move only to show a real run or
  to answer the visitor. Motion blur is used where something travels: signal
  streaks on the telemetry wires, the token on the agent loop, tab changes.
- **Nothing shifts.** Replay areas reserve their height, fonts are preloaded,
  and the page measures its own layout shift in the footer.
- **Fonts are self-hosted** (Geist and Geist Mono via Fontsource). No request
  leaves the origin.

Security headers, scanning and reporting are described in
[SECURITY.md](SECURITY.md).

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

**Write-ups.** One page per case study and a few posts on tracing AI agents
with OpenTelemetry, collector routing and SLO-gated rollbacks. A single page
can be found; pages that answer a question get referenced.

**Scan workflows in the tool repos.** The Security section shows a scan result
for any repo that has a `security` workflow. Add one to argus-sre-agent,
intentops and agent-harness-sdk and their results appear with no site change.

---

## Notes

- The Express server in `server/` is only used in development. On Netlify the
  functions serve `/api/*`.
- `.env` and `.agent-data/` are gitignored. No key is ever committed, and the
  browser never sees one — the functions proxy every model call server-side.
- Port defaults to 5173, not 5000: macOS AirPlay Receiver squats on 5000 and
  answers with its own "unauthorized" page.
