import { useState } from "react"
import { usePrefs, useSay } from "@/lib/prefs"
import { useInView } from "@/lib/useInView"

/**
 * The OpenTelemetry pattern behind the Hitachi work, drawn once and animated:
 * everything emits the same three signals, one collector normalises them, and
 * the backend is a routing choice. Pick a different backend and only the
 * right-hand side changes, which is the whole point of the design.
 */

const SIGNALS = [
  { id: "trace", color: "rgb(var(--sig-trace))", simple: "Traces: the path of one request", technical: "Traces" },
  { id: "metric", color: "rgb(var(--sig-metric))", simple: "Metrics: numbers over time", technical: "Metrics" },
  { id: "log", color: "rgb(var(--sig-log))", simple: "Logs: what happened, in words", technical: "Logs" },
] as const

const SOURCES = [
  { id: "svc", simple: ["Apps", "the product itself"], technical: ["Microservices", "auto + SDK instrumented"] },
  { id: "agent", simple: ["AI agents", "decisions, tool calls"], technical: ["Agents", "agent SDK spans"] },
  { id: "bus", simple: ["Messages", "between the agents"], technical: ["Kafka", "inter-agent traffic"] },
] as const

const BACKENDS = [
  { id: "lgtm", name: "Grafana stack", sub: "Loki, Tempo, Mimir" },
  { id: "datadog", name: "Datadog", sub: "APM, logs, metrics" },
  { id: "elastic", name: "Elastic", sub: "search, dashboards" },
  { id: "own", name: "Your own", sub: "any OTLP backend" },
] as const
type BackendId = (typeof BACKENDS)[number]["id"]

type Rect = { x: number; y: number; w: number; h: number }

const wide = {
  box: "0 0 960 372",
  src: [0, 1, 2].map<Rect>((i) => ({ x: 14, y: 26 + i * 129, w: 196, h: 62 })),
  col: { x: 366, y: 62, w: 228, h: 248 } as Rect,
  out: [0, 1, 2, 3].map<Rect>((i) => ({ x: 750, y: 14 + i * 95, w: 196, h: 58 })),
}
const tall = {
  box: "0 0 360 612",
  src: [0, 1, 2].map<Rect>((i) => ({ x: 4 + i * 120, y: 8, w: 112, h: 58 })),
  col: { x: 58, y: 176, w: 244, h: 164 } as Rect,
  // two columns with a clear channel between them, so wires to the lower row never cross the upper boxes
  out: [0, 1, 2, 3].map<Rect>((i) => ({ x: 4 + (i % 2) * 192, y: 452 + Math.floor(i / 2) * 80, w: 160, h: 58 })),
}

const hcurve = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`
const vcurve = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`

function Signal({ d, color, dur, delay }: { d: string; color: string; dur: number; delay: number }) {
  const style = { "--dur": `${dur}s`, "--delay": `${delay}s` } as React.CSSProperties
  return (
    <g style={style}>
      <path className="fsig is-tail" d={d} pathLength={100} stroke={color} />
      <path className="fsig is-body" d={d} pathLength={100} stroke={color} />
      <path className="fsig is-head" d={d} pathLength={100} />
    </g>
  )
}

function Node({ r, title, sub, cls = "" }: { r: Rect; title: string; sub: string; cls?: string }) {
  return (
    <g className={`fnode ${cls}`}>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={14} />
      <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 3} textAnchor="middle">
        {title}
      </text>
      <text className="is-sub" x={r.x + r.w / 2} y={r.y + r.h / 2 + 14} textAnchor="middle">
        {sub}
      </text>
    </g>
  )
}

