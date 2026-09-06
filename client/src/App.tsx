import Nav from "./components/Nav"
import Footer from "./components/Footer"
import AgentChat from "./components/AgentChat"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Experience from "./sections/Experience"
import AgenticLoop from "./sections/AgenticLoop"
import Work from "./sections/Work"
import Melt from "./sections/Melt"
import AgentOps from "./sections/AgentOps"
import Skills from "./sections/Skills"
import Contact from "./sections/Contact"
import Answer from "./pages/Answer"
import { Curtain, DarkBand, ScrollProgress, SmoothScroll } from "./lib/motion"

export default function App() {
  // One extra route only: the private answer page the digest email links to.
  // Not worth a router dependency for a single path.
  const isAnswerPage = window.location.pathname.replace(/\/$/, "") === "/answer"

  if (isAnswerPage) {
    return <Answer />
  }

  return (
    <SmoothScroll>
      <Curtain />
      <ScrollProgress />

      {/*
        Two-tone page. Light and editorial where the reading happens, dark
        bands where the technical work is shown - so the contrast means
        something instead of everything being dark by default.
      */}
      <div className="relative">
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />

          <DarkBand>
            <AgenticLoop />
            <Melt />
            <AgentOps />
          </DarkBand>

          <Work />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>

      <AgentChat />
    </SmoothScroll>
  )
}
