import Nav from "./components/Nav"
import Footer from "./components/Footer"
import AgentChat from "./components/AgentChat"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Experience from "./sections/Experience"
import AgenticLoop from "./sections/AgenticLoop"
import Work from "./sections/Work"
import Skills from "./sections/Skills"
import Contact from "./sections/Contact"
import {
  AmbientField,
  CursorGlow,
  Curtain,
  ScrollProgress,
  SmoothScroll,
} from "./lib/motion"

export default function App() {
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
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>

      <AgentChat />
    </SmoothScroll>
  )
}