function Diagram({ vertical, on, voice }: { vertical: boolean; on: Set<BackendId>; voice: "simple" | "technical" }) {
  const L = vertical ? tall : wide
  const c = L.col
  const stagesText = voice === "simple" ? ["collect", "clean and label", "send"] : ["receivers", "processors", "exporters"]

  const inWires = L.src.map((s, i) =>
    vertical ? vcurve(s.x + s.w / 2, s.y + s.h, c.x + c.w * (0.25 + 0.25 * i), c.y) : hcurve(s.x + s.w, s.y + s.h / 2, c.x, c.y + c.h * (0.28 + 0.22 * i)),
  )
  const outWires = L.out.map((o, i) => {
    if (!vertical) return hcurve(c.x + c.w, c.y + c.h * (0.2 + 0.2 * i), o.x, o.y + o.h / 2)
    if (i < 2) return vcurve(c.x + c.w * (i % 2 ? 0.7 : 0.3), c.y + c.h, o.x + o.w / 2, o.y)
    // lower row: straight down the channel, then out along a short bus and into the top of the box
    const side = i % 2 ? 1 : -1
    const x = c.x + c.w / 2 + side * 8
    const bus = o.y - 11
    const bx = o.x + o.w / 2
    const r = 8
    return `M${x} ${c.y + c.h} L${x} ${bus - r} Q${x} ${bus} ${x + side * r} ${bus} L${bx - side * r} ${bus} Q${bx} ${bus} ${bx} ${o.y}`
  })

  // the three inner stages of the collector
  const inner = [0, 1, 2].map<Rect>((i) =>
    vertical
      ? { x: c.x + 12 + i * ((c.w - 24) / 3), y: c.y + 62, w: (c.w - 24) / 3 - 6, h: 84 }
      : { x: c.x + 16, y: c.y + 66 + i * 58, w: c.w - 32, h: 46 },
  )

  return (
    <svg className={`flow-svg ${vertical ? "is-tall" : "is-wide"}`} viewBox={L.box} role="img" aria-label="Apps, AI agents and the message bus send traces, metrics and logs to one OpenTelemetry collector, which forwards them to whichever monitoring backends are selected.">
      {!vertical && (
        <defs>
          {/* blur mostly along the direction of travel, so a streak smears forward rather than swells */}
          <filter id="streak" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3.5 1.2" />
          </filter>
        </defs>
      )}

      {inWires.map((d) => (
        <path key={d} className="fwire" d={d} />
      ))}
      {outWires.map((d, i) => (
        <path key={d} className={`fwire${on.has(BACKENDS[i].id) ? "" : " is-off"}`} d={d} />
      ))}

      {inWires.map((d, i) => SIGNALS.map((sig, k) => <Signal key={`${i}-${sig.id}`} d={d} color={sig.color} dur={2.4 + i * 0.25} delay={-(k * 0.8 + i * 0.37)} />))}
      {outWires.map((d, i) => (on.has(BACKENDS[i].id) ? SIGNALS.map((sig, k) => <Signal key={`${BACKENDS[i].id}-${sig.id}`} d={d} color={sig.color} dur={2.2 + i * 0.2} delay={-(k * 0.73 + i * 0.29)} />) : null))}

      {L.src.map((r, i) => (
        <Node key={SOURCES[i].id} r={r} title={SOURCES[i][voice][0]} sub={SOURCES[i][voice][1]} />
      ))}

      <g className="fnode is-core">
        <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={20} />
        <text x={c.x + c.w / 2} y={c.y + 28} textAnchor="middle">
          OpenTelemetry Collector
        </text>
        <text className="is-sub" x={c.x + c.w / 2} y={c.y + 46} textAnchor="middle">
          {voice === "simple" ? "one place for everything" : "gateway, cloud-agnostic"}
        </text>
      </g>
      {inner.map((r, i) => (
        <g className="fnode" key={stagesText[i]}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={10} />
          {vertical && voice === "simple" && i === 1 ? (
            <>
              <text className="is-sub" x={r.x + r.w / 2} y={r.y + r.h / 2 - 3} textAnchor="middle">
                clean
              </text>
              <text className="is-sub" x={r.x + r.w / 2} y={r.y + r.h / 2 + 11} textAnchor="middle">
                and label
              </text>
            </>
          ) : (
            <text className="is-sub" x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle">
              {stagesText[i]}
            </text>
          )}
        </g>
      ))}

      {L.out.map((r, i) => (
        <Node key={BACKENDS[i].id} r={r} title={BACKENDS[i].name} sub={BACKENDS[i].sub} cls={on.has(BACKENDS[i].id) ? "is-on" : "is-off"} />
      ))}
    </svg>
  )
}

