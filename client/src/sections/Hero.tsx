import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { profile, roles } from "@/data/profile"
import { Magnetic, RevealWords, Rise, useSmoothScroll } from "@/lib/motion"

/**
 * The hero answers three questions in the first two seconds: who he is, what
 * he does, and how senior he is. Everything else on the page is secondary to
 * that, so nothing else competes for the top of the screen.
 */

const HEADLINES = [
  { value: "800+", label: "servers migrated to private EKS" },
  { value: "99.8%", label: "deployment success across 200+ releases" },
  { value: "40%", label: "infrastructure cost removed" },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -60])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const companies = roles.map((r) => r.company.replace(/\s*\(.*\)$/, ""))

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] items-center px-6 pb-20 pt-32"
    >
      {/* A single soft wash, keeping the page from reading as flat white. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 75% 20%, rgb(var(--accent) / 0.07), transparent 70%)",
        }}
      />

      <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-shell">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.7 }}
        >
          <span className="dot-live" />
          <p className="mono-label">Open to senior SRE &amp; platform roles</p>
        </motion.div>

        {/* The name, largest thing on the page. */}
        <h1 className="display-name mt-7 text-[clamp(2.9rem,10vw,8rem)]">
          <RevealWords text="Debanjan Das" delay={1.45} />
        </h1>

        {/* Designation and seniority, immediately under it. */}
        <motion.div
          className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium text-hi">
            Senior Site Reliability Engineer
          </p>
          <span aria-hidden className="h-4 w-px bg-hairline/20" />
          <p className="text-[clamp(1.1rem,2.4vw,1.6rem)] text-mid">Cloud &amp; DevOps</p>
          <span
            className="rounded-full border border-accent/30 bg-accent/[0.07] px-3 py-1 font-mono text-xs text-accent"
            title="Since August 2018"
          >
            {profile.years} years
          </span>
        </motion.div>

        <motion.p
          className="lede mt-8 max-w-2xl text-lg md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {profile.intro}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.15, duration: 0.7 }}
        >
          <Magnetic
            onClick={() => scrollTo("#work")}
            className="group gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white"
          >
            See the work
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Magnetic>

          <Magnetic
            onClick={() => scrollTo("#contact")}
            className="rounded-full border border-hairline/20 px-7 py-3.5 text-sm text-mid transition-colors duration-300 hover:border-accent/40 hover:text-hi"
          >
            Get in touch
          </Magnetic>
        </motion.div>

        {/* Where he has done it. Names, not logos - they are other companies'
            marks, and a wall of logos reads as decoration anyway. */}
        <Rise delay={2.3} className="mt-16">
          <p className="mono-label">Eight years across</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {companies.map((c) => (
              <span key={c} className="text-sm text-mid">
                {c}
              </span>
            ))}
          </div>
        </Rise>

        {/* The numbers, checkable against the work section below. */}
        <Rise delay={2.42} className="mt-10">
          <div className="rule-fade" />
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {HEADLINES.map((h) => (
              <div key={h.label}>
                <p className="font-mono text-3xl text-hi md:text-4xl">{h.value}</p>
                <p className="mt-2 max-w-[15rem] text-sm leading-snug text-low">{h.label}</p>
              </div>
            ))}
          </div>
        </Rise>
      </motion.div>

      <motion.button
        onClick={() => scrollTo("#about")}
        aria-label="Scroll down"
        className="absolute bottom-6 right-6 text-low transition-colors hover:text-hi lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 7, 0] }}
        transition={{
          opacity: { delay: 2.7, duration: 1 },
          y: { delay: 2.7, duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </section>
  )
}
