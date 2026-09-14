import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Menu, Moon, Pause, Play, RotateCcw, Send, Sun, X } from "lucide-react"
import { profile, knowledgeBase } from "./data/profile"
import About from "./sections/About"
import Experience from "./sections/Experience"
import AgenticLoop from "./sections/AgenticLoop"
import Melt from "./sections/Melt"
import AgentOps from "./sections/AgentOps"
import Work from "./sections/Work"
import Skills from "./sections/Skills"
import Contact from "./sections/Contact"
import Footer from "./components/Footer"
import { SmoothScroll } from "./lib/motion"
import CasePoster, { caseCards } from "./sections/CaseCards"

const proof = [{value:"800+",label:"servers migrated to private EKS"},{value:"99.8%",label:"release success across 200+ deploys"},{value:"40%",label:"infrastructure cost removed"}]
const prompts=["What makes him senior?","Show me his strongest impact","How does he approach reliability?","Tell me about the EKS migration","What roles is he looking for?"]
const skillGroups=[{name:"Cloud & platform",items:"AWS · EKS · Kubernetes · Terraform"},{name:"Observability",items:"OpenTelemetry · Dynatrace · ELK · APM · RUM"},{name:"Delivery",items:"GitHub Actions · Jenkins · ArgoCD · Helm"},{name:"Systems",items:"Python · Go · Linux · Incident response"}]

