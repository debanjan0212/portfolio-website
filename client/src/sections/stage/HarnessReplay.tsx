import { useEffect, useMemo, useState } from "react"
import { Check, Lock, X } from "lucide-react"
import { harness, stages, type HarnessScenario } from "@/data/runs"
import { usePrefs, useSay } from "@/lib/prefs"
import { useReplay, type Beat } from "@/lib/replay"
import Screen from "./Screen"

type Answer = "approved" | "denied" | null

/** "service_health(service=checkout)" said plainly. */
function plainLookup(call: string): string {
  const tool = call.slice(0, call.indexOf("("))
  const about = /(?:service|query)=([\w-]+)/.exec(call)?.[1] ?? ""
  const what: Record<string, string> = {
    service_health: "health numbers",
    service_dependencies: "what it depends on",
    similar_incidents: "past incidents like this",
    recent_deploys: "recent releases",
    search_logs: "error logs",
  }
  return `${about}: ${what[tool] ?? tool}`
}

function plan(s: HarnessScenario) {
  const n = s.evidence.length
  // alert, each read-only lookup, analysis, decision, (approval gate), outcome
  const beats: Beat[] = [{ ms: 1700 }, ...s.evidence.map(() => ({ ms: 380 })), { ms: 1900 }, { ms: 1900 }]
  if (s.needsApproval) beats.push({ ms: 0, gate: true })
  beats.push({ ms: 0 })
  return { beats, analysis: n + 1, decision: n + 2, gate: s.needsApproval ? n + 3 : -1, outcome: beats.length - 1 }
}

