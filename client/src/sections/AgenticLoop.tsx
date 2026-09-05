import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { RevealWords } from "@/lib/motion"

const steps = [
  {
    id: "observe",
    n: "01",
    title: "Observe",
    body: "Every agent run is instrumented like a production service. The OTel Contrib Collector picks up traces, metrics and logs from all 18 microservices and from the Kafka fabric the agents talk over — so inter-agent calls are as visible as any HTTP hop.",
    signal: "traces · metrics · logs · kafka topics",
  },
  {
    id: "reason",
    n: "02",
    title: "Reason",
    body: "Telemetry is only useful if the signal survives. Grok parsing and reference-table enrichment strip false positives and de-duplicate repeats, so what reaches a human or an agent is a real event with its evidence attached, not raw noise.",
    signal: "enrichment · de-duplication · correlation",
  },
  {
    id: "act",
    n: "03",
    title: "Act",
    body: "Action goes through the same reviewed path a human would use. Monitors fire into ServiceNow and PagerDuty for routing and escalation; remediation lands through GitOps. Nothing changes production by a route that cannot be audited or reversed.",
    signal: "servicenow · pagerduty · gitops",
  },
  {
    id: "verify",
    n: "04",
    title: "Verify",
    body: "SLOs decide whether it worked. Error budget burn is the gate on what ships next, and telemetry can be exported to the customer's own vendor backend or the bundled LGTM stack — the verification layer is never locked to one vendor.",
    signal: "slo · error budget · multi-exporter",
  },
]

export default function AgenticLoop() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Split the pinned scroll into one band per step.
    const i = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))
    setActive(i)
  })

  const ringLength = useTransform(scrollYProgress, [0, 0.95], [0, 1])

  return (
    <section id="agentic" className="relative px-6">
      <div className="mx-auto max-w-shell">
        <div className="mb-16">
          <p className="mono-label">The work</p>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.75rem)]">
            <RevealWords text="An agentic platform is only" />
            <br />
            <span className="text-mid">
              <RevealWords text="as good as what it can see." delay={0.1} />
            </span>
          </h2>
        </div>
      </div>

      {/* Pinned storytelling: the track is tall, the panel inside sticks. */}
      <div ref={ref} className="relative" style={{ height: `${steps.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-shell items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            {/* Ring */}
            <div className="relative mx-auto w-full max-w-[22rem]">
              <svg viewBox="0 0 220 220" className="w-full">
                <circle
                  cx="110"
                  cy="110"
                  r="82"
                  fill="none"
                  stroke="rgb(var(--hairline) / 0.09)"
                  strokeWidth="1"
                />
                <motion.circle
                  cx="110"
                  cy="110"
                  r="82"
                  fill="none"
                  stroke="rgb(var(--accent))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                  style={{ pathLength: ringLength }}
                />

                {steps.map((s, i) => {
                  const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2
                  const cx = 110 + Math.cos(a) * 82
                  const cy = 110 + Math.sin(a) * 82
                  const on = i <= active
                  return (
                    <g key={s.id}>
                      {i === active && (
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r="14"
                          fill="rgb(var(--accent) / 0.12)"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2.6, repeat: Infinity }}
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={i === active ? 6 : 4}
                        fill={on ? "rgb(var(--accent))" : "rgb(var(--ink-3))"}
                        className="transition-all duration-500"
                      />
                    </g>
                  )
                })}

                <text
                  x="110"
                  y="106"
                  textAnchor="middle"
                  className="fill-[rgb(var(--text-low))] font-mono"
                  style={{ fontSize: 9, letterSpacing: "0.2em" }}
                >
                  OAA
                </text>
                <text
                  x="110"
                  y="122"
                  textAnchor="middle"
                  className="fill-[rgb(var(--text-hi))] font-mono"
                  style={{ fontSize: 13 }}
                >
                  {steps[active].title.toLowerCase()}
                </text>
              </svg>
            </div>

            {/* Copy - swaps as the ring advances */}
            <div className="relative min-h-[19rem]">
              {steps.map((s, i) => (
                <motion.div
                  key={s.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    y: i === active ? 0 : i < active ? -24 : 24,
                    filter: i === active ? "blur(0px)" : "blur(6px)",
                  }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ pointerEvents: i === active ? "auto" : "none" }}
                >
                  <p className="font-mono text-xs text-accent">{s.n}</p>
                  <h3 className="display mt-4 text-4xl md:text-5xl">{s.title}</h3>
                  <p className="lede mt-6 max-w-xl text-base md:text-lg">{s.body}</p>
                  <p className="mono-label mt-8">{s.signal}</p>
                </motion.div>
              ))}

              {/* Step ticks */}
              <div className="absolute -bottom-2 left-0 flex gap-2">
                {steps.map((s, i) => (
                  <div
                    key={s.id}
                    className={`h-px w-10 transition-colors duration-500 ${
                      i <= active ? "bg-accent" : "bg-hairline/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
