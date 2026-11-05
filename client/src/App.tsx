import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight, Menu, Moon, Pause, Play, RotateCcw, Sun, X } from "lucide-react"
import { profile } from "./data/profile"
import About from "./sections/About"
import Experience from "./sections/Experience"
import AgenticLoop from "./sections/AgenticLoop"
import Melt from "./sections/Melt"
import AgentOps from "./sections/AgentOps"
import Work from "./sections/Work"
import Lab from "./sections/Lab"
import Skills from "./sections/Skills"
import Contact from "./sections/Contact"
import Footer from "./components/Footer"
import AgentChat from "./components/AgentChat"
import Answer from "./pages/Answer"
import { CountUp, SmoothScroll, useSmoothScroll } from "./lib/motion"
import CasePoster, { caseCards } from "./sections/CaseCards"

const proof = [
  { value: "800+", label: "servers migrated to private EKS" },
  { value: "99.8%", label: "release success across 200+ deploys" },
  { value: "40%", label: "infrastructure cost removed" },
]

/* Real numbers from the profile, floated over the intro as glass. */
const chips = [
  { k: "OAA", v: "18 services · 8 agents traced", pos: "tl", speed: -60 },
  { k: "TMNA", v: "~180 monitors shipped", pos: "tr", speed: -110 },
  { k: "EKS", v: "800+ servers migrated", pos: "bl", speed: -30 },
  { k: "SLO", v: "99.8% release success", pos: "br", speed: -85 },
]

const links = [
  ["#work", "Work"],
  ["#lab", "Open source"],
  ["#about", "About"],
  ["#experience", "Experience"],
  ["#skills", "Stack"],
  ["#contact", "Contact"],
]

const ease = [0.2, 0.8, 0.2, 1] as const

function SiteLoader({ done }: { done: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  // plays at its native size, slowed down so it reads as a deliberate hold
  useEffect(() => { if (ref.current) ref.current.playbackRate = 0.6 }, [])
  return <div className={done ? "site-loader is-done" : "site-loader"} aria-hidden={done}>
    <video ref={ref} className="site-loader-video" src="/loading-screen.mp4" autoPlay muted loop playsInline />
  </div>
}

function Nav({ theme, onTheme }: { theme: "dark" | "light"; onTheme: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24)
    f()
    window.addEventListener("scroll", f, { passive: true })
    return () => window.removeEventListener("scroll", f)
  }, [])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }

  return <header className={scrolled ? "lg-nav-wrap is-scrolled" : "lg-nav-wrap"}>
    <nav className="glass lg-nav" aria-label="Primary">
      <a href="#top" className="future-logo" onClick={e => go(e, "#top")}>debanjan<span>.</span>das</a>
      <div className={open ? "lg-links open glass" : "lg-links"}>
        {links.map(([href, label]) => <a key={href} href={href} onClick={e => go(e, href)}>{label}</a>)}
      </div>
      <div className="nav-right">
        <button className="theme-toggle" onClick={onTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <a className="lg-pill lg-pill-solid lg-pill-sm desktop-resume" href="/DebanjanDas-Resume.pdf" download>Résumé</a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </nav>
  </header>
}

function Stage({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  const stage = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [volume, setVolume] = useState(0.8)
  // mobile gets a lighter encode; picked once, on mount
  const [src] = useState(() => window.innerWidth < 820 ? "/intro_portfolio_website.mobile.mp4" : "/intro_portfolio_website.web.mp4")

  // The frame tilts up and settles flat as it scrolls into place, like a lid opening.
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "center center"] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0])
  const radius = useTransform(scrollYProgress, [0, 1], [44, 28])
  const innerRadius = useTransform(radius, r => r - 10)
  const { scrollYProgress: pass } = useScroll({ target: stage, offset: ["start end", "end start"] })

  // nothing plays until it is asked for - so the click is a user gesture and audio is allowed
  const start = () => {
    const v = videoRef.current
    if (!v) return
    if (ended) v.currentTime = 0
    v.muted = false
    v.volume = volume
    v.play().catch(() => {})
  }

  return <div className="lg-stage" ref={stage}>
    <motion.div className="glass lg-frame" style={{ scale, rotateX, borderRadius: radius }}>
      <motion.div className="lg-screen" style={{ borderRadius: innerRadius }}>
        <video ref={videoRef} className="hero-video" src={src} poster="/intro-poster.jpg" playsInline preload="metadata"
               onPlay={() => { setPlaying(true); setEnded(false) }}
               onPause={() => setPlaying(false)}
               onEnded={() => { setPlaying(false); setEnded(true) }} />
        {!playing && <button className="glass lg-play" onClick={start} aria-label={ended ? "Replay intro" : "Play intro"}>
          <span>{ended ? <RotateCcw size={18} /> : <Play size={18} fill="currentColor" />}</span>
          {ended ? "Replay" : "Watch the intro"}
        </button>}
        {playing && <div className="glass lg-audio">
          <button onClick={() => videoRef.current?.pause()} aria-label="Pause intro"><Pause size={14} /></button>
          <input className="hero-volume" type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => { const next = Number(e.target.value); setVolume(next); if (videoRef.current) videoRef.current.volume = next }}
            aria-label="Video volume" />
        </div>}
      </motion.div>
    </motion.div>
    {chips.map(c => <Chip key={c.k} {...c} progress={pass} hidden={playing} />)}
  </div>
}

