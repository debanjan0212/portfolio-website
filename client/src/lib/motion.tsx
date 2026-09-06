import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion"
import Lenis from "lenis"

/* ------------------------------------------------------------------ */
/* Reduced motion                                                      */
/* ------------------------------------------------------------------ */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                       */
/* ------------------------------------------------------------------ */

const ScrollCtx = createContext<{ scrollTo: (t: string) => void }>({
  scrollTo: (t) => document.querySelector(t)?.scrollIntoView({ behavior: "smooth" }),
})

export const useSmoothScroll = () => useContext(ScrollCtx)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    ref.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      ref.current = null
    }
  }, [reduced])

  const scrollTo = (target: string) => {
    if (ref.current) ref.current.scrollTo(target, { offset: -72, duration: 1.35 })
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
  }

  return <ScrollCtx.Provider value={{ scrollTo }}>{children}</ScrollCtx.Provider>
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 320, damping: 40, mass: 0.2 })
  return (
    <motion.div
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-accent/70"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Page-load curtain                                                   */
/* ------------------------------------------------------------------ */

export function Curtain() {
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduced ? 0 : 1250)
    return () => clearTimeout(t)
  }, [reduced])

  if (reduced) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-0"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.6, 0.01, 0, 0.9] }}
        >
          <div className="overflow-hidden">
            <motion.p
              className="mono-label"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
            >
              Debanjan Das
            </motion.p>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-accent/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Cursor glow - a soft light that trails the pointer                   */
/* ------------------------------------------------------------------ */

export function CursorGlow() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Pointer-fine only: never on touch, where there is no cursor to follow.
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return
    setEnabled(true)

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[34rem] w-[34rem] rounded-full opacity-60"
      style={{
        background:
          "radial-gradient(circle, rgb(var(--accent-glow) / 0.10) 0%, rgb(var(--accent-glow) / 0.04) 35%, transparent 68%)",
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Dark band - a self-contained dark region on an otherwise light page  */
/* ------------------------------------------------------------------ */

/**
 * Wraps the technical sections in dark. Carries its own ambient field and
 * grain, and fades at both edges so light never meets dark on a hard line.
 *
 * `.on-dark` redefines the shared tokens, so the sections inside need no
 * knowledge of which mode they are in.
 */
export function DarkBand({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y1 = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])

  return (
    <div ref={ref} className="on-dark band-top-fade band-bottom-fade relative isolate">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -left-1/4 top-0 h-[70vh] w-[80vw] rounded-full blur-[130px]"
        >
          <div
            className="h-full w-full"
            style={{
              background: "radial-gradient(circle, rgb(var(--accent) / 0.16), transparent 62%)",
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute -right-1/4 bottom-0 h-[70vh] w-[70vw] rounded-full blur-[140px]"
        >
          <div
            className="h-full w-full"
            style={{
              background: "radial-gradient(circle, rgb(120 90 220 / 0.14), transparent 62%)",
            }}
          />
        </motion.div>

        <div
          className="grid-faint absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent 100%)",
          }}
        />
        <div className="grain-layer" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Per-word text reveal                                                */
/* ------------------------------------------------------------------ */

export function RevealWords({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
  as: Tag = "span",
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: "span" | "h1" | "h2" | "h3" | "p"
}) {
  const reduced = useReducedMotion()
  const words = text.split(" ")

  if (reduced) return <Tag className={className}>{text}</Tag>

  const MotionTag = motion[Tag]

  return (
    /*
      The trigger must be this wrapper, not the words themselves. Each word
      sits in an overflow-hidden clip box and starts translated fully below
      it, so an IntersectionObserver on the word would never fire - the clip
      box means it never "enters" the viewport, and the reveal hangs forever.
      The wrapper is always visible, so it triggers reliably and cascades
      down to the words through variants.
    */
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-12%" }}
    >
      {words.map((word, i) => (
        // The word-space lives on the clip box, not inside it: a trailing
        // space within an inline-block is collapsed away by the browser.
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: i < words.length - 1 ? "0.26em" : undefined }}
        >
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "108%" }, shown: { y: 0 } }}
            transition={{
              duration: 0.85,
              delay: delay + i * stagger,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/** Generic on-scroll rise. */
export function Rise({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.75, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic button                                                     */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.28,
  className = "",
  onClick,
  href,
  ...rest
}: {
  children: ReactNode
  strength?: number
  className?: string
  onClick?: () => void
  href?: string
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = "translate(0px, 0px)"
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [strength, reduced])

  const cls = `inline-flex items-center justify-center transition-transform duration-300 ease-smooth ${className}`

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee - continuous horizontal drift                               */
/* ------------------------------------------------------------------ */

export function Marquee({
  items,
  speed = 38,
  reverse = false,
}: {
  items: string[]
  speed?: number
  reverse?: boolean
}) {
  const reduced = useReducedMotion()
  // Two copies back to back, so the loop point is invisible.
  const run = [...items, ...items]

  return (
    <div
      className="relative overflow-hidden py-3"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={reduced ? {} : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {run.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-sm text-low">
            {item}
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tilt - subtle 3D response to the pointer                            */
/* ------------------------------------------------------------------ */

export function Tilt({
  children,
  max = 5,
  className = "",
}: {
  children: ReactNode
  max?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`
    }
    const onLeave = () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)"
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [max, reduced])

  return (
    <div
      ref={ref}
      className={`transition-transform duration-500 ease-smooth ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Count up - numbers that resolve when they enter view                */
/* ------------------------------------------------------------------ */

export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    /*
      The match is computed inside the effect on purpose. It used to be a
      dependency, and since String.match returns a fresh array every render
      the effect re-ran on every render, resetting the display to zero each
      time - so the number never counted past 0.
    */
    const match = value.match(/^(~?)(\d[\d.,]*)(.*)$/)

    // Only numeric values animate; "hours → minutes" is left exactly as written.
    if (!match || reduced) {
      setShown(value)
      return
    }

    const [, prefix, digits, suffix] = match
    const target = parseFloat(digits.replace(/,/g, ""))
    const decimals = digits.includes(".") ? digits.split(".")[1].length : 0

    const el = ref.current
    if (!el) return

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1300)
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    setShown(`${prefix}0${suffix}`)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, reduced])

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  )
}
