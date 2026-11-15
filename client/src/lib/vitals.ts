import { useEffect, useState } from "react"

/**
 * How this page actually performed for this visitor, measured in their own
 * browser. An SRE's site should be able to show its own numbers.
 */
export type Vitals = { lcp: number | null; cls: number | null; kb: number | null }

export function useVitals(): Vitals {
  const [v, setV] = useState<Vitals>({ lcp: null, cls: null, kb: null })

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return
    const observers: PerformanceObserver[] = []
    let cls = 0

    const watch = (type: string, onEntries: (entries: PerformanceEntry[]) => void) => {
      try {
        const po = new PerformanceObserver((list) => onEntries(list.getEntries()))
        po.observe({ type, buffered: true })
        observers.push(po)
        return po
      } catch {
        /* this browser does not report that metric */
        return null
      }
    }

    const lcp = watch("largest-contentful-paint", (entries) => {
      const last = entries[entries.length - 1]
      if (last) setV((p) => ({ ...p, lcp: last.startTime }))
    })
    // The metric is final at the first interaction: anything painted after that is the visitor's doing, not the load.
    const freeze = () => {
      lcp?.disconnect()
      stops.forEach((e) => window.removeEventListener(e, freeze, true))
    }
    const stops = ["keydown", "pointerdown", "wheel", "touchstart", "scroll"]
    stops.forEach((e) => window.addEventListener(e, freeze, { capture: true, passive: true, once: true }))
    watch("layout-shift", (entries) => {
      for (const e of entries as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (!e.hadRecentInput) cls += e.value
      }
      setV((p) => ({ ...p, cls }))
    })

    const weigh = () => {
      const nav = performance.getEntriesByType("navigation") as PerformanceResourceTiming[]
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      const bytes = [...nav, ...res].reduce((sum, e) => sum + (e.transferSize || 0), 0)
      if (bytes > 0) setV((p) => ({ ...p, kb: bytes / 1024, cls: p.cls ?? cls }))
    }
    const t = window.setTimeout(weigh, 2500)

    return () => {
      window.clearTimeout(t)
      freeze()
      observers.forEach((o) => o.disconnect())
    }
  }, [])

  return v
}
