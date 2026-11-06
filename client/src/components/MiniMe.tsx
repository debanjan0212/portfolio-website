import { useEffect, useId, useState } from "react"
import { motion } from "framer-motion"

export type Mood = "idle" | "wave" | "happy" | "talk" | "think" | "calm"

/**
 * Mini-Debanjan: an illustrated, pocket-sized Debanjan for the help desk.
 * Wavy dark hair, thin gold glasses, beard, olive polo with white dots.
 * Moods: waves hello, thinks while a reply is coming, talks while it types,
 * grins at small talk and jokes, and stays still for serious replies.
 */
export default function MiniMe({ mood = "idle", size = 56, className = "" }: { mood?: Mood; size?: number; className?: string }) {
  const id = useId().replace(/:/g, "")
  const [blink, setBlink] = useState(false)

  // Blink every few seconds, at slightly random intervals so it never looks mechanical.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true)
        setTimeout(() => setBlink(false), 140)
        loop()
      }, 2600 + Math.random() * 2600)
    }
    loop()
    return () => clearTimeout(t)
  }, [])

  const happy = mood === "happy" || mood === "wave"
  const eyeRy = blink ? 0.3 : happy ? 1.7 : 2.6
  const look = mood === "think" ? { x: 1.4, y: -1.6 } : { x: 0, y: 0 }
  const brow = happy ? -1.6 : mood === "think" ? -0.8 : 0

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="Mini Debanjan">
      <defs>
        <pattern id={`dots-${id}`} width="5.5" height="5.5" patternUnits="userSpaceOnUse">
          <circle cx="2.75" cy="2.75" r="0.65" fill="#f4f1e8" opacity="0.9" />
        </pattern>
        <clipPath id={`round-${id}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>

      <g clipPath={`url(#round-${id})`}>
        <motion.g
          animate={mood === "calm" ? { y: 0 } : { y: [0, -1.2, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* shoulders: olive polo with tiny white dots */}
          <path d="M10 104 C12 82 30 73 50 73 C70 73 88 82 90 104 Z" fill="#56663a" />
          <path d="M10 104 C12 82 30 73 50 73 C70 73 88 82 90 104 Z" fill={`url(#dots-${id})`} />
          <path d="M41 73 L50 84 L59 73 L55 72 L50 78 L45 72 Z" fill="#647544" />
          <path d="M50 84 L50 100" stroke="#45532d" strokeWidth="1" />

          {/* neck and ears */}
          <path d="M43 62 L57 62 L57 76 Q50 80 43 76 Z" fill="#b5784f" />
          <ellipse cx="29.5" cy="46" rx="3.6" ry="5.4" fill="#bf8259" />
          <ellipse cx="70.5" cy="46" rx="3.6" ry="5.4" fill="#bf8259" />

          {/* face */}
          <ellipse cx="50" cy="44" rx="21" ry="24" fill="#c98d63" />

          {/* hair: volume up top, swept to one side */}
          <path d="M28 45 C24 31 28 17.5 40 12.5 C44 7.5 52 6.5 57 9 C64 8 71 11.5 73.5 18.5 C77.5 25 76.5 35 72 43 C70.5 35.5 67 30.5 61 29 C55 26 46 26.5 40 29 C34 31 30 37 28 45 Z" fill="#16110e" />
          <path d="M39.5 15 C45.5 9.5 54.5 9.5 60 13 C55 12 49 13.5 44 18 Z" fill="#33281f" />
          <path d="M58.5 11.5 C64.5 11 70 15 71.5 21.5 C67.5 17.5 63.5 15.5 58.5 15.5 Z" fill="#2b2119" />
          <path d="M29 42 L32.6 43 L32.2 52 L29.6 50 Z M71 42 L67.4 43 L67.8 52 L70.4 50 Z" fill="#16110e" />

          {/* brows */}
          <motion.g animate={{ y: brow }} transition={{ duration: 0.3 }}>
            <path d="M35.5 36.5 Q40.5 33.6 45 35.8" stroke="#16110e" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M55 35.8 Q59.5 33.6 64.5 36.5" stroke="#16110e" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </motion.g>

          {/* eyes */}
          <motion.g animate={look} transition={{ duration: 0.4 }}>
            {[40.5, 59.5].map((cx) => (
              <g key={cx}>
                <motion.ellipse cx={cx} cy="44" rx="2.3" animate={{ ry: eyeRy }} transition={{ duration: 0.09 }} fill="#1a1310" />
                {!blink && <circle cx={cx + 0.8} cy="43" r="0.6" fill="#fff" opacity="0.9" />}
              </g>
            ))}
          </motion.g>

          {/* thin gold glasses */}
          <g stroke="#7d5a28" strokeWidth="1.5" fill="rgb(255 255 255 / 0.1)">
            <rect x="33.3" y="38.6" width="14.4" height="10.8" rx="3.6" />
            <rect x="52.3" y="38.6" width="14.4" height="10.8" rx="3.6" />
            <path d="M47.7 42.6 Q50 41.2 52.3 42.6" fill="none" />
            <path d="M33.3 42 L29.5 41" fill="none" />
            <path d="M66.7 42 L70.5 41" fill="none" />
          </g>

          {/* nose */}
          <path d="M50 46 Q48.4 51.4 50.6 52.4" stroke="#9e6744" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* beard and moustache */}
          <path d="M29.5 49 C30 62 39 70.5 50 70.5 C61 70.5 70 62 70.5 49 C67.5 57.5 62.5 61 57.5 60 C54.5 63.5 45.5 63.5 42.5 60 C37.5 61 32.5 57.5 29.5 49 Z" fill="#1c1511" opacity="0.92" />
          <path d="M41.5 56 C44.5 53.4 48.8 53.8 50 55.4 C51.2 53.8 55.5 53.4 58.5 56 C55.5 57.4 52.2 57.3 50 56.6 C47.8 57.3 44.5 57.4 41.5 56 Z" fill="#16110e" />

          {/* mouth: talks while typing, grins at small talk */}
          {happy ? (
            <path d="M45 59 Q50 63.6 55 59 Q50 61 45 59 Z" fill="#f6efe6" stroke="#6b3226" strokeWidth="0.8" />
          ) : (
            <motion.ellipse
              cx="50"
              cy="59.6"
              rx="3.6"
              fill="#6b3226"
              animate={mood === "talk" ? { ry: [0.9, 2.6, 1.2, 2.2, 0.9] } : { ry: 0.9 }}
              transition={mood === "talk" ? { duration: 0.7, repeat: Infinity } : { duration: 0.2 }}
            />
          )}
        </motion.g>
      </g>

      {/* waving hand pops in beside the face */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={false}
        animate={mood === "wave" ? { opacity: 1, rotate: [0, -22, 12, -22, 12, 0], y: 0 } : { opacity: 0, rotate: 0, y: 8 }}
        transition={{ duration: mood === "wave" ? 1.4 : 0.3 }}
      >
        <rect x="78" y="62" width="7" height="16" rx="3.5" fill="#56663a" />
        <circle cx="81.5" cy="58" r="6" fill="#c98d63" />
        <path d="M77.5 53 L77.5 49.5 M80.5 52 L80.5 48 M83.5 52 L83.5 48.5 M86 54 L87.5 51.5" stroke="#c98d63" strokeWidth="2.4" strokeLinecap="round" />
      </motion.g>

      {/* thinking dots */}
      {mood === "think" &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={78 + i * 7}
            cy={20 - i * 6}
            r={2 + i * 0.6}
            fill="rgb(var(--accent))"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
    </svg>
  )
}
