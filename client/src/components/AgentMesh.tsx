import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/motion"

/**
 * Hand-drawn animated illustration: a friendly agent at the centre of a
 * service mesh, with telemetry packets flowing back to it along the edges.
 * All original SVG - no external art, and it scales to any size.
 */

const nodes = [
  { id: "api", label: "api", x: 50, y: 22 },
  { id: "kafka", label: "kafka", x: 82, y: 48 },
  { id: "db", label: "db", x: 68, y: 82 },
  { id: "svc", label: "svc", x: 32, y: 82 },
  { id: "otel", label: "otel", x: 18, y: 48 },
]

const CENTRE = { x: 50, y: 52 }

export default function AgentMesh({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative ${className}`} aria-hidden>
      <motion.svg
        viewBox="0 0 100 100"
        className="h-full w-full overflow-visible"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.9, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <defs>
          <radialGradient id="mesh-core" cx="50%" cy="40%">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.30" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mesh-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Halo behind the agent */}
        <circle cx={CENTRE.x} cy={CENTRE.y} r="34" fill="url(#mesh-core)" />

        {/* Edges + travelling telemetry packets */}
        {nodes.map((n, i) => {
          const d = `M ${n.x} ${n.y} Q ${(n.x + CENTRE.x) / 2 + (i % 2 ? 6 : -6)} ${
            (n.y + CENTRE.y) / 2
          } ${CENTRE.x} ${CENTRE.y}`
          return (
            <g key={n.id}>
              <path d={d} fill="none" stroke="url(#mesh-edge)" strokeWidth="0.4" />
              {!reduced && (
                <circle r="1.05" fill="rgb(var(--accent))">
                  <animateMotion
                    dur={`${2.6 + i * 0.45}s`}
                    repeatCount="indefinite"
                    path={d}
                    begin={`${i * 0.55}s`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur={`${2.6 + i * 0.45}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.55}s`}
                  />
                </circle>
              )}
            </g>
          )
        })}

        {/* Service nodes */}
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 + i * 0.1, duration: 0.6 }}
          >
            <motion.g
              animate={reduced ? {} : { y: [0, -1.6, 0] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x={n.x - 6.5}
                y={n.y - 4}
                width="13"
                height="8"
                rx="2.4"
                fill="rgb(var(--ink-2))"
                stroke="rgb(var(--hairline) / 0.16)"
                strokeWidth="0.35"
              />
              <text
                x={n.x}
                y={n.y + 1.3}
                textAnchor="middle"
                fill="rgb(var(--text-mid))"
                style={{ fontSize: 3.1, fontFamily: "var(--font-mono)" }}
              >
                {n.label}
              </text>
            </motion.g>
          </motion.g>
        ))}

        {/* The agent itself - a small, friendly machine, floating */}
        <motion.g
          animate={reduced ? {} : { y: [0, -2.2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* antenna */}
          <line
            x1={CENTRE.x}
            y1={CENTRE.y - 11}
            x2={CENTRE.x}
            y2={CENTRE.y - 15}
            stroke="rgb(var(--accent))"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <motion.circle
            cx={CENTRE.x}
            cy={CENTRE.y - 15.8}
            r="1.5"
            fill="rgb(var(--accent))"
            animate={reduced ? {} : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* head */}
          <rect
            x={CENTRE.x - 13}
            y={CENTRE.y - 11}
            width="26"
            height="21"
            rx="6.5"
            fill="rgb(var(--ink-1))"
            stroke="rgb(var(--accent) / 0.45)"
            strokeWidth="0.6"
          />

          {/* visor */}
          <rect
            x={CENTRE.x - 9.5}
            y={CENTRE.y - 7}
            width="19"
            height="9.5"
            rx="4"
            fill="rgb(var(--ink-0))"
            stroke="rgb(var(--hairline) / 0.10)"
            strokeWidth="0.3"
          />

          {/* eyes - blink on a loop */}
          {[-4.4, 4.4].map((dx) => (
            <motion.rect
              key={dx}
              x={CENTRE.x + dx - 1.5}
              y={CENTRE.y - 4.4}
              width="3"
              height="4.2"
              rx="1.5"
              fill="rgb(var(--accent))"
              animate={reduced ? {} : { scaleY: [1, 1, 0.12, 1, 1] }}
              transition={{
                duration: 5,
                times: [0, 0.72, 0.76, 0.8, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${CENTRE.x + dx}px ${CENTRE.y - 2.3}px` }}
            />
          ))}

          {/* status bar under the visor */}
          <rect
            x={CENTRE.x - 7}
            y={CENTRE.y + 5}
            width="14"
            height="1.6"
            rx="0.8"
            fill="rgb(var(--hairline) / 0.10)"
          />
          {/* Animate width only. `x` on a motion element is a transform, not
              the SVG attribute, so animating it detaches the bar from the
              robot entirely. */}
          <motion.rect
            x={CENTRE.x - 7}
            y={CENTRE.y + 5}
            height="1.6"
            rx="0.8"
            fill="rgb(var(--ok))"
            initial={{ width: 2 }}
            animate={reduced ? { width: 14 } : { width: [2, 14, 2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      </motion.svg>
    </div>
  )
}
