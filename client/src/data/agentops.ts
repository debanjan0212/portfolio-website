/**
 * Data for the agentic-operations walkthrough.
 *
 * The domain is a wedding, deliberately: everyone understands that a wedding
 * has specialists who each own one thing, and that someone has to decide who
 * to call. That is exactly what an orchestrator does, minus the jargon.
 *
 * Everything here is illustrative. It is a simulation of the request path, not
 * a live system and not anyone's production data.
 */

export type AgentDef = {
  id: string
  name: string
  owns: string
  /** Keywords the orchestrator matches a request against. */
  handles: string[]
  /** Deliberately not all "available" - routing around a busy agent is real. */
  status: "ready" | "busy"
}

export const AGENTS: AgentDef[] = [
  {
    id: "catering",
    name: "Catering",
    owns: "menu, headcount, service timing",
    handles: ["food", "menu", "dinner", "guests", "catering", "meal"],
    status: "ready",
  },
  {
    id: "styling",
    name: "Styling",
    owns: "hair, makeup, getting-ready schedule",
    handles: ["makeup", "hair", "parlour", "styling", "ready", "bride"],
    status: "ready",
  },
  {
    id: "music",
    name: "Music",
    owns: "sound, playlist, live sets",
    handles: ["music", "band", "dj", "sound", "playlist", "song"],
    status: "ready",
  },
  {
    id: "venue",
    name: "Venue & Infra",
    owns: "power, lighting, mandap, seating",
    handles: ["venue", "power", "lighting", "mandap", "stage", "seating", "infra"],
    status: "ready",
  },
  {
    id: "florals",
    name: "Florals",
    owns: "arrangements, delivery windows",
    handles: ["flower", "florals", "garland", "decor", "bouquet"],
    status: "busy",
  },
  {
    id: "transport",
    name: "Transport",
    owns: "vehicles, routes, pickup times",
    handles: ["car", "vehicle", "transport", "pickup", "route", "driver"],
    status: "ready",
  },
]

export type Scenario = {
  id: string
  ask: string
  /** What the context service resolves before intent is decided. */
  context: string[]
  intent: string
  confidence: number
  agentId: string
  answer: string
  /** Realistic-looking span durations, in ms. */
  timings: number[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: "food",
    ask: "Are we still on for 400 dinner plates tonight?",
    context: ["event: Sharma wedding", "date: tonight, 19:30", "role: family organiser"],
    intent: "catering.headcount.confirm",
    confidence: 0.94,
    agentId: "catering",
    answer:
      "Confirmed for 400 covers, service opening at 19:30. Two vegetarian counters and one live counter. Final headcount locks at 17:00 — say the word if it moves.",
    timings: [42, 18, 61, 88, 55, 310],
  },
  {
    id: "flowers",
    ask: "Have the flowers reached the mandap yet?",
    context: ["event: Sharma wedding", "location: main hall", "role: family organiser"],
    intent: "florals.delivery.status",
    confidence: 0.91,
    // Florals is busy, so the orchestrator routes to the team holding the
    // delivery log. The agent shown answering must be the one that answered.
    agentId: "venue",
    answer:
      "Florals is mid-installation and not accepting queries, so Venue & Infra answered from the delivery log: the mandap arrangements were signed in at 14:10 and are being set now.",
    timings: [39, 16, 58, 74, 96, 402],
  },
  {
    id: "music",
    ask: "When does the band start, and can they push it 30 minutes?",
    context: ["event: Sharma wedding", "slot: 20:00 live set", "role: family organiser"],
    intent: "music.schedule.change",
    confidence: 0.88,
    agentId: "music",
    answer:
      "Live set is booked 20:00 to 22:30. A 30-minute push is possible but runs into the venue's sound curfew at 23:00, so the set would shorten rather than shift. Confirm and it'll be rebooked.",
    timings: [45, 21, 66, 91, 60, 356],
  },
  {
    id: "transport",
    ask: "Which car is picking up the groom's family from the airport?",
    context: ["event: Sharma wedding", "pickup: 16:45", "role: family organiser"],
    intent: "transport.assignment.lookup",
    confidence: 0.96,
    agentId: "transport",
    answer:
      "Two vehicles are assigned for the 16:45 pickup, with the drivers briefed on terminal and contact numbers. Buffer is 40 minutes against the current route estimate.",
    timings: [38, 17, 54, 69, 48, 268],
  },
]

export type StageDef = { key: string; label: string; detail: string }

/** The path every request takes, in order. */
export const STAGES: StageDef[] = [
  { key: "sso", label: "SSO sign-in", detail: "identity established" },
  { key: "rum", label: "RUM session", detail: "session + trace id issued" },
  { key: "api", label: "UI backend", detail: "request accepted, span opened" },
  { key: "context", label: "Context service", detail: "who, what, when resolved" },
  { key: "intent", label: "Intent", detail: "classified with confidence" },
  { key: "orchestrator", label: "Orchestrator", detail: "capability + availability match" },
]
