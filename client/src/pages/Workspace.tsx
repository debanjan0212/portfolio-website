import { useState } from "react"
import { ArrowUpRight, Check, ChevronRight, FileText, Plus, Search, Send, Sparkles, Users } from "lucide-react"

type Assistant = { id:string; name:string; role:string; color:string; initials:string; prompts:string[] }
type Task = { title:string; status:string; x:string; y:string; description:string }

const assistants: Assistant[] = [
  {id:"guide",name:"Work Guide",role:"Orient & prioritize",color:"#e4ad3f",initials:"WG",prompts:["What should I work on next?","Explain this project"]},
  {id:"research",name:"Research Assistant",role:"Find signal in documents",color:"#53b4a4",initials:"RS",prompts:["Summarize the latest file","What information is missing?"]},
  {id:"planning",name:"Planning Assistant",role:"Turn ideas into a plan",color:"#ef7657",initials:"PL",prompts:["Turn this into a plan","Create launch milestones"]},
  {id:"review",name:"Review Assistant",role:"Spot gaps and risks",color:"#9888dd",initials:"RV",prompts:["Review this project","Find the key risks"]},
  {id:"creative",name:"Creative Assistant",role:"Explore better directions",color:"#dc82a5",initials:"CR",prompts:["Suggest three approaches","Make this easier to explain"]},
  {id:"technical",name:"Technical Assistant",role:"Explain implementation",color:"#5793d4",initials:"TS",prompts:["Explain the architecture","What could fail here?"]},
]
const initialTasks: Task[] = [
  {title:"Define migration runbook",status:"In progress",x:"23%",y:"28%",description:"Document the safe sequence for moving services into the private cluster."},
  {title:"Validate rollback path",status:"Blocked",x:"59%",y:"21%",description:"Waiting on an approved recovery strategy before implementation can continue."},
  {title:"Share architecture notes",status:"Next up",x:"70%",y:"64%",description:"Give the team a concise view of the target architecture and ownership."},
]

