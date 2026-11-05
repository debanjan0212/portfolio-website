import { ArrowUpRight, GitPullRequest } from "lucide-react"
import { motion } from "framer-motion"
import { lab, type LabProject } from "@/data/profile"
import { RevealWords } from "@/lib/motion"

const ease = [0.2, 0.8, 0.2, 1] as const

/* What Argus does on an incident, in order. Describes the flow, not a recorded run. */
const trace = [
  { tag: "ALERT", text: "High error rate · checkout", tone: "crit" },
  { tag: "MCP", text: "metrics · Prometheus" },
  { tag: "MCP", text: "logs · Loki" },
  { tag: "MCP", text: "traces · Tempo" },
  { tag: "RCA", text: "bad release, two hops upstream", tone: "warn" },
  { tag: "PR", text: "rollback proposed · waiting for a human", tone: "ok" },
]

function ArgusVisual() {
  return (
    <ol className="lab-trace" aria-label="How Argus handles an alert">
      {trace.map((s, i) => (
        <motion.li
          key={s.text}
          className={s.tone ? `is-${s.tone}` : undefined}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.55, delay: 0.25 + i * 0.16, ease }}
        >
          <b>{s.tag}</b>
          <span>{s.text}</span>
          {s.tag === "PR" && <GitPullRequest size={14} />}
        </motion.li>
      ))}
    </ol>
  )
}

function IntentVisual() {
  return (
    <div className="lab-intent">
      <p className="lab-ask">“payments-api, public, handles card data, 99.9% available”</p>
      <div className="lab-targets">
        {["EKS", "GKE", "AKS", "Bare metal", "kind"].map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
          >
            {t}
          </motion.span>
        ))}
      </div>
      <p className="lab-out">capacity · SLO alerts · policy · cost · canary</p>
    </div>
  )
}

function LoopVisual() {
  // observe -> decide -> (approve) -> act, round and round
  const ring = "M60 12 A48 48 0 1 1 59.9 12"
  return (
    <svg className="lab-loop" viewBox="-24 -8 168 136" role="img" aria-label="Observe, decide, act loop with an approval gate">
      <path d={ring} />
      {[[60, 12], [101.6, 84], [18.4, 84]].map(([x, y]) => (
        <circle key={x} className="lab-loop-node" cx={x} cy={y} r="4" />
      ))}
      <circle className="lab-loop-dot" r="2.6">
        <animateMotion dur="6s" repeatCount="indefinite" path={ring} />
      </circle>
      <text x="60" y="2">observe</text>
      <text x="118" y="100">decide</text>
      <text x="2" y="100">act</text>
      <text className="lab-loop-gate" x="60" y="63">human approval</text>
    </svg>
  )
}

const visuals: Record<string, () => JSX.Element> = {
  Argus: ArgusVisual,
  IntentOps: IntentVisual,
}

function LabCard({ p, i }: { p: LabProject; i: number }) {
  const Visual = visuals[p.name] ?? LoopVisual
  return (
    <motion.article
      className={`glass lab-card lab-card-${i}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: i * 0.08, ease }}
    >
      <p className="lab-kicker">{p.kicker}</p>
      <h3>{p.name}</h3>
      <p className="lab-summary">{p.summary}</p>
      <Visual />
      {p.proof.length > 0 && (
        <div className="lab-proof">
          {p.proof.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="lab-foot">
        <ul>
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.repo && (
          <a href={p.repo} target="_blank" rel="noreferrer" className="lab-link">
            GitHub <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </motion.article>
  )
}

export default function Lab() {
  return (
    <section id="lab" className="lab-section">
      <p className="future-kicker">OPEN SOURCE · NEW</p>
      <h2 className="lg-title">
        <RevealWords text="Agentic SRE." />
        <br />
        <span className="lg-grad">
          <RevealWords text="Built in the open." delay={0.12} />
        </span>
      </h2>
      <p className="lg-sub">
        IntentOps prevents incidents. Argus resolves them. Both let AI do the thinking, and keep humans
        and hard rules in charge of every change.
      </p>
      <div className="lab-grid">
        {lab.map((p, i) => (
          <LabCard key={p.name} p={p} i={i} />
        ))}
      </div>
    </section>
  )
}
