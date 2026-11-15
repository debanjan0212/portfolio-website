import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Plays a list of timed beats in order. `gate` beats stop and wait for
 * `advance()`, which is how the approval step waits for a real person.
 *
 * With reduced motion the replay jumps to the end and nothing auto-plays:
 * the visitor still sees the whole run, just without the movement.
 */
export type Beat = { ms: number; gate?: boolean }

export function useReplay(beats: Beat[], opts: { active: boolean; reduced: boolean; key?: string }) {
  const { active, reduced, key = "" } = opts
  const last = beats.length - 1
  const [at, setAt] = useState(reduced ? last : -1)
  const [paused, setPaused] = useState(false)
  const started = useRef(false)

  // a new run (different scenario or tab) starts from the top
  useEffect(() => {
    started.current = false
    setAt(reduced ? firstGateOrEnd(beats) : -1)
    setPaused(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduced])

  // start once, the first time the screen is actually visible
  useEffect(() => {
    if (!active || started.current || reduced) return
    started.current = true
    setAt(0)
  }, [active, reduced, key])

  useEffect(() => {
    if (at < 0 || at >= last || paused || reduced || !active) return
    if (beats[at].gate) return
    const t = window.setTimeout(() => setAt((i) => Math.min(last, i + 1)), beats[at].ms)
    return () => window.clearTimeout(t)
  }, [at, paused, reduced, active, beats, last])

  const advance = useCallback(() => setAt((i) => (reduced ? last : Math.min(last, i + 1))), [last, reduced])
  const restart = useCallback(() => {
    setPaused(false)
    setAt(reduced ? firstGateOrEnd(beats) : 0)
  }, [reduced, beats])

  return {
    at,
    done: at >= last,
    waiting: at >= 0 && at < last && !!beats[at]?.gate,
    paused,
    toggle: () => setPaused((p) => !p),
    advance,
    restart,
    progress: last <= 0 ? 1 : Math.max(0, at) / last,
  }
}

function firstGateOrEnd(beats: Beat[]) {
  const gate = beats.findIndex((b) => b.gate)
  return gate >= 0 ? gate : beats.length - 1
}
