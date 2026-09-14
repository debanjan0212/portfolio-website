import { ArrowUpRight, Bot, Boxes, Brain, CheckCircle2, Gauge, Github, Globe, Layers, MonitorSmartphone, Radio, Route, ServerCog, ShieldCheck, Siren, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Step = { icon: LucideIcon; label: string; sub: string; tone?: "ok" }
type Stat = { icon: LucideIcon; value: string; label: string }

export type CaseCard = {
  brand: string
  category: string
  titleTop: string
  titleAccent: string
  text: string
  steps: Step[]
  stats: Stat[]
  chartLabel: string
  link?: string
}

/* Numbers here come only from what is already stated in the case copy -
   nothing is invented for the sake of the graphic. */
export const caseCards: CaseCard[] = [
  {
    brand: "HITACHI",
    category: "PRODUCTION SYSTEMS",
    titleTop: "Agentic AI",
    titleAccent: "observability",
    text: "Built a backend-agnostic OpenTelemetry layer for an agentic AI platform, making each request, agent decision, tool call, and outcome visible to operators.",
    steps: [
      { icon: Globe, label: "REQUEST", sub: "GET /api/ask" },
      { icon: Brain, label: "AGENT DECISION", sub: "Reasoning & planning" },
      { icon: Wrench, label: "TOOL CALL", sub: "retrieve_documents()" },
      { icon: CheckCircle2, label: "OUTCOME", sub: "Response generated", tone: "ok" },
    ],
    stats: [
      { icon: Boxes, value: "18", label: "services" },
      { icon: Bot, value: "8", label: "agents traced" },
    ],
    chartLabel: "Latency (p95)",
  },
  {
    brand: "TOYOTA",
    category: "APM + RUM",
    titleTop: "Toyota",
    titleAccent: "observability platform",
    text: "Led full-stack APM and RUM instrumentation across nine applications, connecting monitors to ServiceNow and PagerDuty for near-real-time routing.",
    steps: [
      { icon: MonitorSmartphone, label: "REAL USER SESSION", sub: "Browser timing captured" },
      { icon: Radio, label: "APM TRACE", sub: "Front end to back end" },
      { icon: Gauge, label: "MONITOR", sub: "Thresholds & SLOs" },
      { icon: Siren, label: "ROUTED", sub: "ServiceNow · PagerDuty", tone: "ok" },
    ],
    stats: [
      { icon: Layers, value: "200+", label: "repositories monitored" },
      { icon: Boxes, value: "9", label: "applications" },
    ],
    chartLabel: "Request throughput",
  },
  {
    brand: "TRANSUNION",
    category: "PLATFORM / MIGRATION",
    titleTop: "Private EKS",
    titleAccent: "migration",
    text: "Reframed a fragmented estate into a private EKS platform with repeatable delivery, safer rollback paths, and operational visibility.",
    steps: [
      { icon: ServerCog, label: "FRAGMENTED ESTATE", sub: "Mixed, hand-run servers" },
      { icon: Boxes, label: "PRIVATE EKS", sub: "One platform, one path" },
      { icon: Route, label: "REPEATABLE DELIVERY", sub: "Same route every time" },
      { icon: ShieldCheck, label: "ROLLBACK PATH", sub: "Safe to reverse", tone: "ok" },
    ],
    stats: [{ icon: ServerCog, value: "800+", label: "servers moved" }],
    chartLabel: "Estate migrated",
  },
  {
    brand: "GITHUB",
    category: "OPEN SOURCE",
    titleTop: "Open-source",
    titleAccent: "observability",
    text: "A practical observability project covering the signals, instrumentation, and operational thinking behind reliable systems.",
    steps: [
      { icon: Wrench, label: "INSTRUMENT", sub: "OpenTelemetry SDKs" },
      { icon: Radio, label: "COLLECT", sub: "Collector pipeline" },
      { icon: Route, label: "EXPORT", sub: "Backend-agnostic" },
      { icon: Gauge, label: "VISUALISE", sub: "Dashboards & alerts", tone: "ok" },
    ],
    stats: [{ icon: Github, value: "Public", label: "repository" }],
    chartLabel: "Signal coverage",
    link: "https://github.com/debanjan0212/observability",
  },
]

const SPARK = "M4 30 L26 24 L44 27 L62 16 L84 21 L104 10 L124 15 L148 6"

export default function CasePoster({ card, index }: { card: CaseCard; index: number }) {
  return (
    <div className={`poster poster-${index}`}>
      <div className="poster-head">
        <p className="poster-brand">{card.brand}</p>
        <p className="poster-cat"><i /> {card.category}</p>
      </div>

      <h3 className="poster-title">
        {card.titleTop}
        <br />
        <em>{card.titleAccent}</em>
      </h3>

      <p className="poster-text">{card.text}</p>

      <ol className="poster-flow">
        {card.steps.map((s) => {
          const Icon = s.icon
          return (
            <li key={s.label} className={s.tone === "ok" ? "is-ok" : undefined}>
              <span className="poster-ico"><Icon size={15} /></span>
              <span>
                <b>{s.label}</b>
                <small>{s.sub}</small>
              </span>
            </li>
          )
        })}
      </ol>

      <div className="poster-foot">
        <div className="poster-stats">
          {card.stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label}>
                <Icon size={17} />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            )
          })}
        </div>
        <div className="poster-chart">
          <p>{card.chartLabel}</p>
          <svg viewBox="0 0 152 36" preserveAspectRatio="none" aria-hidden>
            <path d={SPARK} fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d={`${SPARK} L148 36 L4 36 Z`} fill="currentColor" opacity=".12" stroke="none" />
          </svg>
        </div>
      </div>

      {card.link && (
        <a className="poster-link" href={card.link} target="_blank" rel="noreferrer"
           onClick={(e) => e.stopPropagation()}>
          View on GitHub <ArrowUpRight size={13} />
        </a>
      )}
    </div>
  )
}