export default function Telemetry() {
  const say = useSay()
  const { voice } = usePrefs()
  const [ref, inView] = useInView<HTMLDivElement>("0px", 0.15)
  const [on, setOn] = useState<Set<BackendId>>(() => new Set<BackendId>(["lgtm"]))
  const [switches, setSwitches] = useState(0)

  const toggle = (id: BackendId) => {
    setOn((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return prev // always send somewhere
        next.delete(id)
      } else next.add(id)
      return next
    })
    setSwitches((n) => n + 1)
  }

  const names = BACKENDS.filter((b) => on.has(b.id)).map((b) => b.name)

  return (
    <section id="telemetry" className="sec shell" aria-labelledby="telemetry-title">
      <div className="sec-head">
        <h2 id="telemetry-title" className="h2">
          How I make systems explain themselves
        </h2>
        <p className="sub">
          {say(
            "When something breaks at 3am, the system should tell you why. This is the pattern I build so that it can.",
            "The shape of every observability platform I build: instrument against an open standard, normalise in one collector, and make the backend a routing decision instead of a rewrite.",
          )}
        </p>
      </div>

      <div ref={ref} className={`flow${inView ? " is-live" : ""}`}>
        <div className="flow-top">
          <div className="flow-pick" role="group" aria-label="Where to send the telemetry">
            <span>{say("Send it to", "Export to")}</span>
            {BACKENDS.map((b) => (
              <button key={b.id} aria-pressed={on.has(b.id)} onClick={() => toggle(b.id)}>
                {b.name}
              </button>
            ))}
          </div>
          <div className="legend">
            {SIGNALS.map((s) => (
              <span key={s.id}>
                <i style={{ background: s.color }} />
                {s[voice]}
              </span>
            ))}
          </div>
        </div>

        <Diagram vertical={false} on={on} voice={voice} />
        <Diagram vertical on={on} voice={voice} />

        <p className="well flow-swap" aria-live="polite">
          {say("Going to", "Exporting to")} <b>{names.join(", ")}</b>.{" "}
          {switches === 0
            ? say("Tap another tool above and watch what changes.", "Toggle a backend above and watch what changes.")
            : say("You just switched monitoring tools. Changes needed in the apps: none.", "Backend changed. Application code changed: 0 lines. Only the collector's exporters moved.")}
        </p>
      </div>

      <ol className="flow-notes">
        <li>
          <b>{say("Everything reports in", "Instrument once")}</b>
          <p>
            {say(
              "Every app and AI agent sends the same three signals.",
              "Services and the agent SDK emit traces, metrics and structured logs on one consistent event and action taxonomy.",
            )}
          </p>
        </li>
        <li>
          <b>{say("One collector tidies it", "Gateway collector")}</b>
          <p>
            {say(
              "One collector labels it all the same way.",
              "An OpenTelemetry gateway collector on AKS receives, enriches and batches. Nothing in it is tied to one cloud.",
            )}
          </p>
        </li>
        <li>
          <b>{say("Send it anywhere", "Multi-exporter routing")}</b>
          <p>
            {say(
              "Customers keep the monitoring tool they already pay for.",
              "Telemetry routes to the customer's own vendor backend or a bundled LGTM stack, with no application changes.",
            )}
          </p>
        </li>
      </ol>

      <div className="proof-row">
        <div>
          <h3>Hitachi Digital Services, agentic AI platform</h3>
          <p>
            {say(
              "18 services and about 8 AI agents, every run traceable through each agent that touched it. Used by 5 clients.",
              "18 managed microservices and around 8 operational agents alongside Confluent Kafka, PostgreSQL, Redis and App Gateway. Onboarded by 5 clients and going multi-cloud.",
            )}
          </p>
        </div>
        <div>
          <h3>Toyota Motor North America</h3>
          <p>
            {say(
              "Monitoring across 9 applications and 200+ code repositories, with about 180 alarms wired to the on-call tools.",
              "Datadog APM and RUM across 9 applications and 200+ repositories on Lambda, ECS Fargate and EKS Fargate, with ~180 monitors into ServiceNow and PagerDuty.",
            )}
          </p>
        </div>
      </div>
      <p className="fine proof-note">
        {say(
          "These numbers are from my project work at Hitachi Digital Services. Both platforms are private, so they cannot be linked here. They match my résumé.",
          "Figures from client engagements at Hitachi Digital Services, 2026. Both platforms are private, so there is no public source to link. They match the résumé.",
        )}
      </p>
    </section>
  )
}
