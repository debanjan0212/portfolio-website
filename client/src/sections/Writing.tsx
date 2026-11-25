import { notePath, notes } from "@/data/notes"
import { longDate } from "@/pages/Note"

/** Write-ups from the tools above, including where they fall short. */
export default function Writing() {
  return (
    <section id="writing" className="sec shell" aria-labelledby="writing-title">
      <div className="sec-head">
        <h2 id="writing-title" className="h2">
          Write-ups
        </h2>
      </div>

      <ul className="posts">
        {notes.map((n) => (
          <li key={n.slug}>
            <a className="post" href={notePath(n)}>
              <span className="post-title">{n.title}</span>
              <span className="post-sum">{n.teaser}</span>
              <span className="post-kind">
                {n.kind}, <time dateTime={n.date}>{longDate(n.date, "short")}</time>. {n.minutes} min read.
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
