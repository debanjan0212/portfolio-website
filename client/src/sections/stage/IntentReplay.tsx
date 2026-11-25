import { useState } from "react"
import { intentops } from "@/data/runs"
import { usePrefs, useSay } from "@/lib/prefs"
import { useReplay, type Beat } from "@/lib/replay"
import Screen from "./Screen"

// file, capacity, slo, policy, cost, render, canary
const beats: Beat[] = [{ ms: 1700 }, { ms: 2100 }, { ms: 2500 }, { ms: 2100 }, { ms: 2500 }, { ms: 2100 }, { ms: 0 }]
const order = ["id", "capacity", "slo", "policy", "cost"] as const

const usd = (n: number) => `$${n.toFixed(2)}`

export default function IntentReplay({ active }: { active: boolean }) {
  const say = useSay()
  const { reduced, voice } = usePrefs()
  const r = useReplay(beats, { active, reduced, key: "intentops" })
  const at = r.at
  const [release, setRelease] = useState<"bad" | "good">("bad")
  const verdict = intentops.canary[release]

  const now = at >= 1 && at <= 4 ? order[at] : at === 0 ? "id" : null
  const read = (g: string) => order.indexOf(g as (typeof order)[number]) < Math.max(1, at) || at >= 5

  const captions: [string, string][] = [
    ["You write what the app needs in one small file. This is the whole input.", "The whole input: one intent file. No Kubernetes YAML."],
    ["It works out how many copies to run for the busiest hour.", "Capacity: replicas from peak rps at a 70% utilisation target."],
    ["It turns your reliability promise into downtime you can afford, and sets the alarms.", "SLO: a 30-day error budget and multi-window burn-rate alerts."],
    ["It checks the setup against safety rules before anything ships.", "Policy gate: the check exits non-zero on any failure."],
    ["It prices the same app on every cloud, against your budget.", "Cost: baseline and peak dollars a month for each target."],
    ["It writes the deployment files for wherever you run.", "Renders manifests, Helm, Kustomize, Argo CD or Flux for every target."],
    ["New versions go to a few users first. If they misbehave, it pulls them back. Maths decides, not the AI.", "Canary analysis: statistics decide promote or rollback. The model only explains the result."],
  ]
  const caption = captions[Math.max(0, Math.min(6, at))]

  return (
    <Screen
      command={intentops.command}
      step={Math.max(1, at + 1)}
      steps={7}
      say={say(caption[0], caption[1])}
      progress={r.progress}
      done={r.done}
      paused={r.paused}
      onToggle={r.toggle}
      onReplay={r.restart}
      foot={
        <>
          <span>
            <b>1</b> file in
          </span>
          <span>
            <b>{intentops.render.filesPerTarget}</b> files out per target
          </span>
          <span>
            <b>{intentops.render.targets.length}</b> targets
          </span>
          <span>{say("the AI never writes the config", "the model fills a typed schema; a compiler does the rest")}</span>
        </>
      }
    >
      <div className="igrid">
        <pre className="well iyaml" aria-label="The intent file">
          {intentops.intent.map((l) => (
            <code key={l.line} className={now === l.group ? "is-now" : read(l.group) ? "is-read" : ""}>
              {l.line}
            </code>
          ))}
        </pre>

        <div className="iout">
          {intentops.plan.map((p) => {
            const idx = order.indexOf(p.group)
            return (
              <div key={p.title} className={`well icard${at >= idx ? " is-on" : ""}${at === idx ? " is-now" : ""}`}>
                <h4>{p.title}</h4>
                <strong>{p.value}</strong>
                <p>{voice === "simple" ? p.plain : p.technical}</p>
              </div>
            )
          })}

        </div>
      </div>

      <div className="iwide">
        <div className={`well icard${at >= 4 ? " is-on" : ""}${at === 4 ? " is-now" : ""}`}>
          <h4>
            {say("Monthly cost, quiet to busiest", "Monthly cost, baseline to peak")} (budget ${intentops.budget})
          </h4>
          <div className="bars">
            {intentops.cost.map((c) => (
              <div className="bar" key={c.cloud}>
                <span>{c.cloud}</span>
                <b>
                  {usd(c.min)} to {usd(c.peak)}
                </b>
                <span className="bar-track">
                  <span className="bar-fill" style={{ left: `${(c.min / intentops.budget) * 100}%`, width: `${((c.peak - c.min) / intentops.budget) * 100}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`well icard${at >= 5 ? " is-on" : ""}${at === 5 ? " is-now" : ""}`}>
          <h4>{say("Ready to deploy on", "Rendered for")}</h4>
          <div className="chips">
            {intentops.render.targets.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          <p>{say(`${intentops.render.filesPerTarget} files for each, written for you.`, `${intentops.render.filesPerTarget} files per target: workload, HPA, PDB, NetworkPolicy, ExternalSecret, SLO rules, analysis.`)}</p>
        </div>
      </div>

      <div key={release} className={`well canary${at >= 6 ? ` is-on is-${release}` : ""}`}>
        <div className="canary-top">
          <h4>{say("Releasing a new version", "SLO-gated canary")}</h4>
          <div className="seg" role="group" aria-label="Which release to test">
            <button aria-pressed={release === "bad"} onClick={() => setRelease("bad")}>
              {say("A broken version", "Bad release")}
            </button>
            <button aria-pressed={release === "good"} onClick={() => setRelease("good")}>
              {say("A healthy version", "Good release")}
            </button>
          </div>
        </div>
        <div className="ctrack" aria-label="Share of users on the new version at each step">
          {intentops.canary.steps.map((s, i) => (
            <div className="cstep" key={s} style={{ "--i": i } as React.CSSProperties}>
              <i />
              <b>{s}%</b>
              <small>{release === "good" ? "healthy" : i === 0 ? "pulled back" : "never reached"}</small>
            </div>
          ))}
        </div>
        <div className="verdict">
          <span>
            {say("What it saw", "Canary sample")}: {verdict.input}
          </span>
          <strong>
            {verdict.verdict}
            {voice === "technical" && `, z = ${verdict.z}`}
          </strong>
          {voice === "simple" ? (
            <span>
              {release === "bad"
                ? "About 3 in 100 requests failed on the new version. It was pulled back at 10% of users, before most people saw it."
                : "The new version behaved like the old one, so it went out to everyone in three steps."}
            </span>
          ) : (
            <ul>
              {verdict.reasons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Screen>
  )
}
