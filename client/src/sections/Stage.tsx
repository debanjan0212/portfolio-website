import { useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { argus, harness, intentops } from "@/data/runs"
import { useSay } from "@/lib/prefs"
import { useInView } from "@/lib/useInView"
import { ArgusGlyph, HarnessGlyph, IntentGlyph } from "@/components/Glyphs"
import ArgusReplay from "./stage/ArgusReplay"
import IntentReplay from "./stage/IntentReplay"
import HarnessReplay from "./stage/HarnessReplay"
import type { ToolId } from "@/App"

type Copy = {
  id: ToolId
  tab: string
  Glyph: typeof ArgusGlyph
  title: [string, string]
  body: [string, string]
  does: [string, string][]
  never: [string, string]
  repo: string
  run: string
}

const copy: Copy[] = [
  {
    id: "argus",
    tab: "Argus",
    Glyph: ArgusGlyph,
    title: ["An AI on-call engineer that cannot touch production", "Argus: an AI SRE agent over MCP"],
    body: [
      "When an alarm goes off, Argus checks the systems like an on-call engineer and works out what broke. It only reads. A person has to accept the fix.",
      "An alert fires. Argus investigates through read-only MCP tools over Prometheus, Loki, Tempo and Kubernetes, finds the root cause and proposes the fix as a GitOps pull request. A rule-based runbook mode takes over when the model is down.",
    ],
    does: [
      ["Finds the cause, even when it is two services away from the alarm.", "Traces the degradation down the service graph instead of stopping at the alerting service."],
      ["Passes all 5 recorded incidents in its own test suite, on every change.", "5 of 5 recorded incidents pass the agent evals in CI, over real MCP."],
    ],
    never: ["Never changes the live system. Every fix goes through Git and a human review.", "Never writes to the cluster. Tool gate, change limits, secret redaction and injection checks are enforced in code."],
    repo: argus.repo,
    run: argus.command,
  },
  {
    id: "intentops",
    tab: "IntentOps",
    Glyph: IntentGlyph,
    title: ["Describe the app once. Run it on any cloud.", "IntentOps: an intent-driven platform agent"],
    body: [
      "You write down what the app needs: how reliable, how busy, how much you can spend. IntentOps turns that into the server setup, the alarms and a price for each cloud.",
      "One intent file in, a deterministic compiler out: capacity plan, error budget and multi-window burn-rate alerts, policy checks, cost per cloud, and plain manifests for EKS, GKE, AKS, bare metal or kind. Canaries are gated on the SLO.",
    ],
    does: [
      ["One small file in, 13 ready-to-deploy files out, for 5 kinds of infrastructure.", "13 rendered files per target across EKS, AKS, GKE, bare metal and kind."],
      ["Runs its safety checks before anything ships: 12 pass and 1 warning on this example.", "Policy gate on every render: non-root, read-only root FS, pinned image, restricted egress for PII."],
    ],
    never: ["The AI never writes the config. It fills in a form, and tested code does the rest.", "The model never writes YAML. It fills a typed schema; plans and release decisions never depend on it."],
    repo: intentops.repo,
    run: "make demo",
  },
  {
    id: "harness",
    tab: "Harness SDK",
    Glyph: HarnessGlyph,
    title: ["A toolkit for AI agents that ask before they act", "agent-harness-sdk: read, analyse, decide, act"],
    body: [
      "A starting kit for AI agents that work on production systems. Every agent built on it looks first, decides on one action, and needs a yes from a person before it changes anything.",
      "A Python SDK for operational agents: read-only tools, one decided action, policy in code and human approval before any change, with secret redaction, injection checks and budgets built in. Works alone or inside LangChain, LangGraph, CrewAI, LlamaIndex, the OpenAI Agents SDK or any MCP client.",
    ],
    does: [
      ["You are the human in the loop here. Approve or deny the rollback and see what happens.", "The approval gate below is interactive: both answers replay recorded output from the demo."],
      ["Knows its limits. When there is no safe fix, it calls a person instead of guessing.", "Escalates with evidence when no bounded action is safe, as in the db-pool scenario."],
    ],
    never: ["Its rules live in code, not in the AI's instructions, so it cannot be talked out of them.", "Guardrails run in code, never in the prompt: they hold when the model is wrong or manipulated."],
    repo: harness.repo,
    run: "python -m incident_commander demo --scenario bad-deploy --approve ask",
  },
]

export default function Stage({ tool, onTool }: { tool: ToolId; onTool: (t: ToolId) => void }) {
  const say = useSay()
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -20% 0px", 0.15)
  const idx = copy.findIndex((c) => c.id === tool)
  const last = useRef(idx)
  const dir = idx >= last.current ? 1 : -1
  last.current = idx
  const c = copy[idx]

  return (
    <section id="tools" className="sec shell" aria-labelledby="tools-title">
      <div className="sec-head">
        <h2 id="tools-title" className="h2">
          Watch them work
        </h2>
        <p className="sub">
          {say(
            "Three open-source tools I built. Each panel replays a run recorded from the project's own demo command.",
            "Three open-source projects. Each panel replays a run recorded from the repo's own demo command. The command is shown, so you can repeat it.",
          )}
        </p>
      </div>

      <div className="glass tabs" role="tablist" aria-label="Tools">
        {copy.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={t.id === tool} aria-controls="tool-panel" className="tab" onClick={() => onTool(t.id)}>
            {t.id === tool && <motion.span layoutId="tab-ink" className="tab-ink" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <span className="tab-label" style={{ display: "inline-flex" }}><t.Glyph size={18} /></span>
            <span className="tab-label">{t.tab}</span>
          </button>
        ))}
      </div>

      <div ref={ref} id="tool-panel" role="tabpanel" aria-labelledby={`tab-${tool}`}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={tool}
            className="stage-body"
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 48, filter: "blur(12px)" }),
              show: { opacity: 1, x: 0, filter: "blur(0px)" },
              leave: (d: number) => ({ opacity: 0, x: d * -48, filter: "blur(12px)" }),
            }}
            initial="enter"
            animate="show"
            exit="leave"
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="stage-copy">
              <h3>{say(c.title[0], c.title[1])}</h3>
              <p>{say(c.body[0], c.body[1])}</p>
              <ul className="facts">
                {c.does.map((d) => (
                  <li key={d[0]}>
                    <Check size={17} aria-hidden />
                    <span>{say(d[0], d[1])}</span>
                  </li>
                ))}
                <li className="is-never">
                  <X size={17} aria-hidden />
                  <span>{say(c.never[0], c.never[1])}</span>
                </li>
              </ul>
              <div className="stage-links">
                <a className="link" href={c.repo} target="_blank" rel="noreferrer">
                  {say("See the code on GitHub", "Source on GitHub")}
                </a>
              </div>
            </div>
            {tool === "argus" ? <ArgusReplay active={inView} /> : tool === "intentops" ? <IntentReplay active={inView} /> : <HarnessReplay active={inView} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
