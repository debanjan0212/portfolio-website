import { useState } from "react"
import { BadgeCheck, GraduationCap } from "lucide-react"
import { certifications, education, roles } from "@/data/profile"
import { useSay } from "@/lib/prefs"


export default function Experience() {
  const say = useSay()
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <section id="experience" className="sec shell" aria-labelledby="experience-title">
      <div className="sec-head">
        <h2 id="experience-title" className="h2">
          {say("Where I have done this", "Experience")}
        </h2>
        <p className="sub">
          {say(
            "Eight years, five companies. Each time: keep it running, and make it say why when it does not.",
            "Eight years across five companies, from enterprise monitoring to the telemetry layer of an agentic AI platform.",
          )}
        </p>
      </div>

      <ol className="jobs">
        {roles.map((r) => {
          // one plain line per job; the detail is one tap away, so the list reads in seconds
          const all = !!open[r.company]
          return (
            <li className="job" key={r.company}>
              <div>
                <p className="job-when">{r.period}</p>
                <h3 className="job-co">{r.company}</h3>
                <p className="job-title">{r.title}</p>
              </div>
              <div>
                <p className="job-plain">{say(r.plain, r.blurb)}</p>
                {all && (
                  <>
                    <ul className="job-points">
                      {r.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <p className="job-stack">{r.stack.join(", ")}</p>
                  </>
                )}
                <button className="job-more" aria-expanded={all} onClick={() => setOpen((o) => ({ ...o, [r.company]: !all }))}>
                  {all ? "Show less" : `Show ${r.points.length} points`}
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <div id="credentials" className="creds">
        {certifications.map((c) => (
          <div className="cred" key={c.name}>
            <span className="cred-badge">
              <BadgeCheck size={22} aria-hidden />
            </span>
            <div>
              <h3>{c.name}</h3>
              <small>
                {c.issuer}, {c.date}
              </small>
              <p>{c.shows}</p>
              {c.verifyUrl && (
                <p>
                  <a className="link" href={c.verifyUrl} target="_blank" rel="noreferrer">
                    Verify this credential
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
        <div className="cred">
          <span className="cred-badge">
            <GraduationCap size={22} aria-hidden />
          </span>
          <div>
            <h3>{education.degree}</h3>
            <small>
              {education.school}, {education.period}
            </small>
            <p>{education.detail}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
