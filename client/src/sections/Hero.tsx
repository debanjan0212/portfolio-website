import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { profile } from "@/data/profile"
import { Magnetic, RevealWords, useSmoothScroll } from "@/lib/motion"
import AgentMesh from "@/components/AgentMesh"

const readouts = [
  { k: "experience", v: `${profile.years} yrs` },
  { k: "current", v: "Hitachi DS" },
  { k: "focus", v: "OTel / SRE" },
  { k: "base", v: "Bengaluru" },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  // Foreground drifts up faster than the ambient field behind it.
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] items-center px-6 pt-28"
    >
      <motion.div style={{ y, opacity }} className="mx-auto grid w-full max-w-shell items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
        <div className="flex items-center gap-3">
          <span className="dot-live" />
          <motion.p
            className="mono-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {profile.role} · {profile.company}
          </motion.p>
        </div>

        <h1 className="display mt-8 text-[clamp(2.75rem,8.5vw,7rem)]">
          <RevealWords text="Reliability for systems" delay={1.5} />
          <br />
          <span className="text-mid">
            <RevealWords text="that think." delay={1.72} />
          </span>
        </h1>

        <motion.p
          className="lede mt-9 max-w-2xl text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {profile.intro}
        </motion.p>

        <motion.div
          className="mt-11 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <Magnetic
            onClick={() => scrollTo("#work")}
            className="group gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-ink-0"
          >
            See the work
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Magnetic>

          <Magnetic
            onClick={() => scrollTo("#contact")}
            className="rounded-full border border-hairline/15 px-7 py-3.5 text-sm text-mid transition-colors duration-300 hover:border-accent/40 hover:text-hi"
          >
            Get in touch
          </Magnetic>
        </motion.div>

        {/* Telemetry readout strip - the control-room accent, kept quiet. */}
        <motion.div
          className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline/[0.07] bg-hairline/[0.04] sm:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.45, duration: 1 }}
        >
          {readouts.map((r) => (
            <div key={r.k} className="bg-ink-0/60 px-5 py-4 backdrop-blur-sm">
              <p className="mono-label">{r.k}</p>
              <p className="mt-1.5 font-mono text-sm text-hi">{r.v}</p>
            </div>
          ))}
        </motion.div>
        </div>

        <AgentMesh className="hidden aspect-square w-full max-w-md lg:block" />
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
