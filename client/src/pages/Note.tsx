import type { Block, Note as NoteData } from "@/data/notes"
import { notePath, notes } from "@/data/notes"
import { profile } from "@/data/profile"
import Nav from "@/components/Nav"
import Rich from "@/components/Rich"

/** "2026-11-21" to "21 November 2026" (or "21 Nov 2026"), the same on the server and in every time zone. */
export function longDate(iso: string, month: "long" | "short" = "long"): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric", timeZone: "UTC" })
}

function Piece({ b }: { b: Block }) {
  switch (b.t) {
    case "h":
      return <h2>{b.text}</h2>
    case "p":
      return (
        <p>
          <Rich text={b.text} />
        </p>
      )
    case "ul":
      return (
        <ul>
          {b.items.map((x) => (
            <li key={x}>
              <Rich text={x} />
            </li>
          ))}
        </ul>
      )
    case "code":
      return (
        <figure className="note-code">
          <figcaption>{b.label}</figcaption>
          <pre className="well term">
            <code>{b.text}</code>
          </pre>
        </figure>
      )
    case "aside":
      return (
        <p className="note-aside">
          <Rich text={b.text} />
        </p>
      )
    case "table": {
      const headed = b.head.some(Boolean)
      return (
        <div className="note-table">
          <table>
            {headed && (
              <thead>
                <tr>
                  {b.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((r) => (
                <tr key={r.join("|")}>
                  {r.map((c, i) =>
                    !headed && i === 0 ? (
                      <th key={i} scope="row">
                        <Rich text={c} />
                      </th>
                    ) : (
                      <td key={i}>
                        <Rich text={c} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }
}

/** One write-up, as a plain reading page: no replays, no chat, nothing moving. */
export default function Note({ note }: { note: NoteData }) {
  const others = notes.filter((n) => n.slug !== note.slug)

  return (
    <div className="site">
      <Nav home={false} />
      <main className="shell note">
        <article>
          <header className="note-head">
            <h1>{note.title}</h1>
            <p className="note-sum">{note.summary}</p>
            <p className="note-by">
              {note.kind} by <a href="/">{profile.name}</a>, <time dateTime={note.date}>{longDate(note.date)}</time>. {note.minutes} minute read.
            </p>
          </header>
          <div className="note-body">
            {note.blocks.map((b, i) => (
              <Piece key={i} b={b} />
            ))}
          </div>
        </article>

        <footer className="note-foot">
          <a className="glass pill pill-glass" href={note.repo.url} target="_blank" rel="noreferrer">
            {note.repo.label} on GitHub
          </a>
          {others.map((n) => (
            <a key={n.slug} className="note-next" href={notePath(n)}>
              <span>Read next</span>
              {n.title}
            </a>
          ))}
          <a className="note-back" href="/">
            Back to the portfolio
          </a>
        </footer>
      </main>
    </div>
  )
}
