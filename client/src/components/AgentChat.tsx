import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle, X } from "lucide-react"
import { knowledgeBase, profile } from "@/data/profile"

type Message = { role: "user" | "assistant"; content: string }

/** Shown before the first question. After that the server suggests. */
const OPENERS = [
  "What is he building right now?",
  "How deep is his OpenTelemetry experience?",
  "What kind of role is he looking for?",
  "What's the largest migration he has run?",
  "Did he build the AI agents themselves?",
  "What has he done with cost optimisation?",
]

const GREETING = `Ask me anything about ${profile.first}'s work. I answer from his actual profile — nothing invented.`

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
          "The assistant endpoint isn't running. Start it with `netlify dev`, or set ANTHROPIC_API_KEY and restart.",
        )
      }

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setMessages((m) => (m[m.length - 1]?.content === "" ? m.slice(0, -1) : m))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* A one-time nudge. Most visitors never notice a chat launcher, and an
          assistant nobody opens is worth nothing - so it introduces itself
          once, then never again on this browser. */}
      <AnimatePresence>
        {nudge && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-40 right-4 z-[84] max-w-[17rem] rounded-2xl rounded-br-md border border-accent/25 bg-ink-1 p-4 text-left shadow-2xl shadow-black/40 sm:bottom-28 sm:right-6"
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
              <p className="text-sm leading-snug text-hi">
                Ask me anything about {profile.first}'s work
              </p>
              <p className="mt-1 text-xs text-low">
                I answer from his real profile — try me
              </p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        The launcher has to survive being ignored. A small circle in a corner
        is furniture; a labelled pill with a live dot and a halo reads as
        something running, which is the point of the whole feature.
      */}
      <motion.button
        onClick={() => {
          setOpen((o) => !o)
          dismissNudge()
        }}
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.6, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        aria-label={open ? "Close assistant" : "Ask about Debanjan"}
        data-testid="button-agent-chat"
        className="group fixed bottom-6 right-4 z-[85] flex items-center gap-3 rounded-full bg-accent px-6 py-4 text-ink-0 shadow-[0_10px_40px_-10px_rgb(var(--accent)/0.7)] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98] sm:right-6"
      >
        {!open && (
          <>
            {/* Two rings, offset, so the halo never fully closes. */}
            {[0, 1.3].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-accent"
                animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay }}
              />
            ))}
          </>
        )}
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-5 w-5" />}
        <span className="text-[0.95rem] font-semibold tracking-tight">
          {open ? "Close" : "Ask about me"}
        </span>
        {!open && (
          <motion.span
            aria-hidden
            className="h-2 w-2 rounded-full bg-ink-0/80"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            role="dialog"
            aria-label="Assistant"
            /* Solid ground. The translucent .panel surface let page text bleed
               through the transcript - unreadable on a small screen. */
            className="panel fixed inset-x-4 bottom-28 z-[85] flex h-[min(34rem,calc(100dvh-9rem))] flex-col overflow-hidden !bg-ink-1 shadow-2xl shadow-black/60 sm:inset-x-auto sm:bottom-28 sm:right-6 sm:w-[26rem]"
          >
            <div className="flex items-center gap-3 border-b border-hairline/[0.07] px-5 py-4">
              <span className="dot-live" />
              <div>
                <p className="font-mono text-xs text-hi">ask about {profile.first.toLowerCase()}</p>
                <p className="mt-0.5 text-[0.7rem] text-low">grounded in his real profile</p>
              </div>
            </div>

            <div ref={scrollRef} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-accent/12 px-4 py-2.5 text-hi"
                        : "text-mid"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1 w-1 rounded-full bg-accent"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
                    />
                  ))}
                </div>
              )}

              {/* Offered after every reply, not just the first. */}
              {!busy && suggestions.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {messages.length > 1 && (
                    <p className="mono-label pb-1">Or ask</p>
                  )}
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
                placeholder="Ask something..."
                disabled={busy}
                data-testid="input-agent-chat"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-hi outline-none placeholder:text-low disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-ink-0 transition-opacity disabled:opacity-25"
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
