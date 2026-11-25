import { useState } from "react"
import { MotionConfig } from "framer-motion"
import { PrefsProvider, usePrefs } from "./lib/prefs"
import { noteForPath } from "./data/notes"
import Nav from "./components/Nav"
import Hero from "./sections/Hero"
import Intro from "./sections/Intro"
import Stage from "./sections/Stage"
import Telemetry from "./sections/Telemetry"
import Security from "./sections/Security"
import Writing from "./sections/Writing"
import Experience from "./sections/Experience"
import Contact from "./sections/Contact"
import Footer from "./components/Footer"
import AgentChat from "./components/AgentChat"
import Answer from "./pages/Answer"
import Note from "./pages/Note"

export type ToolId = "argus" | "intentops" | "harness"

function Portfolio() {
  const { reduced } = usePrefs()
  // which tool the stage shows; the hero list can set it before scrolling there
  const [tool, setTool] = useState<ToolId>("argus")

  const openTool = (id: ToolId) => {
    setTool(id)
    document.getElementById("tools")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  }

  return (
    <div className="site">
      <Nav home />
      <main id="top">
        <Hero onOpenTool={openTool} />
        <Intro />
        <Stage tool={tool} onTool={setTool} />
        <Telemetry />
        <Security />
        <Writing />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <AgentChat />
    </div>
  )
}

/**
 * Three kinds of page, chosen by the address: the portfolio, a write-up under
 * /notes/, and the private answer page the nightly digest email links to.
 * `path` is passed in when the page is rendered at build time; the browser
 * reads its own address, so both produce the same HTML.
 */
export default function App({ path }: { path?: string }) {
  const at = (path ?? (typeof window !== "undefined" ? window.location.pathname : "/")).replace(/\/+$/, "") || "/"
  if (at === "/answer") return <Answer />
  const note = noteForPath(at)

  return (
    <PrefsProvider>
      <MotionConfig reducedMotion="user">{note ? <Note note={note} /> : <Portfolio />}</MotionConfig>
    </PrefsProvider>
  )
}
