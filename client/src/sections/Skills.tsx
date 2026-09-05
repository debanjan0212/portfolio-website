import { skillGroups } from "@/data/profile"
import { Marquee, RevealWords, Rise } from "@/lib/motion"
import { motion } from "framer-motion"

export default function Skills() {
  const marquee = skillGroups.flatMap((g) =>
    g.items.map((i) => i.replace(/\s*\(.*\)$/, "")),
  )

  return (
    <section id="skills" className="relative py-32 md:py-44">
      <Marquee items={marquee} speed={70} />
      <div className="mx-auto mt-20 max-w-shell px-6">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="mono-label">Stack</p>
            <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.25rem)]">
              <RevealWords text="What I reach for." />
            </h2>
            <p className="lede mt-7 max-w-md">
              Depth over logos. Everything here is something I have run in
              production, not something I read about.
            </p>
          </div>

          <div className="space-y-14">
            {skillGroups.map((group, gi) => (
              <Rise key={group.label} delay={gi * 0.06}>
                <div>
                  <div className="flex items-baseline gap-4">
                    <p className="mono-label whitespace-nowrap">{group.label}</p>
                    <div className="rule-fade flex-1" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-2 gap-y-2.5">
                    {group.items.map((item, i) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-5%" }}
                        transition={{ duration: 0.45, delay: i * 0.022 }}
                        className="rounded-lg border border-hairline/[0.08] bg-hairline/[0.02] px-3 py-1.5 text-sm text-mid transition-colors duration-300 hover:border-accent/30 hover:text-hi"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
