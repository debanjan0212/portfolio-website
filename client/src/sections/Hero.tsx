import { ArrowDown, ArrowRight, BadgeCheck, Download } from "lucide-react"
import { certifications, profile } from "@/data/profile"
import { useSay, VoiceSwitch } from "@/lib/prefs"
import { ago, useLive, useNow, type RepoName, type Run } from "@/lib/live"
import { ArgusGlyph, HarnessGlyph, IntentGlyph } from "@/components/Glyphs"
import type { ToolId } from "@/App"

const tools: {
  id: ToolId
  repo: RepoName
  name: string
  Glyph: typeof ArgusGlyph
  simple: string
  technical: string
}[] = [
  {
    id: "argus",
    repo: "argus-sre-agent",
    name: "Argus",
    Glyph: ArgusGlyph,
    simple: "An AI on-call engineer. It finds what broke and suggests the fix. A person approves it.",
    technical: "AI SRE agent over MCP: read-only investigation, root cause, and the fix as a GitOps pull request.",
  },
  {
    id: "intentops",
    repo: "intentops",
    name: "IntentOps",
    Glyph: IntentGlyph,
    simple: "Describe an app in one small file. It plans the servers, the alarms and the cost on any cloud.",
    technical: "Intent-driven platform agent: capacity, SLO burn-rate alerts, policy, cost per cloud, SLO-gated canary.",
  },
  {
    id: "harness",
    repo: "agent-harness-sdk",
    name: "agent-harness-sdk",
    Glyph: HarnessGlyph,
    simple: "A toolkit for building AI agents that have to ask before they act.",
    technical: "Python SDK: read, analyse, decide, act. Policy in code, human approval, OpenTelemetry built in.",
  },
]

export function RunState({ run, what }: { run: Run | null; what: string }) {
  if (!run || run.state === "unknown") return null
  return (
    <span className={`state is-${run.state}`}>
      <i />
      {what} {run.state}
    </span>
  )
}

export default function Hero({ onOpenTool }: { onOpenTool: (id: ToolId) => void }) {
  const say = useSay()
  const live = useLive()
  const now = useNow()
  const cert = certifications[0]

  return (
    <section className="hero shell" aria-labelledby="name">
      <div className="hero-grid">
        <div className="hero-intro">
          <p className="hero-role settle" style={{ "--i": 0 } as React.CSSProperties}>
            {profile.role}, {profile.location.split(",")[0]}
          </p>
          <h1 id="name" className="hero-name settle" style={{ "--i": 1 } as React.CSSProperties}>
            {profile.name}
          </h1>
          <p className="hero-tag settle" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="grad">{profile.tagline}.</span>
          </p>
          <p className="hero-sum settle" style={{ "--i": 3 } as React.CSSProperties}>
            {say(profile.summary.simple, profile.summary.technical)}
          </p>
          <p className="hero-work settle" style={{ "--i": 4 } as React.CSSProperties}>
            <span suppressHydrationWarning>{profile.years}</span> {say(profile.work.simple, profile.work.technical)}
          </p>
          <div className="hero-voice settle" style={{ "--i": 5 } as React.CSSProperties}>
            <VoiceSwitch />
            <span>{say("Engineer? Switch to the technical wording.", "Showing the technical wording.")}</span>
          </div>
        </div>

        <aside className="glass built hero-built settle" style={{ "--i": 3 } as React.CSSProperties} aria-labelledby="built-title">
          <div className="built-head">
            <h2 id="built-title">What I built</h2>
            {live.source === "live" && (
              <span className="built-live">
                <span className="dot-live" /> live from GitHub
              </span>
            )}
          </div>
          {tools.map((t, i) => {
            const repo = live.repo(t.repo)
            const pushed = ago(repo.pushedAt, now)
            return (
              <button key={t.id} className="built-row online" style={{ "--i": i } as React.CSSProperties} onClick={() => onOpenTool(t.id)}>
                <span className="built-glyph">
                  <t.Glyph />
                </span>
                <span>
                  <span className="built-name">{t.name}</span>
                  <span className="built-what" style={{ display: "block" }}>
                    {say(t.simple, t.technical)}
                  </span>
                  <span className="built-status">
                    <RunState run={repo.ci} what="tests" />
                    {pushed && <span>updated {pushed}</span>}
                  </span>
                </span>
                <ArrowRight className="built-go" size={18} aria-hidden />
                <span className="sr-only">Watch {t.name} work</span>
              </button>
            )
          })}
          <p className="built-foot">
            {say(
              "At work: the monitoring layer for Hitachi's AI operations product, covering 18 services and about 8 AI agents.",
              "At work: the backend-agnostic OpenTelemetry platform for Hitachi's OAA product, 18 microservices and around 8 operational agents.",
            )}
          </p>
        </aside>

        <div className="hero-act settle" style={{ "--i": 6 } as React.CSSProperties}>
          <div className="hero-actions">
            <a className="pill pill-solid" href="#tools">
              Watch the tools work <ArrowDown size={16} aria-hidden />
            </a>
            <a className="glass pill pill-glass" href="/DebanjanDas-Resume.pdf" download>
              <Download size={16} aria-hidden /> Download résumé
            </a>
          </div>
          <div className="hero-meta">
            <p>
              <span className="dot-live" />
              <span>Open to senior and staff SRE, platform and AI-infrastructure roles</span>
            </p>
            <p>
              <BadgeCheck size={17} aria-hidden />
              <a href="#about">
                {cert.name}, {cert.issuer}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
