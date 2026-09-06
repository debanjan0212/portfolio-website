import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { AGENTS, SCENARIOS, STAGES, type Scenario } from "@/data/agentops"
import { RevealWords, Rise, useReducedMotion } from "@/lib/motion"

/**
 * An agentic request, walked end to end and rendered as a distributed trace.
 *
 * Every stage is a span. That framing is the point: an agentic system is not
 * magic, it is a request path, and if you instrument it like one you can see
 * exactly where a decision was made and why. Which is the job.
 *
 * Illustrative throughout - a simulation of the path, not a live system.
 */

type Phase = number // -1 idle, 0..STAGES.length-1 running a stage, STAGES.length done

export default function AgentOps() {
  const reduced = useReducedMotion()
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0])
  const [phase, setPhase] = useState<Phase>(-1)
  const timers = useRef<number[]>([])

  const agent = AGENTS.find((a) => a.id === scenario.agentId)!
  const total = scenario.timings.reduce((a, b) => a + b, 0)

  function clear() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function run(next: Scenario) {
    clear()
    setScenario(next)
    setPhase(reduced ? STAGES.length : 0)
    if (reduced) return

    // Each stage advances after a beat proportional to its own span, so the
    // pacing reflects the timings actually shown in the waterfall.
    let elapsed = 0
    STAGES.forEach((_, i) => {
      elapsed += Math.max(260, scenario.timings[i] * 1.6)
      timers.current.push(
        window.setTimeout(() => setPhase(i + 1), elapsed) as unknown as number,
      )
    })
  }

  useEffect(() => clear, [])

  const running = phase >= 0 && phase < STAGES.length
  const done = phase >= STAGES.length

  return (
    <section id="agentops" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-shell">
        <p className="mono-label">Agentic operations</p>
        <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.25rem)]">
          <RevealWords text="One question." />
          <br />
          <span className="text-mid">
            <RevealWords text="Six specialists. One trace." delay={0.1} />
          </span>
        </h2>

        <Rise delay={0.1}>
          <p className="lede mt-7 max-w-2xl">
            A wedding has a caterer, a stylist, a band, a venue team, a florist
            and a driver. Nobody asks all six — you ask one person, and they know
            who owns the answer. That is an orchestrator, and this is what the
            request looks like when every hop is instrumented.
          </p>
        </Rise>

        {/* Pick a request */}
        <Rise delay={0.16} className="mt-12">
          <p className="mono-label mb-4">Ask something</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => run(s)}
                className={`rounded-full border px-4 py-2 text-left text-sm transition-colors duration-300 ${
                  scenario.id === s.id && phase >= 0
                    ? "border-accent/40 bg-accent/10 text-hi"
                    : "border-hairline/10 text-mid hover:border-accent/25 hover:text-hi"
                }`}
              >
                {s.ask}
              </button>
            ))}
          </div>
        </Rise>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          {/* Trace waterfall */}
          <div className="panel p-6">
            <div className="flex items-baseline justify-between">
              <p className="mono-label">Trace</p>
              <p className="font-mono text-xs text-low">
                {phase < 0 ? "—" : `${total} ms total`}
              </p>
            </div>

            {phase < 0 ? (
              <p className="mt-8 text-sm text-low">
                Pick a question above to run it through the path.
              </p>
            ) : (
              <div className="mt-6 space-y-2.5">
                {STAGES.map((stage, i) => {
                  const state = phase > i ? "done" : phase === i ? "active" : "waiting"
                  const offset =
                    (scenario.timings.slice(0, i).reduce((a, b) => a + b, 0) / total) * 100
                  const width = (scenario.timings[i] / total) * 100

                  return (
                    <div key={stage.key} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3">
                      <div className="flex items-center gap-2">
                        {state === "done" ? (
                          <Check className="h-3 w-3 shrink-0 text-ok" />
                        ) : state === "active" ? (
                          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-accent" />
                        ) : (
                          <span className="h-3 w-3 shrink-0" />
                        )}
                        <span
                          className={`truncate text-xs transition-colors duration-300 ${
                            state === "waiting" ? "text-low" : "text-hi"
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>

                      {/* The span bar, positioned like a real waterfall. */}
                      <div className="relative h-2 rounded-full bg-hairline/[0.06]">
                        <motion.div
                          className={`absolute h-2 rounded-full ${
                            state === "waiting" ? "bg-hairline/10" : "bg-accent"
                          }`}
                          style={{ left: `${offset}%` }}
                          initial={{ width: 0, opacity: 0 }}
                          animate={{
                            width: state === "waiting" ? 0 : `${Math.max(3, width)}%`,
                            opacity: state === "waiting" ? 0 : 1,
                          }}
                          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                      </div>

                      <span
                        className={`text-right font-mono text-[0.7rem] tabular-nums transition-colors duration-300 ${
                          state === "waiting" ? "text-low/40" : "text-low"
                        }`}
                      >
                        {scenario.timings[i]}ms
                      </span>
                    </div>
                  )
                })}

                {/* The chosen agent's own span, nested under the orchestrator. */}
                <AnimatePresence>
                  {done && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 pt-1"
                    >
                      <div className="flex items-center gap-2 pl-4">
                        <Check className="h-3 w-3 shrink-0 text-ok" />
                        <span className="truncate text-xs text-accent">{agent.name}</span>
                      </div>
                      <div className="relative h-2 rounded-full bg-hairline/[0.06]">
                        <motion.div
                          className="absolute h-2 rounded-full bg-accent/50"
                          style={{ left: "72%" }}
                          initial={{ width: 0 }}
                          animate={{ width: "26%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-right font-mono text-[0.7rem] tabular-nums text-low">
                        {scenario.timings[5]}ms
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* What each stage resolved */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="rule-fade mb-5" />
                  <p className="mono-label">Context resolved</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scenario.context.map((c) => (
                      <span
                        key={c}
                        className="rounded-md border border-hairline/10 px-2.5 py-1 font-mono text-[0.68rem] text-mid"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase >= 5 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-5 overflow-hidden"
                >
                  <p className="mono-label">Intent</p>
                  <p className="mt-2 font-mono text-sm text-hi">{scenario.intent}</p>
                  <p className="mt-1 text-[0.7rem] text-low">
                    confidence {scenario.confidence.toFixed(2)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Agents + answer */}
          <div className="space-y-6">
            <div className="panel p-6">
              <p className="mono-label mb-4">Specialist agents</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {AGENTS.map((a) => {
                  const chosen = done && a.id === agent.id
                  const considering = phase === 5 && a.status === "ready"
                  return (
                    <div
                      key={a.id}
                      className={`rounded-xl border p-3 transition-all duration-500 ${
                        chosen
                          ? "border-accent/45 bg-accent/[0.07]"
                          : considering
                            ? "border-hairline/20"
                            : "border-hairline/[0.07]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-sm transition-colors ${
                            chosen ? "text-hi" : "text-mid"
                          }`}
                        >
                          {a.name}
                        </p>
                        <span
                          className={`shrink-0 font-mono text-[0.6rem] ${
                            a.status === "busy" ? "text-warn" : "text-ok"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[0.68rem] text-low">{a.owns}</p>
                    </div>
                  )
                })}
              </div>
              <p className="mt-4 text-[0.7rem] leading-relaxed text-low">
                The orchestrator matches on capability <em>and</em> availability. A
                busy agent gets routed around, which is why the florals question
                is answered by the venue team.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {done && (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="panel border-accent/25 p-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="dot-live" />
                    <p className="mono-label">{agent.name} answered</p>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-mid">{scenario.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {running && (
              <p className="text-center font-mono text-xs text-low">
                {STAGES[phase]?.detail}
              </p>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-low">
          Illustrative — a simulation of the request path, not a live system.
        </p>
      </div>
    </section>
  )
}