export default function Workspace() {
  const [active,setActive] = useState(assistants[0])
  const [tasks,setTasks] = useState(initialTasks)
  const [selected,setSelected] = useState(initialTasks[0])
  const [mode,setMode] = useState<"single"|"compare"|"team">("single")
  const [query,setQuery] = useState("")
  const [answer,setAnswer] = useState("")
  const [busy,setBusy] = useState(false)
  async function ask(text=query) {
    if (!text.trim() || busy) return
    setQuery(""); setBusy(true); setAnswer("Working across the selected context...")
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:text.slice(0,4000)}],knowledge:`Workspace: Private EKS Migration. Task: ${selected.title}. Status: ${selected.status}. Assistant: ${active.name}. Mode: ${mode}.`})})
      setAnswer(await res.text())
    } catch { setAnswer("The assistant is offline, but your workspace remains available. Try again when the connection returns.") }
    finally { setBusy(false) }
  }
  function completeTask(){ const next={...selected,status:"Complete"}; setSelected(next); setTasks(items=>items.map(item=>item.title===next.title?next:item)) }
  return <div className="studio min-h-screen bg-[#f3f0e8] text-[#172128]">
    <header className="studio-header"><div className="flex items-center gap-3"><div className="brand-mark">D</div><span className="font-mono text-xs font-bold tracking-[.2em]">WORKSTUDIO / 01</span></div><nav className="hidden gap-9 text-sm text-[#667078] md:flex"><a className="text-[#172128]" href="#workspace">Workspace</a><a href="#assistants">Assistants</a><a href="#files">Files</a></nav><button className="icon-button" aria-label="Search"><Search size={17}/></button></header>
    <main className="mx-auto max-w-[1500px] px-5 pb-14 md:px-10">
      <section className="mb-9 flex flex-col justify-between gap-7 pt-14 md:flex-row md:items-end"><div><p className="eyebrow">Tuesday / 09:41 local</p><h1 className="studio-title">Make the work<br/><em>move forward.</em></h1></div><div className="flex items-center gap-3 rounded-full border border-[#172128]/10 bg-white/50 px-4 py-2.5 text-sm"><span className="status-dot"/> All systems clear <ChevronRight size={15}/></div></section>
      <div className="studio-grid" id="workspace"><section className="space-card map-card"><div className="card-heading"><div><p className="eyebrow">Active project / 03</p><h2>Private EKS Migration</h2></div><button className="round-action" aria-label="Open project"><ArrowUpRight size={16}/></button></div><div className="spatial-map" aria-label="Interactive project map"><div className="map-grid"/><div className="map-orbit orbit-one"/><div className="map-orbit orbit-two"/><svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M24 31 C41 38 49 27 60 24 S67 51 70 65"/><path d="M39 54 C48 46 60 51 70 65"/></svg><button className="project-core" aria-label="Private EKS Migration, 68 percent complete"><span>68%</span><small>CORE PROJECT</small></button>{tasks.map((task,index)=><button key={task.title} onClick={()=>setSelected(task)} className={`task-node ${selected.title===task.title?"selected":""}`} style={{left:task.x,top:task.y}}><span className={task.status==="Complete"?"done-dot":""}/><b>{task.title}</b><small>{task.status}</small></button>)}</div><div className="map-footer"><span><span className="legend-dot teal"/> 4 complete</span><span><span className="legend-dot orange"/> 3 in motion</span><span>Updated 12m ago</span></div></section><aside className="space-card context-card"><div className="card-heading"><div><p className="eyebrow">Selected task</p><h2>{selected.title}</h2></div><span className="priority">P1</span></div><p className="context-copy">{selected.description}</p><div className="progress-label"><span>Task progress</span><b>{selected.status==="Complete"?"100":"72"}%</b></div><div className="progress"><i style={{width:selected.status==="Complete"?"100%":"72%"}}/></div><div className="detail-row"><FileText size={16}/> migration-runbook.md <span>2h ago</span></div><button onClick={completeTask} disabled={selected.status==="Complete"} className="primary-button w-full justify-center disabled:opacity-40"><Check size={16}/> {selected.status==="Complete"?"Completed":"Mark as complete"}</button></aside></div>
      <section className="assistant-layout" id="assistants"><aside className="assistant-list"><div className="flex items-center justify-between"><p className="eyebrow">Your crew</p><button className="text-[#ef7657]" aria-label="Add assistant"><Plus size={17}/></button></div>{assistants.map(a=><button key={a.id} onClick={()=>{setActive(a);setAnswer("")}} className={`assistant-item ${active.id===a.id?"active":""}`}><span className="assistant-avatar" style={{background:a.color}}>{a.initials}</span><span><b>{a.name}</b><small>{a.role}</small></span>{active.id===a.id&&<span className="active-bar"/>}</button>)}</aside><div className="space-card chat-card"><div className="chat-top"><div className="assistant-avatar" style={{background:active.color}}>{active.initials}</div><div><p className="eyebrow">Currently speaking</p><h2>{mode==="team"?"Work Studio team":active.name}</h2><span>{active.role} / context: Private EKS Migration</span></div><select className="mode-pill" value={mode} onChange={e=>setMode(e.target.value as typeof mode)} aria-label="Assistant mode"><option value="single">Single mode</option><option value="compare">Compare mode</option><option value="team">Team mode</option></select></div><div className="chat-body"><div className="message assistant-message"><span className="message-label">{mode==="team"?"Coordinated response":active.name}</span><p>{busy?"Thinking...":answer||"You’re making good progress. The migration runbook is the highest-leverage item because it unblocks validation and gives the team a safe path back."}</p>{answer&&!busy&&<div className="prompt-row"><button onClick={completeTask}><Check size={13}/> Create task</button><button onClick={()=>setAnswer("")}>Ask a follow-up</button></div>}</div>{!answer&&<div className="prompt-row">{active.prompts.map(prompt=><button key={prompt} onClick={()=>ask(prompt)}>{prompt}<ArrowUpRight size={13}/></button>)}</div>}</div><form className="composer" onSubmit={e=>{e.preventDefault();ask()}}><Sparkles size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Ask ${active.name}...`} aria-label={`Ask ${active.name}`}/><button aria-label="Send message"><Send size={16}/></button></form></div></section>
    </main>
  </div>
}
