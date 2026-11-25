import { Fragment } from "react"
import { BadgeCheck, Download } from "lucide-react"
import { certifications, looking, profile } from "@/data/profile"
import { useSay, VoiceSwitch } from "@/lib/prefs"
import { ago, useLive, useNow, type RepoName } from "@/lib/live"
import type { ToolId } from "@/App"

/** One short line each: the section further down explains them properly. */
const tools: {
  id: ToolId
  repo: RepoName
  name: string
  simple: string
  technical: string
}[] = [
  { id: "argus", repo: "argus-sre-agent", name: "Argus", simple: "An AI on-call engineer", technical: "AI SRE agent over MCP" },
  { id: "intentops", repo: "intentops", name: "IntentOps", simple: "Plans servers, alarms and cost", technical: "Intent to capacity, SLOs, cost, canary" },
  { id: "harness", repo: "agent-harness-sdk", name: "agent-harness-sdk", simple: "AI agents that ask before they act", technical: "Agent SDK: policy in code, approval" },
]

const step = (i: number) => ({ "--i": i }) as React.CSSProperties

/**
 * The first screen is one composition: the name runs edge to edge, the
 * portrait stands in front of it with the face in the gap between the two
 * words, the facts sit in the four corners, and the controls sit in one glass
 * dock. Straight after it, the status board lists the three tools, so on a
 * phone the certification and the tools are still on the first screen.
 */
export default function Hero({ onOpenTool }: { onOpenTool: (id: ToolId) => void }) {
  const say = useSay()
  const live = useLive()
  const now = useNow()
  const cert = certifications[0]
  const last = profile.employers.length - 1
  const [first, ...rest] = profile.name.split(" ")

  return (
    <>
      <section className="hero" aria-labelledby="name">
        <p className="hero-corner is-tl settle" style={step(0)}>
          {profile.role}
          <br />
          {profile.company}
        </p>
        <p className="hero-corner is-tr settle" style={step(0)}>
          {profile.location}
          <br />
          {looking.location[0]}
        </p>

        <div className="hero-stage">
          {/* the space between the spans keeps the heading "Debanjan Das" for search engines and screen readers */}
          <h1 id="name" className="hero-name settle" style={step(1)}>
            <span>{first}</span> <span>{rest.join(" ")}</span>
          </h1>
          <img
            className="hero-cutout settle"
            style={step(2)}
            src="/portrait-cutout.webp"
            alt={`Portrait of ${profile.name}`}
            width={916}
            height={916}
            decoding="async"
            {...{ fetchpriority: "high" }}
          />
        </div>

        <div className="hero-dock glass settle" style={step(3)}>
          <a className="pill pill-solid" href="/DebanjanDas-Resume.pdf" download>
            <Download size={16} aria-hidden />
            <span className="wide-only">Download résumé</span>
            <span className="narrow-only">Résumé</span>
          </a>
          <VoiceSwitch />
        </div>

        <p className="hero-corner is-bl settle" style={step(4)}>
          <span suppressHydrationWarning>{profile.years}</span> years at{" "}
          {profile.employers.map((name, i) => (
            <Fragment key={name}>
              <b>{name}</b>
              {i < last - 1 ? ", " : i === last - 1 ? " and " : "."}
            </Fragment>
          ))}
        </p>
        <a
          className="hero-corner is-br hero-cert settle"
          style={step(4)}
          href={cert.verifyUrl || "#credentials"}
          {...(cert.verifyUrl ? { target: "_blank", rel: "noreferrer", "aria-label": `${cert.name}, ${cert.issuer}. Verify on Credly` } : {})}
        >
          <BadgeCheck size={18} aria-hidden />
          <span>
            <b>{cert.name}</b>
            <br />
            {cert.issuer}, {cert.date}
          </span>
        </a>
      </section>

      {/* a status board, not three cards: one row per tool, the whole row is the button */}
      <section className="board shell" aria-labelledby="built-title">
        <h2 id="built-title" className="board-head">
          What I built
        </h2>
        <div className="board-rows">
          {tools.map((t, i) => {
            const repo = live.repo(t.repo)
            const pushed = ago(repo.pushedAt, now)
            const ci = repo.ci && repo.ci.state !== "unknown" ? repo.ci.state : null
            return (
              <button key={t.id} className="board-row online" style={step(i)} onClick={() => onOpenTool(t.id)}>
                <span className="board-name">{t.name}</span>
                <span className="board-what">{say(t.simple, t.technical)}</span>
                <span className="board-status">
                  {ci && (
                    <span className={`state is-${ci}`}>
                      <i />
                      <span>
                        <span className="wide-only">tests </span>
                        {ci}
                      </span>
                    </span>
                  )}
                  {pushed && <span className="board-when">updated {pushed}</span>}
                </span>
                <span className="sr-only">Watch {t.name} work</span>
              </button>
            )
          })}
        </div>
        <p className="board-note">Test status and dates come from GitHub on every visit.</p>
      </section>
    </>
  )
}
