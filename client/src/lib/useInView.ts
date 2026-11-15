import { useEffect, useRef, useState } from "react"

/** True while the element is on screen. Animations use it to stop when nobody is looking. */
export function useInView<T extends Element>(margin = "0px", threshold = 0.25) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin, threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [margin, threshold])
  return [ref, inView] as const
}
