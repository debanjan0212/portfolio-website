import { Fragment } from "react"
import { ArrowDown, ArrowRight, BadgeCheck, Download } from "lucide-react"
import { certifications, profile } from "@/data/profile"
import { useSay, VoiceSwitch } from "@/lib/prefs"
import { ago, useLive, useNow, type RepoName, type Run } from "@/lib/live"
import { ArgusGlyph, HarnessGlyph, IntentGlyph } from "@/components/Glyphs"
import IntroVideo from "@/components/IntroVideo"
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
    simple: "An AI on-call engineer. It finds what broke and suggests the fix.",
    technical: "AI SRE agent over MCP: read-only investigation, root cause, and the fix as a GitOps pull request.",
  },
  {
    id: "intentops",
    repo: "intentops",
    name: "IntentOps",
    Glyph: IntentGlyph,
    simple: "Describe an app in one small file. It plans servers, alarms and cost on any cloud.",
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

const step = (i: number) => ({ "--i": i }) as React.CSSProperties

/**
 * The first screen answers four questions in order: who, how they look and
 * sound, where they have worked, and what they built. The résumé is one tap
 * away on every screen size.
 */
export default function Hero({ onOpenTool }: { onOpenTool: (id: ToolId) => void }) {
  const say = useSay()
  const live = useLive()
  const now = useNow()
  const cert = certifications[0]
  const last = profile.employers.length - 1

  return (
    <section className="hero shell" aria-labelledby="name">
      <div className="hero-grid">
        <div className="hero-intro">
          <p className="hero-role settle" style={step(0)}>
            {profile.role}, {profile.location.split(",")[0]}
          </p>
          <h1 id="name" className="hero-name settle" style={step(1)}>
            {profile.name}
          </h1>
          <p className="hero-tag settle" style={step(2)}>
            <span className="grad">{profile.tagline}.</span>
          </p>
          <p className="hero-sum settle" style={step(3)}>
            {say(profile.summary.simple, profile.summary.technical)}
          </p>
          <p className="hero-at settle" style={step(4)}>
            <span suppressHydrationWarning>{profile.years}</span> years at{" "}
            {profile.employers.map((name, i) => (
              <Fragment key={name}>
                <b>{name}</b>
                {i < last - 1 ? ", " : i === last - 1 ? " and " : "."}
              </Fragment>
            ))}
          </p>
        </div>

        <div className="hero-actions hero-act settle" style={step(5)}>
          {/* a phone gets the short label, so both buttons share one row and the photo stays on the first screen */}
          <a className="pill pill-solid" href="/DebanjanDas-Resume.pdf" download aria-label="Download résumé">
            <Download size={16} aria-hidden />
            <span className="wide-only">Download résumé</span>
            <span className="narrow-only">Résumé</span>
          </a>
          <a className="glass pill pill-glass" href="#tools">
            <span>
              Watch the tools<span className="wide-only"> work</span>
            </span>
            <ArrowDown size={16} aria-hidden />
          </a>
        </div>

        <IntroVideo className="hero-video settle" style={step(3)} />

        <div className="hero-meta settle" style={step(6)}>
          <p>
            <span className="dot" />
            <span>Open to senior and staff SRE, platform and AI-infrastructure roles</span>
          </p>
          <p>
            <BadgeCheck size={17} aria-hidden />
            <a href="#credentials">
              {cert.name}, {cert.issuer}
            </a>
          </p>
        </div>

        <aside className="glass built hero-built settle" style={step(7)} aria-labelledby="built-title">
          <div className="built-head">
            <h2 id="built-title">What I built</h2>
            <VoiceSwitch />
          </div>
          <div className="built-rows">
            {tools.map((t, i) => {
              const repo = live.repo(t.repo)
              const pushed = ago(repo.pushedAt, now)
              return (
                <button key={t.id} className="built-row online" style={step(i)} onClick={() => onOpenTool(t.id)}>
                  <span className="built-glyph">
                    <t.Glyph />
                  </span>
                  <span>
                    <span className="built-name">{t.name}</span>
                    <span className="built-what">{say(t.simple, t.technical)}</span>
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
          </div>
          {/* always rendered, so nothing moves when the live data arrives; the dot pulses only when it is live */}
          <p className="built-live">
            <span className={live.source === "live" ? "dot-live" : "dot"} /> Test status and dates come from GitHub
          </p>
        </aside>
      </div>
    </section>
  )
}
