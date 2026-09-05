import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import Lenis from "lenis"

type SmoothScrollValue = {
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: (target) => {
    if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
    }
  },
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

/**
 * Wraps the app in a Lenis-driven smooth scroll. Respects
 * prefers-reduced-motion by never instantiating Lenis at all, so users who
 * asked the OS for less motion keep native scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis
    setReady(true)

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = (target: string | number | HTMLElement, offset = -80) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 })
      return
    }
    if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: target, behavior: "smooth" })
    }
  }

  // `ready` is only read to keep the provider value stable after init.
  void ready

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

/** Thin progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary to-purple-600 origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  )
}
