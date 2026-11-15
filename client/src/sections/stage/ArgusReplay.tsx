import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { GitPullRequest } from "lucide-react"
import { argus } from "@/data/runs"
import { usePrefs, useSay } from "@/lib/prefs"
import { useReplay, type Beat } from "@/lib/replay"
import Screen from "./Screen"

const N = argus.calls.length
// alert, the 11 read-only calls, root cause, fix
const beats: Beat[] = [{ ms: 1900 }, ...argus.calls.map(() => ({ ms: 560 })), { ms: 3200 }, { ms: 0 }]
const CAUSE = N + 1
const FIX = N + 2

const swap = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(6px)" },
  transition: { duration: 0.35 },
}

export default function ArgusReplay({ active }: { active: boolean }) {
  const say = useSay()
  const { reduced, voice } = usePrefs()
  const r = useReplay(beats, { active, reduced, key: "argus" })
  const at = r.at

  const callIdx = at >= 1 && at <= N ? at - 1 : -1
  const call = callIdx >= 0 ? argus.calls[callIdx] : null
  const prev = callIdx > 0 ? argus.calls[callIdx - 1] : null
  const seen = useMemo(() => new Set(argus.calls.slice(0, Math.max(0, Math.min(N, at))).filter((c) => c.tool === "golden_signals").map((c) => c.target)), [at])

  const step = at < 1 ? 1 : at <= N ? 2 : at === CAUSE ? 3 : 4
  const caption =
    step === 1
      ? say(`An alarm goes off. ${argus.alert.plain}`, `${argus.alert.name} fires: ${argus.alert.summary}.`)
      : step === 2
        ? say("Argus checks each service behind the front page. It can look, but it cannot touch.", "Runbook mode walks the dependency graph over MCP. Every tool call is read-only.")
        : step === 3
          ? say(`Found it. ${argus.report.plain}`, `Root cause on ${argus.report.component}: ${argus.report.rootCause}. Confidence ${argus.report.confidence}.`)
          : say("The fix is written up as a change request. Nothing happens until a person accepts it.", "The rollback is committed on its own branch and opened as a pull request. Argus cannot merge it.")

  return (
    <Screen
      command={argus.command}
      step={step}
      steps={4}
      say={caption}
      progress={r.progress}
      done={r.done}
      paused={r.paused}
      onToggle={r.toggle}
      onReplay={r.restart}
      foot={
        <>
          <span>
            <b>{argus.stats.toolCalls}</b> read-only checks
          </span>
          <span>
            <b>0</b> writes to the cluster
          </span>
          <span>
            the real run took <b>{argus.stats.seconds}s</b>
          </span>
          <span>
            passes <b>{argus.evals.passed} of {argus.evals.total}</b> recorded incidents
          </span>
        </>
      }
    >
      <div className="amap" role="img" aria-label="Three services in a chain: frontend calls checkout, checkout calls payments">
        {argus.services.map((s) => {
          const known = s.id === "frontend" ? at >= 0 : seen.has(s.id) || at > N
          const looking = call?.target === s.id
          const cause = at >= CAUSE && s.id === argus.report.component
          const alarm = s.id === "frontend" && at >= 0 && !looking
          const fine = known && !cause && s.errorPct < 1
          const hop = !!call && !!prev && prev.target === s.id && call.target !== s.id && argus.services.findIndex((x) => x.id === call.target) > argus.services.findIndex((x) => x.id === s.id)
          const cls = ["anode", cause ? "is-cause" : looking ? "is-looking" : alarm ? "is-alarm" : "", fine ? "is-fine" : "", hop ? "is-hop" : ""].join(" ")
          return (
            <div key={`${s.id}-${hop ? callIdx : "x"}`} className={cls}>
              {cause ? <span className="anode-tag">cause</span> : s.id === "frontend" && at >= 0 ? <span className="anode-tag">alarm</span> : null}
              <div className="anode-name">{s.id}</div>
              <div className="anode-plain">{s.plain}</div>
              <div className="anode-num">
                {known ? `${s.errorPct}%` : "–"}
                <span className="anode-unit">{known ? "requests failing" : "not checked yet"}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="aswap">
        <AnimatePresence mode="wait" initial={false}>
          {at < CAUSE ? (
            <motion.div key="feed" className="well afeed term" {...swap}>
              <div className="afeed-count">
                <span>{say("What Argus is looking at", "Audit log of the run")}</span>
                <span>
                  <b>{Math.max(0, Math.min(N, at))}</b> of {N} checks
                </span>
              </div>
              <ol>
                {at < 1 && <li>{say("waiting for the alarm…", "alert received, starting investigation")}</li>}
                {argus.calls.slice(Math.max(0, at - 4), Math.max(0, at)).map((c, i) => (
                  <li key={`${at}-${i}`}>
                    {voice === "simple" ? (
                      <>
                        {c.target}: {c.plain} <span>{c.tool}</span>
                      </>
                    ) : (
                      <>
                        {c.tool}({c.target}) <span>{c.plain}</span>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </motion.div>
          ) : at === CAUSE ? (
            <motion.div key="cause" className="well acard" {...swap}>
              <h4>Root cause, confidence {argus.report.confidence}</h4>
              <p>{say(argus.report.plain, `${argus.report.component}: ${argus.report.rootCause}`)}</p>
              <ul>
                {argus.report.evidence.slice(voice === "simple" ? 2 : 0).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div key="fix" className="well acard" {...swap}>
              <h4>
                {say("Proposed fix", "Proposed remediation")}: {argus.fix.action}
              </h4>
              <p>{say(argus.fix.plain, argus.fix.commit)}</p>
              <div className="diff">
                <div className="is-file">{argus.fix.file}</div>
                <div className="is-del">
                  <span>-</span>
                  {argus.fix.removed}
                </div>
                <div className="is-add">
                  <span>+</span>
                  {argus.fix.added}
                </div>
              </div>
              <div className="await">
                <GitPullRequest size={16} aria-hidden />
                <span>
                  {say("Waiting for a person to accept it. Argus is not able to.", "Branch")} {voice === "technical" && <code>{argus.fix.branch}</code>}
                  {voice === "technical" && ", waiting for human review."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  )
}
