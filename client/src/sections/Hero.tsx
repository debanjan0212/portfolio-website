import { Fragment } from "react"
import { ArrowDown, ArrowRight, BadgeCheck, Download } from "lucide-react"
import { certifications, profile } from "@/data/profile"
import { useSay, VoiceSwitch } from "@/lib/prefs"
import { ago, useLive, useNow, type RepoName } from "@/lib/live"
import { ArgusGlyph, HarnessGlyph, IntentGlyph } from "@/components/Glyphs"
import IntroVideo from "@/components/IntroVideo"
import type { ToolId } from "@/App"

/** One short line each: the section right below explains them properly. */
const tools: {
  id: ToolId
  repo: RepoName
  name: string
  Glyph: typeof ArgusGlyph
  simple: string
  technical: string
}[] = [
  { id: "argus", repo: "argus-sre-agent", name: "Argus", Glyph: ArgusGlyph, simple: "An AI on-call engineer", technical: "AI SRE agent over MCP" },
  { id: "intentops", repo: "intentops", name: "IntentOps", Glyph: IntentGlyph, simple: "Plans servers, alarms and cost", technical: "Intent to capacity, SLOs, cost, canary" },
  { id: "harness", repo: "agent-harness-sdk", name: "agent-harness-sdk", Glyph: HarnessGlyph, simple: "AI agents that ask before they act", technical: "Agent SDK: policy in code, approval" },
]

const step = (i: number) => ({ "--i": i }) as React.CSSProperties

/**
 * The first screen answers, in order: who, where they have worked, what they
 * are certified in, and what they built. A phone shows a small portrait beside
 * the role and keeps the intro video just below the tools; a wide screen has
 * room for the video itself. The résumé is one tap away on both.
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
            <img className="hero-face" src="/portrait-192.webp" alt="" width={44} height={44} decoding="async" />
            <span>
              {profile.role}, {profile.location.split(",")[0]}
            </span>
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
          <a className="hero-cert settle" style={step(5)} href="#credentials">
            <BadgeCheck size={20} aria-hidden />
            <span>
              <b>{cert.name}</b>
              <small>
                {cert.issuer}, {cert.date}
              </small>
            </span>
          </a>
        </div>

        <div className="hero-actions hero-act settle" style={step(6)}>
          {/* a phone gets the short label, so both buttons share one row */}
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

        <aside className="glass built hero-built settle" style={step(7)} aria-labelledby="built-title">
          <h2 id="built-title" className="built-head">
            What I built
          </h2>
          <div className="built-rows">
            {tools.map((t, i) => {
              const repo = live.repo(t.repo)
              const pushed = ago(repo.pushedAt, now)
              const ci = repo.ci && repo.ci.state !== "unknown" ? repo.ci.state : null
              return (
                <button key={t.id} className="built-row online" style={step(i)} onClick={() => onOpenTool(t.id)}>
                  <span className="built-glyph">
                    <t.Glyph />
                  </span>
                  <span className="built-text">
                    {/* a phone shows the short status beside the name; wider screens get the full status line */}
                    <span className="built-top">
                      <span className="built-name">{t.name}</span>
                      {ci && (
                        <span className={`state is-${ci}`}>
                          <i />
                          {ci}
                        </span>
                      )}
                    </span>
                    <span className="built-what">{say(t.simple, t.technical)}</span>
                    <span className="built-status">
                      {ci && (
                        <span className={`state is-${ci}`}>
                          <i />
                          tests {ci}
                        </span>
                      )}
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
          <div className="built-foot">
            <p className="built-live">
              <span className={live.source === "live" ? "dot-live" : "dot"} /> Test status and dates come from GitHub
            </p>
            <VoiceSwitch />
          </div>
        </aside>

        <IntroVideo className="hero-video settle" style={step(3)} />

        <p className="hero-meta settle" style={step(8)}>
          <span className="dot" />
          <span>Open to senior and staff SRE, platform and AI-infrastructure roles</span>
        </p>
      </div>
    </section>
  )
}
