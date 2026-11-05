import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Briefcase, Code2, Layers, Mail, MapPin, Sparkles, X } from "lucide-react"
import { knowledgeBase, profile } from "@/data/profile"
import MiniMe, { type Mood } from "./MiniMe"

type Message = { role: "user" | "assistant"; content: string }

/** Help-desk counters shown before the first question. After that the server suggests. */
const TOPICS = [
  { icon: Sparkles, label: "Current work", q: "What is he building right now?" },
  { icon: Code2, label: "Open source", q: "What are Argus and IntentOps?" },
  { icon: Briefcase, label: "Experience", q: "What's the largest migration he has run?" },
  { icon: Layers, label: "Skills", q: "How deep is his OpenTelemetry experience?" },
  { icon: MapPin, label: "Availability", q: "What kind of role is he looking for?" },
  { icon: Mail, label: "Contact", q: "How can I reach him?" },
]
const OPENERS = TOPICS.map((t) => t.q)

const GREETING = `Hi, I'm mini-${profile.first}! I'm the pocket-sized help desk for ${profile.first}'s work. I only answer from his real profile, so no made-up stories. Pick a counter below or just ask.`

const MOODS: Mood[] = ["wave", "happy", "talk", "think", "calm"]

const NUDGE_KEY = "agent-nudge-seen"

function nudgeSeen() {
  try {
    return localStorage.getItem(NUDGE_KEY) === "1"
  } catch {
    return false
  }
}

