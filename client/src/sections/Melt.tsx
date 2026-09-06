import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { RevealWords, Rise, useReducedMotion } from "@/lib/motion"

/**
 * A live MELT pipeline: an application emits Metrics, Events, Logs and Traces,
 * one collector normalises them, and any backend can receive them.
 *
 * The point it makes is the point Debanjan's OAA work makes - instrument once
 * against an open standard and the backend becomes a routing decision, not a
 * rewrite. Backends are named in plain text rather than shown as logos, since
 * these are other companies' marks.
 */

type Signal = { key: string; label: string; detail: string; colour: string }

const SIGNALS: Signal[] = [
  { key: "M", label: "Metrics", detail: "counters, gauges, histograms", colour: "var(--accent)" },
  { key: "E", label: "Events", detail: "deploys, scaling, incidents", colour: "var(--warn)" },
  { key: "L", label: "Logs", detail: "structured, event/action taxonomy", colour: "var(--ok)" },
  { key: "T", label: "Traces", detail: "end-to-end spans across services", colour: "168 130 240" },
]

const BACKENDS = [
  { name: "Grafana", note: "LGTM stack", used: true },
  { name: "Datadog", note: "APM + RUM", used: true },
  { name: "Elastic / ELK", note: "search & dashboards", used: true },
  { name: "OpenSearch", note: "self-hosted", used: true },
  { name: "Dynatrace", note: "OTLP ingest", used: false },
  { name: "New Relic", note: "OTLP ingest", used: false },
  { name: "AppDynamics", note: "OTLP ingest", used: false },
  { name: "Prometheus", note: "remote write", used: true },
]

/** One emitted signal travelling down the pipe. */
type Packet = { id: number; signal: number; backend: number }

export default function Melt() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-20%" })
  const reduced = useReducedMotion()

  const [packets, setPackets] = useState<Packet[]>([])
  const [counts, setCounts] = useState<number[]>(() => SIGNALS.map(() => 0))
  const next = useRef(0)

  // Emit only while on screen, so the page is not animating work nobody sees.
  useEffect(() => {
    if (!inView || reduced) return

    const emit = setInterval(() => {
      const signal = Math.floor(Math.random() * SIGNALS.length)
      const backend = Math.floor(Math.random() * BACKENDS.length)
      const id = next.current++

      setPackets((p) => [...p.slice(-14), { id, signal, backend }])
      setCounts((c) => c.map((n, i) => (i === signal ? n + 1 : n)))

      setTimeout(() => setPackets((p) => p.filter((x) => x.id !== id)), 2600)
    }, 620)

    return () => clearInterval(emit)
  }, [inView, reduced])

  return (
    <section id="melt" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-shell">
        <p className="mono-label">Observability, in motion</p>
        <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.25rem)]">
          <RevealWords text="Instrument once." />
          <br />
          <span className="text-mid">
            <RevealWords text="Send it anywhere." delay={0.1} />
          </span>
        </h2>
        <Rise delay={0.1}>
          <p className="lede mt-7 max-w-2xl">
            This is the shape of every observability platform I build. The
            application emits MELT against an open standard, one collector
            normalises and enriches it, and the backend becomes a routing
            decision rather than a rewrite.
          </p>
        </Rise>

        <div ref={ref} className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)]">
          {/* Emitters */}
          <div className="space-y-3">
            <p className="mono-label mb-4">Application emits</p>
            {SIGNALS.map((s, i) => (
              <Rise key={s.key} delay={i * 0.06}>
                <div className="panel flex items-center gap-4 p-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm"
                    style={{
                      background: `rgb(${s.colour} / 0.14)`,
                      color: `rgb(${s.colour})`,
                    }}
                  >
                    {s.key}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-hi">{s.label}</p>
                    <p className="truncate text-[0.7rem] text-low">{s.detail}</p>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-low">
                    {counts[i].toString().padStart(3, "0")}
                  </span>
                </div>
              </Rise>
            ))}
          </div>

          {/* Collector */}
          <div className="relative flex items-center justify-center py-6 lg:py-0">
            <div className="relative flex w-full max-w-[13rem] flex-col items-center gap-3 lg:w-[13rem]">
              <div className="panel w-full p-5 text-center">
                <p className="mono-label">Collector</p>
                <p className="mt-2 text-sm text-hi">OpenTelemetry</p>
                <p className="mt-1 text-[0.7rem] text-low">receive · process · export</p>

                {/* Throughput bar, driven by whatever is in flight. */}
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-hairline/10">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${Math.min(100, 18 + packets.length * 7)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Packets in flight. */}
              <div className="relative h-10 w-full">
                {packets.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                    style={{ background: `rgb(${SIGNALS[p.signal].colour})` }}
                    initial={{ x: -90, y: -4, opacity: 0, scale: 0.6 }}
                    animate={{ x: [-90, 0, 90], y: [-4, -4, -4], opacity: [0, 1, 0], scale: 1 }}
                    transition={{ duration: 2.4, ease: "linear" }}
                  />
                ))}
              </div>

              <p className="mono-label">{packets.length} in flight</p>
            </div>
          </div>

          {/* Backends */}
          <div>
            <p className="mono-label mb-4">Any backend receives</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {BACKENDS.map((b, i) => {
                const hit = packets.some((p) => p.backend === i)
                return (
                  <Rise key={b.name} delay={i * 0.04}>
                    <div
                      className={`panel relative overflow-hidden p-4 transition-colors duration-500 ${
                        hit ? "border-accent/40" : ""
                      }`}
                    >
                      {hit && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 bg-accent/[0.07]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.6 }}
                        />
                      )}
                      <div className="relative flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-hi">{b.name}</p>
                          <p className="truncate text-[0.7rem] text-low">{b.note}</p>
                        </div>
                        {b.used && (
                          <span
                            className="shrink-0 rounded-full border border-accent/25 px-2 py-0.5 font-mono text-[0.6rem] text-accent"
                            title="Run in production"
                          >
                            run
                          </span>
                        )}
                      </div>
                    </div>
                  </Rise>
                )
              })}
            </div>

            <p className="mt-5 text-xs leading-relaxed text-low">
              Marked <span className="text-accent">run</span> are the ones I have
              operated in production. The rest accept the same OTLP output — which
              is the whole point of instrumenting against the standard rather than
              a vendor SDK.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