export default function HarnessReplay({ active }: { active: boolean }) {
  const say = useSay()
  const { reduced, voice } = usePrefs()
  const [id, setId] = useState<HarnessScenario["id"]>("bad-deploy")
  const [answer, setAnswer] = useState<Answer>(null)
  const s = harness.scenarios.find((x) => x.id === id)!
  const p = useMemo(() => plan(s), [s])
  const r = useReplay(p.beats, { active, reduced, key: id })
  const at = r.at
  const n = s.evidence.length

  const pick = (next: HarnessScenario["id"]) => {
    setAnswer(null)
    setId(next)
  }
  const replay = () => {
    setAnswer(null)
    r.restart()
  }
  const decide = (a: Exclude<Answer, null>) => {
    setAnswer(a)
    r.advance()
  }

  const atOutcome = at >= p.outcome
  const outcome = atOutcome ? (answer === "denied" && s.outcomes.denied ? s.outcomes.denied : s.outcomes.approved) : null
  const denied = atOutcome && answer === "denied"

  // which of the four stages the run is in: READ 0, ANALYSE 1, DECIDE 2, ACT 3
  const stage = at < 1 ? -1 : at <= n ? 0 : at === p.analysis ? 1 : at === p.decision || at === p.gate ? 2 : denied ? 2 : 3
  const [moving, setMoving] = useState(false)
  useEffect(() => {
    if (stage < 0 || reduced) return
    setMoving(true)
    const t = window.setTimeout(() => setMoving(false), 720)
    return () => window.clearTimeout(t)
  }, [stage, reduced])

  const evidenceShown = Math.max(0, Math.min(n, at))
  const flagged = !!s.flag && evidenceShown === n
  const steps = s.needsApproval ? 6 : 5
  const step = at < 1 ? 1 : at <= n ? 2 : at === p.analysis ? 3 : at === p.decision ? 4 : at === p.gate ? 5 : steps

  const caption =
    at < 1
      ? s.plain
      : at <= n
        ? say("First it gathers evidence, with tools that can only read.", "READ: read-only tools, inside a step and tool-call budget.")
        : at === p.analysis
          ? say("Then it works out what is wrong and how serious it is.", "ANALYSE: severity and scope, from the evidence only.")
          : at === p.decision
            ? say("It picks one action.", "DECIDE: exactly one action, checked against policy written in code.")
            : at === p.gate
              ? say("Before it changes anything, it has to ask. You are the human here.", "ACT is gated: an Approver has to answer before the action runs.")
              : outcome!.plain

  const gateClass = !s.needsApproval ? "" : at === p.gate ? "is-waiting" : atOutcome ? (denied ? "is-shut" : "is-open") : ""

  return (
    <Screen
      command={s.command}
      step={step}
      steps={steps}
      say={caption}
      progress={r.progress}
      done={r.done}
      paused={r.paused}
      onToggle={r.toggle}
      onReplay={replay}
      foot={
        <>
          <span>{say("every step is recorded", "every stage emits OpenTelemetry traces, logs and metrics")}</span>
          <span>
            {say("rules live in code, not in the prompt", "guardrails run in code, never in the prompt")}
          </span>
          <span>
            tested on Python <b>3.11 to 3.13</b>
          </span>
        </>
      }
    >
      <div className="hpick" role="group" aria-label="Pick an incident">
        {harness.scenarios.map((x) => (
          <button key={x.id} aria-pressed={x.id === id} onClick={() => pick(x.id)}>
            {x.label}
          </button>
        ))}
      </div>

      <div className="htrack">
        <div className="hrail" aria-hidden>
          <i style={{ transform: `scaleX(${Math.max(0, stage) / 3})` }} />
        </div>
        {stage >= 0 && <div className={`htoken${moving ? " is-moving" : ""}`} style={{ transform: `translateX(${(stage / 3) * 100}%)` }} aria-hidden />}
        {s.needsApproval && (
          <span className={`hgate ${gateClass}`} title="Human approval">
            {atOutcome ? denied ? <X size={13} /> : <Check size={13} /> : <Lock size={12} />}
            <span className="sr-only">Human approval gate</span>
          </span>
        )}
        {stages.map((st, i) => (
          <div key={st.id} className={`hstage${i === stage ? " is-now" : ""}${i < stage || (i === stage && atOutcome && !denied) ? " is-done" : ""}`}>
            <b>{st.id}</b>
            <small>{st.plain}</small>
          </div>
        ))}
      </div>

      <div className="well hlog term" aria-label="What the agent printed">
        <div className="is-hi">
          <span>ALERT</span>
          <span>{s.alert}</span>
        </div>
        {evidenceShown > 3 && (
          <div className="is-more">
            <span>evidence</span>
            <span>
              {evidenceShown - 3} earlier {say("lookups", "read-only calls")}
            </span>
          </div>
        )}
        {s.evidence.slice(Math.max(0, evidenceShown - 3), evidenceShown).map((e, i) => (
          <div key={`${evidenceShown}-${i}`}>
            <span>evidence</span>
            <span>{voice === "simple" ? plainLookup(e) : e}</span>
          </div>
        ))}
        {flagged && (
          <div className="is-flag">
            <span>guardrail</span>
            <span>{voice === "simple" ? 'A log line said "ignore previous instructions". Flagged, and treated as data.' : s.flag}</span>
          </div>
        )}
        {at >= p.analysis && (
          <div className="is-hi">
            <span>analysis</span>
            <span>{s.analysis}</span>
          </div>
        )}
        {at >= p.decision && (
          <div className="is-hi">
            <span>decision</span>
            <span>{voice === "simple" ? s.decisionPlain : s.decision}</span>
          </div>
        )}
        {voice === "technical" &&
          outcome?.lines.map((l) => {
            const [k, ...rest] = l.split(/\s+/)
            return (
              <div key={l}>
                <span>{k}</span>
                <span>{rest.join(" ")}</span>
              </div>
            )
          })}
      </div>

      <div className={`hend${s.needsApproval ? " is-gated" : ""}`}>
        {at === p.gate && (
          <div className="happrove" role="group" aria-label="Approval request">
            <p>The agent wants to: {s.decisionPlain.toLowerCase().replace(/\.$/, "")}. Allow it?</p>
            <small>
              {voice === "technical" && s.why ? `why: ${s.why}. ` : ""}Nothing changes until you answer.
            </small>
            <div className="happrove-btns">
              <button className="is-yes" onClick={() => decide("approved")}>
                Approve
              </button>
              <button className="is-no" onClick={() => decide("denied")}>
                Deny
              </button>
            </div>
          </div>
        )}

        {outcome && (
          <div className={`hout ${outcome.status.includes("ESCALATED") ? "is-human" : "is-ok"}`}>
            <strong>INCIDENT {outcome.status}</strong>
            <p>{outcome.plain}</p>
          </div>
        )}
      </div>
    </Screen>
  )
}