function SiteLoader({ done }: { done: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  // plays at its native size, slowed down so it reads as a deliberate hold
  useEffect(() => { if (ref.current) ref.current.playbackRate = 0.6 }, [])
  return <div className={done ? "site-loader is-done" : "site-loader"} aria-hidden={done}>
    <video ref={ref} className="site-loader-video" src="/loading-screen.mp4" autoPlay muted loop playsInline />
  </div>
}

function HeroVideo({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [volume, setVolume] = useState(0.8)
  // mobile gets a lighter encode; picked once, on mount
  const [src] = useState(() => window.innerWidth < 820 ? "/intro_portfolio_website.mobile.mp4" : "/intro_portfolio_website.web.mp4")

  // nothing plays until it is asked for - so the click is a user gesture and audio is allowed
  const start = () => {
    const v = videoRef.current
    if (!v) return
    if (ended) v.currentTime = 0
    v.muted = false
    v.volume = volume
    v.play().catch(() => {})
  }

  return <>
    <div className="hero-media">
      <div className="hero-video-bg">
        <video ref={videoRef} className="hero-video" src={src} poster="/intro-poster.jpg" playsInline preload="metadata"
               onPlay={() => { setPlaying(true); setEnded(false) }}
               onPause={() => setPlaying(false)}
               onEnded={() => { setPlaying(false); setEnded(true) }} />
      </div>
      {!playing && <button className="hero-play" onClick={start} aria-label={ended ? "Replay intro" : "Play intro"}>
        {ended ? <RotateCcw size={22} /> : <Play size={22} fill="currentColor" />}
        <em>{ended ? "REPLAY" : "PLAY INTRO"}</em>
      </button>}
    </div>
    {playing && <div className="hero-audio">
      <button className="hero-sound" onClick={() => videoRef.current?.pause()}><Pause size={13} /> PAUSE</button>
      <input className="hero-volume" type="range" min={0} max={1} step={0.05} value={volume}
        onChange={e => { const next = Number(e.target.value); setVolume(next); if (videoRef.current) videoRef.current.volume = next }}
        aria-label="Video volume" />
    </div>}
  </>
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
      <button className="case-arrow" onClick={() => onPick(active - 1)} aria-label="Previous case study">
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
      <button className="case-arrow" onClick={() => onPick(active + 1)} aria-label="Next case study">
        <ChevronRight size={19} />
      </button>
    </div>
  )
}

function Chat(){const [open,setOpen]=useState(false);const [input,setInput]=useState("");const [messages,setMessages]=useState([{role:"assistant",text:`Ask me about ${profile.first}'s impact, systems, or experience.`}]);const [busy,setBusy]=useState(false);async function send(){if(!input.trim()||busy)return;const text=input.trim();setInput("");setMessages(m=>[...m,{role:"user",text}]);setBusy(true);try{const r=await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:text}],knowledge:knowledgeBase()})});const reply=await r.text();setMessages(m=>[...m,{role:"assistant",text:reply}])}catch{setMessages(m=>[...m,{role:"assistant",text:"The assistant is temporarily offline. The portfolio content is still available below."}])}finally{setBusy(false)}}return <><button className="chat-launch" onClick={()=>setOpen(true)}><span/> Ask about my work <ArrowUpRight size={15}/></button>{open&&<div className="chat-window"><div className="chat-head"><div><small>PROFILE ASSISTANT / ONLINE</small><b>Ask about Debanjan</b></div><button onClick={()=>setOpen(false)} aria-label="Close chatbot"><X size={17}/></button></div><div className="chat-messages">{messages.map((m,i)=><div key={i} className={m.role}>{m.text}</div>)}{busy&&<div className="assistant typing">Thinking through his work...</div>}{messages.length===1&&<div className="chat-prompts">{prompts.map(p=><button key={p} onClick={()=>{setInput(p)}}>{p}<ChevronRight size={13}/></button>)}</div>}</div><form onSubmit={e=>{e.preventDefault();send()}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask a recruiter-level question..."/><button aria-label="Send"><Send size={16}/></button></form></div>}</>}

function DeploymentFlow(){return <section className="deployment-section"><div><p className="future-kicker">HOW I SHIP</p><h2>From commit<br/><em>to confidence.</em></h2><p className="section-note">A delivery path is only reliable when the signal continues after deploy.</p></div><div className="deployment-flow">{["COMMIT","BUILD","TEST","DEPLOY","OBSERVE"].map((step,i)=><div className="flow-step" key={step}><span className="flow-node">0{i+1}</span><b>{step}</b>{i<4&&<i className="flow-line"/>}</div>)}</div></section>}

export default function App(){
  const [menu,setMenu]=useState(false)
  const [caseIndex,setCaseIndex]=useState(0)
  const [ready,setReady]=useState(false)
  const heroVideo=useRef<HTMLVideoElement>(null)
  const caseDir=useRef(1)
  const [theme,setTheme]=useState<"dark"|"light">(()=>{
    try{return localStorage.getItem("portfolio-theme")==="light"?"light":"dark"}catch{return "dark"}
  })

  useEffect(()=>{
    document.documentElement.dataset.theme=theme
    try{localStorage.setItem("portfolio-theme",theme)}catch{/* private mode */}
  },[theme])

  // loader holds for 3s minimum, and until the hero video can play through.
  // 8s ceiling so a slow/blocked video can never strand the visitor on the loader.
  useEffect(()=>{
    // full hold the first time someone lands; returning visitors get through fast
    let seen=false
    try{seen=localStorage.getItem("portfolio-seen")==="1"}catch{/* private mode */}
    const minimum=new Promise(resolve=>setTimeout(resolve,seen?900:5200))
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

  return <SmoothScroll><SiteLoader done={ready}/><div className="future-site"><header className="future-nav"><a href="#top" className="future-logo">debanjan<span>.</span>das</a><nav className={menu?"open":""}><a href="#about" onClick={()=>setMenu(false)}>About</a><a href="#experience" onClick={()=>setMenu(false)}>Experience</a><a href="#work" onClick={()=>setMenu(false)}>Work</a><a href="#skills" onClick={()=>setMenu(false)}>Stack</a><a href="#contact" onClick={()=>setMenu(false)}>Contact</a></nav><div className="nav-right"><button className="theme-toggle" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} aria-label={theme==="dark"?"Switch to light theme":"Switch to dark theme"}>{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</button><a className="nav-resume desktop-resume" href="/DebanjanDas-Resume.pdf" download>Résumé</a><button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X/>:<Menu/>}</button></div></header><main id="top"><section className="future-hero"><HeroVideo videoRef={heroVideo}/><div className="hero-copy"><p className="future-kicker"><i/> SENIOR SITE RELIABILITY ENGINEER / BENGALURU</p><h1 className="hero-nameplate">DEBANJAN<br/><em>DAS</em></h1><p className="hero-title">Senior Site Reliability Engineer <span>/</span> Cloud, Observability & Agentic AI</p><p className="future-lede">I build reliable cloud platforms, observability systems, and delivery paths that help teams move faster without losing control.</p><div className="future-actions"><a className="future-primary" href="#work">See the work <ArrowUpRight size={17}/></a><a className="future-secondary" href="#contact">Start a conversation</a></div><p className="availability"><span/> Open to senior SRE & platform opportunities</p><a className="resume-link" href="/DebanjanDas-Resume.pdf" download>Download resume <ArrowUpRight size={14}/></a></div></section><section className="proof-strip" id="impact">{proof.map(p=><div key={p.label}><strong>{p.value}</strong><span>{p.label}</span></div>)}</section><section className="recruiter-card"><div><p className="future-kicker">RECRUITER QUICK VIEW</p><h2>Senior scope.<br/><em>Production proof.</em></h2></div><div className="quick-facts"><span><b>8+</b> years in SRE & platform</span><span><b>Bengaluru</b> based in India</span><span><b>Open</b> to senior opportunities</span><a href={`mailto:${profile.email}`}>Email me <ArrowUpRight size={14}/></a><span><a href={profile.linkedin}>LinkedIn</a><a href={profile.github}>GitHub</a></span></div></section><About/><section className="case-section" id="case-studies"><div className="section-top"><p className="future-kicker">SELECTED CASE STUDIES</p><span>{String((((caseIndex%caseCards.length)+caseCards.length)%caseCards.length)+1).padStart(2,"0")} / {String(caseCards.length).padStart(2,"0")}</span></div><CaseStack active={caseIndex} onPick={setCaseIndex}/></section><DeploymentFlow/><Experience/><div className="legacy-dark"><AgenticLoop/><Melt/><AgentOps/></div><Work/><section className="capability-section" id="skills"><p className="future-kicker">CAPABILITY STACK</p><div className="capability-grid">{skillGroups.map(group=><div key={group.name}><b>{group.name}</b><span>{group.items}</span></div>)}</div></section><Skills/><Contact/></main><Footer/><Chat/></div></SmoothScroll>}
