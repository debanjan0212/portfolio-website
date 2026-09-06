import Nav from "./components/Nav"
import Footer from "./components/Footer"
import AgentChat from "./components/AgentChat"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Experience from "./sections/Experience"
import AgenticLoop from "./sections/AgenticLoop"
import Work from "./sections/Work"
import Melt from "./sections/Melt"
import Skills from "./sections/Skills"
import Contact from "./sections/Contact"
import Answer from "./pages/Answer"
import {
  AmbientField,
  CursorGlow,
  Curtain,
  ScrollProgress,
  SmoothScroll,
} from "./lib/motion"

export default function App() {
  // One extra route only: the private answer page the digest email links to.
  // Not worth a router dependency for a single path.
  const isAnswerPage = window.location.pathname.replace(/\/$/, "") === "/answer"

  if (isAnswerPage) {
    return (
      <>
        <AmbientField />
        <div className="grain" />
        <Answer />
      </>
    )
  }

  return (
    <SmoothScroll>
      <Curtain />
      <AmbientField />
      <CursorGlow />
      <div className="grain" />
      <ScrollProgress />

      {/*
        Everything sits on one canvas. No section paints its own background,
        so there is nothing to blend at the seams - sections are separated by
        rhythm and space, never by an edge.
      */}
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />
          <AgenticLoop />
          <Work />
          <Melt />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>

      <AgentChat />
    </SmoothScroll>
  )
}
