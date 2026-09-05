import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { roles } from "@/data/profile"
import { RevealWords, Rise } from "@/lib/motion"

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="experience" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-shell">
        <p className="mono-label">Trajectory</p>
        <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.25rem)]">
          <RevealWords text="Seven years, five companies," />
          <br />
          <span className="text-mid">
            <RevealWords text="one recurring problem." delay={0.1} />
          </span>
        </h2>

        <div className="mt-16">
          {roles.map((role, i) => {
            const isOpen = open === i
            return (
              <Rise key={role.company} delay={i * 0.05}>
                <div className="group border-t border-hairline/[0.08] last:border-b">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-6 py-8 text-left"
                  >
                    <span className="mt-1.5 hidden font-mono text-xs text-low sm:block">
                      0{i + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3
                          className={`text-xl transition-colors duration-400 md:text-2xl ${
                            isOpen ? "text-hi" : "text-mid group-hover:text-hi"
                          }`}
                        >
                          {role.company}
                        </h3>
                        <span className="font-mono text-xs text-low">{role.period}</span>
                      </div>
                      <p className="mt-2 text-sm text-low">{role.title}</p>
                    </div>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                      className="mt-1 shrink-0 text-low group-hover:text-accent"
                    >
                      <Plus className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10 sm:pl-12">
                          <p className="max-w-2xl text-base leading-relaxed text-mid">
                            {role.blurb}
                          </p>

                          <ul className="mt-7 grid gap-3 lg:grid-cols-2">
                            {role.points.map((p, pi) => (
                              <motion.li
                                key={pi}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + pi * 0.04, duration: 0.5 }}
                                className="flex gap-3 text-sm leading-relaxed text-low"
                              >
                                <span className="mt-[0.55rem] h-px w-3 shrink-0 bg-accent/50" />
                                <span>{p}</span>
                              </motion.li>
                            ))}
                          </ul>

                          <div className="mt-7 flex flex-wrap gap-2">
                            {role.stack.map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-hairline/10 px-3 py-1 font-mono text-[0.7rem] text-mid"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Rise>
            )
          })}
        </div>
      </div>
    </section>
  )
}
