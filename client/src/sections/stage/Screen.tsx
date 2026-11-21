import type { ReactNode } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"

/** The frame every replay plays in: the real command on top, the story in the middle, the facts underneath. */
export default function Screen({
  command,
  step,
  steps,
  say,
  progress,
  done,
  paused,
  onToggle,
  onReplay,
  foot,
  children,
}: {
  command: string
  step: number
  steps: number
  say: string
  progress: number
  done: boolean
  paused: boolean
  onToggle: () => void
  onReplay: () => void
  foot: ReactNode
  children: ReactNode
}) {
  return (
    <div className="panel screen">
      <div className="screen-bar">
        <code className="screen-cmd" title={command}>
          <b>$</b> {command}
        </code>
        {done ? (
          <button className="screen-btn" onClick={onReplay}>
            <RotateCcw size={14} aria-hidden /> Replay
          </button>
        ) : (
          <button className="screen-btn" onClick={onToggle} aria-label={paused ? "Play" : "Pause"}>
            {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />} {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
      <div className="screen-progress" aria-hidden>
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="screen-body">
        <div className="screen-say" aria-live="polite">
          <span className="screen-step">
            {Math.min(step, steps)} of {steps}
          </span>
          <p>{say}</p>
        </div>
        {children}
      </div>
      <div className="screen-foot">{foot}</div>
    </div>
  )
}
