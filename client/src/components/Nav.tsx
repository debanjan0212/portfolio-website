import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Moon, Sun, X } from "lucide-react"
import { usePrefs, VoiceSwitch } from "@/lib/prefs"
import { CHAT_EVENT } from "./AgentChat"
import MiniMe from "./MiniMe"

const links = [
  ["tools", "Tools"],
  ["telemetry", "Telemetry"],
  ["security", "Security"],
  ["writing", "Writing"],
  ["experience", "Experience"],
  ["contact", "Contact"],
] as const

/**
 * One nav for both kinds of page. On the home page the links jump within the
 * page. On a write-up they lead back to the home page, and the two home-only
 * controls (plain or technical wording, the chat) are left out.
 */
export default function Nav({ home }: { home: boolean }) {
  const { theme, toggleTheme } = usePrefs()
  const [open, setOpen] = useState(false)
  const to = (id: string) => (home ? `#${id}` : `/#${id}`)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-scrim"
            onClick={() => setOpen(false)}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
      <header className="nav-wrap">
        <nav className="glass nav" aria-label="Primary">
          <a href={home ? "#top" : "/"} className="nav-logo" onClick={() => setOpen(false)}>
            debanjan<span>.</span>das
          </a>
          <div className="nav-links">
            {links.map(([id, label]) => (
              <a key={id} href={to(id)}>
                {label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            {home && (
              <button className="nav-chat" onClick={() => window.dispatchEvent(new Event(CHAT_EVENT))} aria-label="Ask mini-me a question about my work">
                <MiniMe size={40} />
              </button>
            )}
            <button className="icon-btn" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a className="pill pill-solid pill-sm nav-resume" href="/DebanjanDas-Resume.pdf" download>
              Résumé
            </a>
            <button className="icon-btn nav-burger" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="nav-menu">
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              className="glass nav-menu"
              id="nav-menu"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {links.map(([id, label]) => (
                <a key={id} href={to(id)} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="nav-menu-foot">
                {home ? <VoiceSwitch /> : <span />}
                <a className="pill pill-solid pill-sm" href="/DebanjanDas-Resume.pdf" download>
                  Download résumé
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
