/** One small mark per tool, drawn for this site so each tool is recognisable at a glance. */
type P = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
})

/** Argus: the watcher. An eye that only looks. */
export function ArgusGlyph({ size = 22 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

/** IntentOps: one aim, many places to land. */
export function IntentGlyph({ size = 22 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" />
    </svg>
  )
}

/** agent-harness-sdk: a loop with a gate in it. */
export function HarnessGlyph({ size = 22 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M20.5 12a8.5 8.5 0 1 1-3.2-6.6" />
      <path d="M17.6 2.2v3.6H14" />
      <rect x="17" y="10" width="5" height="4.6" rx="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