function Chip({ k, v, pos, speed, progress, hidden }: (typeof chips)[number] & { progress: ReturnType<typeof useScroll>["scrollYProgress"]; hidden: boolean }) {
  const y = useTransform(progress, [0, 1], [-speed / 2, speed / 2])
  return <motion.div className={`glass lg-chip lg-chip-${pos}${hidden ? " is-hidden" : ""}`} style={{ y }} aria-hidden>
    <b>{k}</b>{v}
  </motion.div>
}

function Hero({ ready, videoRef }: { ready: boolean; videoRef: React.RefObject<HTMLVideoElement> }) {
  const rise = (i: number) => ({
    initial: { opacity: 0, y: 26, filter: "blur(10px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } } : undefined,
    transition: { duration: 1.1, delay: 0.1 + i * 0.12, ease },
  })

  return <section className="lg-hero">
    <div className="lg-hero-copy">
      <motion.a {...rise(0)} href="#lab" className="glass lg-new">
        <em>New</em><span>Argus &amp; IntentOps<span className="hide-sm">: agentic SRE, open source</span></span><ChevronRight size={14} />
      </motion.a>
      <motion.p {...rise(1)} className="lg-eyebrow">{profile.role} · Bengaluru</motion.p>
      <motion.h1 {...rise(2)} className="lg-name">{profile.name}</motion.h1>
      <motion.p {...rise(3)} className="lg-tagline"><span className="lg-grad">Reliability for systems that think.</span></motion.p>
      <motion.p {...rise(4)} className="lg-lede">
        {profile.years} years keeping cloud platforms calm, from 800+ servers on private EKS to the observability layer of an agentic AI platform.
      </motion.p>
      <motion.div {...rise(5)} className="lg-actions">
        <a className="lg-pill lg-pill-solid" href="#work">See the work <ArrowUpRight size={16} /></a>
        <a className="glass lg-pill" href="/DebanjanDas-Resume.pdf" download>Download résumé</a>
      </motion.div>
      <motion.p {...rise(6)} className="availability"><span /> Open to senior &amp; staff SRE, platform and AI-infrastructure roles</motion.p>
    </div>
    <motion.div initial={{ opacity: 0, y: 60 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.4, delay: 0.5, ease }}>
      <Stage videoRef={videoRef} />
    </motion.div>
  </section>
}

const CASE_REPS = [-1, 0, 1]

function CaseStack({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const n = caseCards.length
  const [noAnim, setNoAnim] = useState(false)

  // `active` runs unbounded so every step is a real slide. Three copies of the
  // deck are laid out end to end, so there is always a card waiting to come in
  // from either side and nothing ever jumps across the stage.
  // Once active leaves [0,n) we fold it back by exactly n: the card sitting at
  // each visible position has the same content either way, so with transitions
  // off for one frame the fold is invisible.
  useLayoutEffect(() => {
    if (active >= n || active < 0) {
      setNoAnim(true)
      onPick(((active % n) + n) % n)
    }
  }, [active, n, onPick])

  useEffect(() => {
    if (!noAnim) return
    const r = requestAnimationFrame(() => setNoAnim(false))
    return () => cancelAnimationFrame(r)
  }, [noAnim])

  return (
    <div className="case-carousel">
      <button className="glass case-arrow" onClick={() => onPick(active - 1)} aria-label="Previous case study">
        <ChevronLeft size={19} />
      </button>
      <div className={noAnim ? "case-stack no-anim" : "case-stack"}>
        {CASE_REPS.map((rep) =>
          caseCards.map((card, i) => {
            const slot = i + rep * n
            const p = slot - active
            const abs = Math.abs(p)
            return (
              <article key={`${rep}-${card.titleTop}`} className="case-card"
                       aria-hidden={p !== 0}
                       onClick={() => onPick(slot)}
                       style={{ ["--p" as string]: p, ["--abs" as string]: abs, zIndex: n - Math.min(abs, n),
                                pointerEvents: abs > 1 ? "none" : undefined }}>
                <CasePoster card={card} index={i} />
              </article>
            )
          }),
        )}
      </div>
      <button className="glass case-arrow" onClick={() => onPick(active + 1)} aria-label="Next case study">
        <ChevronRight size={19} />
      </button>
    </div>
  )
}

function DeploymentFlow(){return <section className="deployment-section"><div><p className="future-kicker">HOW I SHIP</p><h2>From commit<br/><em>to confidence.</em></h2><p className="section-note">A delivery path is only reliable when the signal continues after deploy.</p></div><div className="deployment-flow">{["COMMIT","BUILD","TEST","DEPLOY","OBSERVE"].map((step,i)=><div className="flow-step" key={step}><span className="flow-node">0{i+1}</span><b>{step}</b>{i<4&&<i className="flow-line"/>}</div>)}</div></section>}

/* Specular highlight follows the pointer across whichever glass surface it is over. */
function useGlassPointer() {
  useEffect(() => {
    const f = (e: PointerEvent) => {
      const g = (e.target as Element | null)?.closest?.(".glass") as HTMLElement | null
      if (!g) return
      const r = g.getBoundingClientRect()
      g.style.setProperty("--mx", `${e.clientX - r.left}px`)
      g.style.setProperty("--my", `${e.clientY - r.top}px`)
    }
    window.addEventListener("pointermove", f, { passive: true })
    return () => window.removeEventListener("pointermove", f)
  }, [])
}

function Portfolio(){
  const [caseIndex,setCaseIndex]=useState(0)
  const [ready,setReady]=useState(false)
  const heroVideo=useRef<HTMLVideoElement>(null)
  const [theme,setTheme]=useState<"dark"|"light">(()=>{
    try{return localStorage.getItem("portfolio-theme")==="light"?"light":"dark"}catch{return "dark"}
  })
  useGlassPointer()

  useEffect(()=>{
    document.documentElement.dataset.theme=theme
    try{localStorage.setItem("portfolio-theme",theme)}catch{/* private mode */}
  },[theme])

  // Loader holds briefly, and until the hero video has metadata.
  // 6s ceiling so a slow/blocked video can never strand the visitor on the loader.
  useEffect(()=>{
    // first visit gets a short hold; returning visitors get through fast
    let seen=false
    try{seen=localStorage.getItem("portfolio-seen")==="1"}catch{/* private mode */}
    const minimum=new Promise(resolve=>setTimeout(resolve,seen?700:1800))
    const buffered=new Promise<void>(resolve=>{
      const v=heroVideo.current
      if(!v||v.readyState>=1)return resolve()
      const done=()=>resolve()
      v.addEventListener("loadedmetadata",done,{once:true})
      setTimeout(done,6000)
    })
    Promise.all([minimum,buffered]).then(()=>{
      setReady(true)
      try{localStorage.setItem("portfolio-seen","1")}catch{/* private mode */}
    })
  },[])

  useEffect(()=>{document.body.style.overflow=ready?"":"hidden";return()=>{document.body.style.overflow=""}},[ready])

  useEffect(()=>{
    const t=setTimeout(()=>setCaseIndex(i=>i+1),6500)
    return()=>clearTimeout(t)
  },[caseIndex])

  return <><SiteLoader done={ready}/><div className="future-site">
    <div className="lg-ambient" aria-hidden><i/><i/><i/></div>
    <Nav theme={theme} onTheme={()=>setTheme(t=>t==="dark"?"light":"dark")}/>
    <main id="top">
      <Hero ready={ready} videoRef={heroVideo}/>
      <section className="lg-proof" id="impact">{proof.map(p=><div className="glass" key={p.label}><CountUp value={p.value} className="lg-proof-value"/><p>{p.label}</p></div>)}</section>
      <Work/>
      <Lab/>
      <About/>
      <section className="case-section" id="case-studies"><div className="section-top"><p className="future-kicker">SELECTED CASE STUDIES</p><span>{String((((caseIndex%caseCards.length)+caseCards.length)%caseCards.length)+1).padStart(2,"0")} / {String(caseCards.length).padStart(2,"0")}</span></div><CaseStack active={caseIndex} onPick={setCaseIndex}/></section>
      <Experience/>
      <DeploymentFlow/>
      <div className="legacy-dark"><AgenticLoop/><Melt/><AgentOps/></div>
      <Skills/>
      <Contact/>
    </main>
    <Footer/>
    <AgentChat/>
  </div></>
}

export default function App(){
  // One extra route only: the private answer page the nightly digest email links to.
  if (window.location.pathname.replace(/\/$/, "") === "/answer") return <Answer/>
  return <SmoothScroll><Portfolio/></SmoothScroll>
}
