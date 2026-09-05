import { useEffect, useState } from "react"

type Loaded = {
  question: string
  context: string[]
  status: string
  answer: string
  askedAt: string
}

/**
 * The page the nightly digest links to. The token in the URL is the whole
 * credential, so there is no login to build or maintain.
 */
export default function Answer() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id") || ""
  const token = params.get("token") || ""
  const query = `id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`

  const [data, setData] = useState<Loaded | null>(null)
  const [text, setText] = useState("")
  const [state, setState] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/answer?${query}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "Link not valid.")
        return r.json()
      })
      .then((d: Loaded) => {
        setData(d)
        setText(d.answer || "")
        setState(d.status === "answered" ? "saved" : "ready")
      })
      .catch((e) => {
        setError(e.message)
        setState("error")
      })
  }, [query])

  async function save() {
    setState("saving")
    setError("")
    try {
      const r = await fetch(`/api/answer?${query}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answer: text }),
      })
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "Could not save.")
      setState("saved")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.")
      setState("ready")
    }
  }

  return (
    <div className="relative z-10 mx-auto min-h-screen w-full max-w-2xl px-6 py-20">
      <p className="mono-label">Answer a question</p>

      {state === "loading" && <p className="mt-8 text-mid">Loading…</p>}

      {state === "error" && (
        <div className="panel mt-8 p-6">
          <p className="text-crit">{error}</p>
          <p className="mt-3 text-sm text-low">
            Links stop working once a question has been answered.
          </p>
        </div>
      )}

      {data && state !== "error" && (
        <>
          <h1 className="display mt-6 text-3xl md:text-4xl">{data.question}</h1>

          {data.context.length > 0 && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-low hover:text-mid">
                Show the conversation this came from
              </summary>
              <div className="panel mt-3 space-y-2 p-4">
                {data.context.map((c, i) => (
                  <p key={i} className="font-mono text-xs leading-relaxed text-low">
                    {c}
                  </p>
                ))}
              </div>
            </details>
          )}

          {state === "saved" ? (
            <div className="panel mt-8 p-6">
              <p className="text-hi">Saved.</p>
              <p className="mt-2 text-sm leading-relaxed text-mid">
                The assistant is using this from right now — no rebuild, no redeploy.
                Ask it the same thing on the site and it will answer in your words.
              </p>
              <p className="mt-4 whitespace-pre-wrap border-l border-accent/40 pl-4 text-sm text-low">
                {text}
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={9}
                autoFocus
                placeholder="Answer in your own words. This is what visitors will be told."
                className="panel mt-8 w-full resize-y bg-transparent p-5 text-base leading-relaxed text-hi outline-none placeholder:text-low focus:border-accent/40"
              />
              {error && <p className="mt-3 text-sm text-crit">{error}</p>}
              <button
                onClick={save}
                disabled={state === "saving" || text.trim().length < 2}
                className="mt-5 rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink-0 disabled:opacity-30"
              >
                {state === "saving" ? "Saving…" : "Save answer"}
              </button>
              <p className="mt-4 text-xs text-low">
                Write it the way you would say it out loud. The assistant repeats your
                wording rather than paraphrasing it.
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
}
