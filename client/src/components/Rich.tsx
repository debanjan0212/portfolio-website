import { Fragment } from "react"

/**
 * Inline marks for the write-ups: `code`, **strong** and [label](url).
 * Built as React elements, so no text is ever inserted as raw HTML.
 */
export default function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`") && p.length > 2) return <code key={i}>{p.slice(1, -1)}</code>
        if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p)
        if (m) {
          const outside = m[2].startsWith("http")
          return (
            <a key={i} className="link" href={m[2]} target={outside ? "_blank" : undefined} rel={outside ? "noreferrer" : undefined}>
              {m[1]}
            </a>
          )
        }
        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}
