import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Activity, Bot, Eye, GitBranch, Play, ShieldCheck, Telescope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/* ------------------------------------------------------------------ */
/* Stat tiles - hero numbers, not charts. No legend, no axes, no hover. */
/* ------------------------------------------------------------------ */

type Stat = {
  value: number
  suffix: string
  label: string
  detail: string
  /** 0-1, drives the thin meter under the number. Omit for no meter. */
  meter?: number
}

const stats: Stat[] = [
  {
    value: 99.8,
    suffix: "%",
    label: "Deployment success rate",
    detail: "Across 200+ production deployments at TransUnion",
    meter: 0.998,
  },
  {
    value: 800,
    suffix: "+",
    label: "Servers migrated",
    detail: "On-premises to private EKS clusters, zero data loss",
  },
  {
    value: 56,
    suffix: "%",
    label: "Build time reduction",
    detail: "Jenkins pipelines cut from 45 minutes to 20",
    meter: 0.56,
  },
  {
    value: 40,
    suffix: "%",
    label: "Infrastructure cost cut",
    detail: "ELK stack migration delivered for Royal Mail",
    meter: 0.4,
  },
]

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration])

  return value
}

function StatTile({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const value = useCountUp(stat.value, active)
  const decimals = Number.isInteger(stat.value) ? 0 : 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Card className="h-full p-6">
        <div className="flex items-baseline gap-0.5 font-bold tabular-nums">
          <span className="text-4xl text-foreground">{value.toFixed(decimals)}</span>
          <span className="text-2xl text-primary">{stat.suffix}</span>
        </div>

        {stat.meter !== undefined && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={active ? { scaleX: stat.meter } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: index * 0.08 + 0.2, ease: "easeOut" }}
              style={{ originX: 0 }}
            />
          </div>
        )}

        <p className="mt-4 text-sm font-medium text-foreground">{stat.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.detail}</p>
      </Card>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* The agentic loop - a scroll-driven diagram of how OAA actually runs  */
/* ------------------------------------------------------------------ */

const loopSteps = [
  {
    icon: Telescope,
    title: "Observe",
    body: "OpenTelemetry traces, metrics and logs stream in from the estate. Agent runs are instrumented like any other service.",
  },
  {
    icon: Bot,
    title: "Reason",
    body: "The agent correlates signals against known failure modes and runbooks, and proposes an action with its evidence attached.",
  },
  {
    icon: Play,
    title: "Act",
    body: "Remediation runs through the same GitOps path a human would use - reviewable, reversible, and fully audited.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    body: "SLOs and error budgets confirm the fix landed. If they do not recover, the change rolls back and a human is paged.",
  },
]

function AgentLoop() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const ringLength = useTransform(scrollYProgress, [0.1, 0.85], [0, 1])

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-2">
      {/* Diagram */}
      <div className="relative mx-auto w-full max-w-sm">
        <svg viewBox="0 0 200 200" className="w-full" role="img" aria-label="Agentic operations loop: observe, reason, act, verify">
          <circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength: ringLength }}
            transform="rotate(-90 100 100)"
          />
          {loopSteps.map((_, i) => {
            const angle = (i / loopSteps.length) * Math.PI * 2 - Math.PI / 2
            return (
              <motion.circle
                key={i}
                cx={100 + Math.cos(angle) * 72}
                cy={100 + Math.sin(angle) * 72}
                r="7"
                fill="hsl(var(--background))"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
                style={{ transformOrigin: `${100 + Math.cos(angle) * 72}px ${100 + Math.sin(angle) * 72}px` }}
              />
            )
          })}
          <foreignObject x="60" y="76" width="80" height="48">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Activity className="h-5 w-5 text-primary" />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                OAA loop
              </span>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {loopSteps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              className="flex gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

const practices = [
  {
    icon: Eye,
    title: "Observability first",
    body: "OpenTelemetry instrumentation and an LGTM stack run as infrastructure as code, so every service ships with traces, metrics and logs from day one.",
  },
  {
    icon: ShieldCheck,
    title: "SLOs and error budgets",
    body: "Reliability targets are written down and enforced. Error budget burn is what decides whether the next change ships or waits.",
  },
  {
    icon: GitBranch,
    title: "GitOps as the only path",
    body: "Every change - human or agent - goes through the same reviewed, reversible pipeline. No console-driven fixes at 3am.",
  },
]

export default function AgenticOps() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" })
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" })

  return (
    <section id="agentic" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Bot className="mr-1.5 h-3 w-3" />
            Operational Agentic AI
          </Badge>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Agents, wired into <span className="text-primary">real operations</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Reliability engineering is where agentic AI either earns its keep or gets
            switched off. Here is how I build it so it earns its keep.
          </p>
        </motion.div>

        <AgentLoop />

        {/* Practices */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {practices.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full p-6">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Track record */}
        <div ref={statsRef} className="mt-20">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Track record
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatTile key={s.label} stat={s} active={statsInView} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
