import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useSmoothScroll } from "@/lib/motion"

const items = [
  { label: "About", href: "#about" },
  { label: "Trajectory", href: "#experience" },
  { label: "Agentic", href: "#agentic" },
  { label: "Work", href: "#work" },
  { label: "MELT", href: "#melt" },
  { label: "Stack", href: "#skills" },
  { label: "Contact", href: "#contact" },
]

export default function Nav() {
  const { scrollTo } = useSmoothScroll()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("")
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let current = ""
      for (const it of items) {
        const el = document.getElementById(it.href.slice(1))
        if (el && el.getBoundingClientRect().top <= 140) current = it.href
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (href: string) => {
    scrollTo(href)
    setMenu(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed inset-x-0 top-0 z-[75] transition-all duration-500 ${
          scrolled ? "border-b border-hairline/[0.07] bg-ink-0/70 backdrop-blur-xl" : ""
        }`}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-4">
          <button onClick={() => go("#home")} className="font-mono text-sm tracking-tight text-hi">
            debanjan<span className="text-accent">.</span>das
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {items.map((it) => (
              <button
                key={it.href}
                onClick={() => go(it.href)}
                className={`relative px-3.5 py-2 text-sm transition-colors duration-300 ${
                  active === it.href ? "text-hi" : "text-low hover:text-mid"
                }`}
              >
                {it.label}
                {active === it.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3.5 -bottom-px h-px bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMenu(true)}
            className="text-mid md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink-0/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-end px-6 py-4">
              <button onClick={() => setMenu(false)} aria-label="Close menu" className="text-mid">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col px-6 pt-8">
              {items.map((it, i) => (
                <motion.button
                  key={it.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5 }}
                  onClick={() => go(it.href)}
                  className="display border-b border-hairline/[0.07] py-6 text-left text-3xl text-hi"
                >
                  {it.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
