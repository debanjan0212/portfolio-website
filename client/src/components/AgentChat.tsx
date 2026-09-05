import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { knowledgeBase, profile } from "@/data/profile"

type Message = { role: "user" | "assistant"; content: string }

const SUGGESTIONS = [
  "What is he working on right now?",
  "Tell me about his Kubernetes experience",
  "What has he done with observability?",
  "Why should we hire him as an SRE?",
]

const GREETING =
  `Hi. I'm the assistant on ${profile.name}'s site. Ask me about his experience, ` +
  `the platforms he has built, or how he works. I answer from his actual profile.`

export default function AgentChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, busy])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
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
        body: JSON.stringify({
          // Drop the canned greeting; it is UI copy, not conversation.
          messages: next.slice(1),
          knowledge: knowledgeBase(),
        }),
      })

      if (!res.ok || !res.body) {
        const detail = await res.json().catch(() => null)
        throw new Error(detail?.error || "The assistant is unavailable right now.")
      }

      setMessages((m) => [...m, { role: "assistant", content: "" }])
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
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
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close assistant" : "Ask about Debanjan"}
        data-testid="button-agent-chat"
        className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-5 py-3 text-white shadow-lg shadow-primary/25"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        <span className="hidden sm:inline text-sm font-medium">
          {open ? "Close" : "Ask about me"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            role="dialog"
            aria-label="Assistant"
            className="fixed bottom-24 right-4 sm:right-6 z-[70] flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-background/95 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Ask about {profile.name.split(" ")[0]}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Grounded in his real profile
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full rounded-lg border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                disabled={busy}
                data-testid="input-agent-chat"
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon"
                disabled={busy || !input.trim()}
                className="rounded-full"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