export default function AgentChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ])
  // Follow-ups for the latest reply. The server picks these from what it can
  // actually answer, so staying on the rails always lands well.
  const [suggestions, setSuggestions] = useState<string[]>(OPENERS)
  const [nudge, setNudge] = useState(false)
  const [mood, setMood] = useState<Mood>("idle")
  const moodTimer = useRef<ReturnType<typeof setTimeout>>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Every prompt this visitor has already been offered. A suggestion is a
  // suggestion once; showing the same three chips after every reply makes the
  // assistant look like it has four things to say in total.
  const offered = useRef(new Set(OPENERS.map((o) => o.toLowerCase())))

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, busy])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350)
  }, [open])

  /** Show a mood, then settle back to idle. */
  function react(next: Mood, ms = 2400) {
    clearTimeout(moodTimer.current)
    setMood(next)
    if (ms > 0) moodTimer.current = setTimeout(() => setMood("idle"), ms)
  }

  // Waves hello whenever the desk opens.
  useEffect(() => {
    if (open) react("wave", 1800)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Show the nudge once, ever - not once per session. A returning visitor has
  // already been told the assistant exists; telling them again every visit is
  // nagging, not helpfulness.
  useEffect(() => {
    if (nudgeSeen()) return

    const show = setTimeout(() => setNudge(true), 5200)
    const hide = setTimeout(() => dismissNudge(), 15200)

    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function dismissNudge() {
    setNudge(false)
    try {
      localStorage.setItem(NUDGE_KEY, "1")
    } catch {
      // Blocked storage: worst case it appears again next visit.
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  async function send(text: string) {
    const question = text.trim()
    if (!question || busy) return

    setError(null)
    setInput("")
    const next: Message[] = [...messages, { role: "user", content: question }]
    setMessages(next)
    setBusy(true)
    react("think", 0)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1), knowledge: knowledgeBase() }),
      })
      if (!res.ok || !res.body) {
        const detail = await res.json().catch(() => null)
        throw new Error(detail?.error || "The assistant is unavailable right now.")
      }

      try {
        const raw = res.headers.get("x-suggestions")
        const incoming = raw ? (JSON.parse(atob(raw)) as string[]) : []
        const unseen = incoming.filter((s) => !offered.current.has(s.toLowerCase()))
        unseen.forEach((s) => offered.current.add(s.toLowerCase()))
        setSuggestions(unseen.slice(0, 3))
      } catch {
        setSuggestions([])
      }

      // A dev server or misconfigured host can answer /api/chat with the SPA
      // shell. Without this check the widget happily streamed raw HTML into
      // the transcript as if it were an answer.
      const type = res.headers.get("content-type") || ""
      if (!type.includes("text/plain")) {
        throw new Error(
          `Mini-me is taking a quick break. You can email ${profile.first} directly at ${profile.email}.`,
        )
      }

      const header = res.headers.get("x-mood") as Mood | null
      const after: Mood = header && MOODS.includes(header) ? header : "talk"
      react(after === "calm" ? "calm" : "talk", 0)

      setMessages((m) => [...m, { role: "assistant", content: "" }])
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value, { stream: true })
        setMessages((m) => {
          const copy = [...m]
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          }
          return copy
        })
      }
      // Answers stop talking once typed; small talk and jokes keep the grin a moment.
      react(after === "talk" ? "idle" : after, after === "talk" ? 0 : 2600)
    } catch (e) {
      react("calm", 2400)
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setMessages((m) => (m[m.length - 1]?.content === "" ? m.slice(0, -1) : m))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* A one-time nudge: mini-me says hi once, then never again on this browser. */}
      <AnimatePresence>
        {nudge && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="glass fixed bottom-28 right-4 z-[84] max-w-[16rem] rounded-2xl rounded-br-md p-4 text-left sm:right-6"
          >
            <button
              onClick={dismissNudge}
              aria-label="Dismiss"
              className="absolute right-2 top-2 rounded-full p-1 text-low transition-colors hover:text-hi"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                dismissNudge()
                setOpen(true)
              }}
              className="block pr-4 text-left"
            >
              <p className="text-sm font-medium leading-snug text-hi">Hi! I'm mini-{profile.first}.</p>
              <p className="mt-1 text-xs leading-relaxed text-mid">Ask me anything about his work. I'm small, but I know my stuff.</p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The launcher is mini-me himself, waving from the corner. */}
      <motion.button
        onClick={() => {
          setOpen((o) => !o)
          dismissNudge()
        }}
        onHoverStart={() => !open && react("wave", 1500)}
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.6, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        aria-label={open ? "Close the help desk" : `Ask mini-${profile.first}`}
        data-testid="button-agent-chat"
        className="glass group fixed bottom-5 right-4 z-[85] flex items-center gap-3 rounded-full p-1.5 transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98] sm:right-6 sm:pr-5"
      >
        <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-accent/25">
          {open ? <X className="h-5 w-5 text-hi" /> : <MiniMe mood={nudge ? "wave" : mood} size={56} />}
          {!open && <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-ok ring-2 ring-ink-0" aria-hidden />}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold tracking-tight text-hi">{open ? "Close" : "Ask mini-me"}</span>
          {!open && <span className="block text-[0.7rem] text-low">help desk · online</span>}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            role="dialog"
            aria-label={`Mini-${profile.first} help desk`}
            /* Near-solid ground: page text bleeding through the transcript is unreadable on a phone. */
            className="panel fixed inset-x-3 bottom-[5.75rem] z-[85] flex h-[min(36rem,calc(100dvh-8rem))] flex-col overflow-hidden !bg-ink-1/95 sm:inset-x-auto sm:right-6 sm:w-[27rem]"
          >
            <div className="flex items-center gap-3.5 border-b border-hairline/[0.07] px-5 py-4">
              <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent/20">
                <MiniMe mood={mood} size={64} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.95rem] font-semibold tracking-tight text-hi">Mini-{profile.first}</p>
                <p className="mt-0.5 text-[0.72rem] text-low">Help desk · answers from his real profile</p>
                <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ok">
                  <span className="dot-live" />{busy ? "typing" : "online"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close the help desk"
                className="ml-auto self-start rounded-full p-1.5 text-low transition-colors hover:text-hi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-accent/15 px-4 py-2.5 text-hi"
                        : "rounded-2xl rounded-bl-sm bg-hairline/[0.05] px-4 py-2.5 text-mid"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-1.5 px-1 py-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
                    />
                  ))}
                </div>
              )}

              {/* Help-desk counters before the first question. */}
              {!busy && messages.length === 1 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {TOPICS.map(({ icon: Icon, label, q }, i) => (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                      onClick={() => send(q)}
                      className="flex items-center gap-2.5 rounded-xl border border-hairline/[0.08] px-3 py-2.5 text-left text-xs text-mid transition-colors duration-300 hover:border-accent/35 hover:text-hi"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                      {label}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Follow-ups after every reply. */}
              {!busy && messages.length > 1 && suggestions.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <p className="mono-label pb-1">Or ask</p>
                  {suggestions.map((s) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => send(s)}
                      className="block w-full rounded-lg border border-hairline/[0.07] px-3.5 py-2.5 text-left text-xs text-low transition-colors duration-300 hover:border-accent/25 hover:text-mid"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {error && <p className="text-xs text-crit">{error}</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t border-hairline/[0.07] p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Say hi, or ask about ${profile.first}...`}
                disabled={busy}
                data-testid="input-agent-chat"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-hi outline-none placeholder:text-low disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-ink-0 transition-opacity disabled:opacity-25"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
