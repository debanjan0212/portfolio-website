import { projects } from "@/data/profile"
import { CountUp, RevealWords, Rise, Tilt } from "@/lib/motion"
import { motion } from "framer-motion"
import { useRef, useState } from "react"

function Spotlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -999, y: -999 })

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
      }}
      onPointerLeave={() => setPos({ x: -999, y: -999 })}
      className="panel panel-hover group relative h-full overflow-hidden p-8"
    >
      {/* Light that follows the pointer across the individual panel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgb(var(--accent) / 0.07), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export default function Work() {
  const featured = projects.find((p) => p.featured)!
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="work" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-shell">
        <p className="mono-label">Selected work</p>
        <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.25rem)]">
          <RevealWords text="Things I built that" />
          <br />
          <span className="text-mid">
            <RevealWords text="are still running." delay={0.1} />
          </span>
        </h2>

        {/* Featured */}
        <Rise className="mt-16">
          <Spotlight>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="mono-label">
                {featured.org} · {featured.period}
              </p>
              <p className="mono-label text-accent">Current focus</p>
            </div>

            <h3 className="display mt-6 max-w-3xl text-2xl md:text-4xl">
              {featured.title}
            </h3>

            <p className="lede mt-6 max-w-2xl">{featured.summary}</p>

            <div className="mt-10 flex flex-wrap gap-12">
              {featured.metrics.map((m) => (
                <div key={m.label}>
                  <CountUp value={m.value} className="font-mono text-3xl text-hi md:text-4xl" />
                  <p className="mt-2 text-xs text-low">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {featured.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline/10 px-3 py-1 font-mono text-[0.7rem] text-mid"
                >
                  {t}
                </span>
              ))}
            </div>
          </Spotlight>
        </Rise>

        {/* The rest */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Tilt className="h-full">
              <Spotlight>
                <p className="mono-label">
                  {p.org} · {p.period}
                </p>
                <h3 className="mt-5 text-lg text-hi md:text-xl">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mid">{p.summary}</p>

                <div className="mt-8 flex flex-wrap gap-8">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <CountUp value={m.value} className="block font-mono text-xl text-hi" />
                      <p className="mt-1 text-[0.7rem] text-low">{m.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-hairline/10 px-2.5 py-0.5 font-mono text-[0.68rem] text-low"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Spotlight>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
