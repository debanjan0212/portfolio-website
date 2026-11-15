import { useEffect, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Menu, Moon, Sun, X } from "lucide-react"
import { PrefsProvider, usePrefs, VoiceSwitch } from "./lib/prefs"
import Hero from "./sections/Hero"
import Stage from "./sections/Stage"
import Telemetry from "./sections/Telemetry"
import Security from "./sections/Security"
import Experience from "./sections/Experience"
import About from "./sections/About"
import Contact from "./sections/Contact"
import Footer from "./components/Footer"
import AgentChat, { CHAT_EVENT } from "./components/AgentChat"
import MiniMe from "./components/MiniMe"
import Answer from "./pages/Answer"

const links = [
  ["#tools", "Tools"],
  ["#telemetry", "Telemetry"],
  ["#security", "Security"],
  ["#experience", "Experience"],
  ["#about", "About"],
  ["#contact", "Contact"],
] as const

export type ToolId = "argus" | "intentops" | "harness"

function Nav() {
  const { theme, toggleTheme } = usePrefs()
  const [open, setOpen] = useState(false)

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
          <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
            debanjan<span>.</span>das
          </a>
          <div className="nav-links">
            {links.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <VoiceSwitch className="nav-voice" />
            <button className="nav-chat" onClick={() => window.dispatchEvent(new Event(CHAT_EVENT))} aria-label="Ask mini-me a question about my work">
              <MiniMe size={40} />
            </button>
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
              {links.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="nav-menu-foot">
                <VoiceSwitch />
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

function Portfolio() {
  const { reduced } = usePrefs()
  // which tool the stage shows; the hero list can set it before scrolling there
  const [tool, setTool] = useState<ToolId>("argus")

  const openTool = (id: ToolId) => {
    setTool(id)
    document.getElementById("tools")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="site">
        <div className="ambient" aria-hidden />
        <Nav />
        <main id="top">
          <Hero onOpenTool={openTool} />
          <Stage tool={tool} onTool={setTool} />
          <Telemetry />
          <Security />
          <Experience />
          <About />
          <Contact />
        </main>
        <Footer />
        <AgentChat />
      </div>
    </MotionConfig>
  )
}

export default function App() {
  // One extra route only: the private answer page the nightly digest email links to.
  if (typeof window !== "undefined" && window.location.pathname.replace(/\/$/, "") === "/answer") return <Answer />
  return (
    <PrefsProvider>
      <Portfolio />
    </PrefsProvider>
  )
}
