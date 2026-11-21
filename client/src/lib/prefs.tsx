import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

/**
 * Things the page works out about the visitor instead of asking:
 *   theme   - follows the device's light/dark setting until the visitor picks one
 *   motion  - follows the device's "reduce motion" setting, always
 *   voice   - plain words by default; engineers can switch to the technical wording
 */

export type Theme = "dark" | "light"
export type Voice = "simple" | "technical"

type Prefs = {
  theme: Theme
  toggleTheme: () => void
  voice: Voice
  setVoice: (v: Voice) => void
  reduced: boolean
}

const Ctx = createContext<Prefs>({
  theme: "dark",
  toggleTheme: () => {},
  voice: "simple",
  setVoice: () => {},
  reduced: false,
})

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode: the choice lasts for this visit only */
  }
}

function useMedia(query: string) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const f = () => setOn(mq.matches)
    f()
    mq.addEventListener("change", f)
    return () => mq.removeEventListener("change", f)
  }, [query])
  return on
}

/*
  The page is prerendered to HTML at build time, so the first render in the
  browser has to match it exactly: dark theme, plain words. The device and any
  saved choice are read straight after, in an effect. The theme itself never
  flashes, because public/boot.js sets it on <html> before the first paint.
*/
export function PrefsProvider({ children }: { children: ReactNode }) {
  const systemLight = useMedia("(prefers-color-scheme: light)")
  const reduced = useMedia("(prefers-reduced-motion: reduce)")

  const [ready, setReady] = useState(false)
  const [picked, setPicked] = useState<Theme | null>(null)
  const [voice, setVoiceState] = useState<Voice>("simple")

  useEffect(() => {
    const saved = read("portfolio-theme")
    if (saved === "light" || saved === "dark") setPicked(saved)
    if (read("portfolio-voice") === "technical") setVoiceState("technical")
    setReady(true)
  }, [])

  const theme: Theme = picked ?? (systemLight ? "light" : "dark")

  useEffect(() => {
    if (!ready) return
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#ffffff" : "#050507")
  }, [theme, ready])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setPicked(next)
    write("portfolio-theme", next)
  }, [theme])

  const setVoice = useCallback((v: Voice) => {
    setVoiceState(v)
    write("portfolio-voice", v)
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme, voice, setVoice, reduced }), [theme, toggleTheme, voice, setVoice, reduced])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePrefs = () => useContext(Ctx)

/** Pick the wording for the current voice. */
export function useSay() {
  const { voice } = usePrefs()
  return useCallback((simple: string, technical: string) => (voice === "simple" ? simple : technical), [voice])
}

/** The Simple / Technical switch. */
export function VoiceSwitch({ className = "" }: { className?: string }) {
  const { voice, setVoice } = usePrefs()
  return (
    <div className={`voice ${className}`} role="group" aria-label="How should this page explain things?">
      {(["simple", "technical"] as const).map((v) => (
        <button key={v} type="button" aria-pressed={voice === v} onClick={() => setVoice(v)}>
          {v === "simple" ? "Plain words" : "Technical"}
        </button>
      ))}
    </div>
  )
}
