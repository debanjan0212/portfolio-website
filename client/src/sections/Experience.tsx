import { useState } from "react"
import { roles } from "@/data/profile"
import { useSay } from "@/lib/prefs"

const TOP = 3

export default function Experience() {
  const say = useSay()
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <section id="experience" className="sec shell" aria-labelledby="experience-title">
      <div className="sec-head">
        <h2 id="experience-title" className="h2">
          {say("Where I have done this for real", "Experience")}
        </h2>
        <p className="sub">{say("Eight years, five companies, one job each time: keep it running, and make it tell you why when it does not.", "Eight years across five companies, from enterprise monitoring to the telemetry layer of an agentic AI platform.")}</p>
      </div>

      <ol className="jobs">
        {roles.map((r) => {
          const all = open[r.company]
          const points = all ? r.points : r.points.slice(0, TOP)
          const extra = r.points.length - TOP
          return (
            <li className="job" key={r.company}>
              <div>
                <p className="job-when">{r.period}</p>
                <h3 className="job-co">{r.company}</h3>
                <p className="job-title">{r.title}</p>
              </div>
              <div>
                <p className="job-plain">{say(r.plain, r.blurb)}</p>
                <ul className="job-points">
                  {points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {extra > 0 && (
                  <button className="job-more" aria-expanded={!!all} onClick={() => setOpen((o) => ({ ...o, [r.company]: !all }))}>
                    {all ? "Show fewer" : `Show ${extra} more`}
                  </button>
                )}
                <p className="job-stack">{r.stack.join(", ")}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
