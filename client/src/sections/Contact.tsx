import { profile } from "@/data/profile"
import { useSay } from "@/lib/prefs"

/** The page ends on the ask: one line, two buttons, between two hairlines. */
export default function Contact() {
  const say = useSay()
  return (
    <section id="contact" className="sec shell" aria-labelledby="contact-title">
      <div className="close-strip">
        <div>
          <h2 id="contact-title">{say("Hiring for a senior or staff SRE?", "Hiring for senior or staff SRE, platform or AI infrastructure?")}</h2>
          <p>
            {say(
              "I am open to SRE, platform and AI-infrastructure roles, as an engineer or a lead. Remote, Bengaluru, or relocation.",
              "Open to IC and lead roles in SRE, platform, observability and AI infrastructure. Remote, Bengaluru hybrid, or international relocation.",
            )}
          </p>
        </div>
        <div className="close-actions">
          <a className="pill pill-solid" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="glass pill pill-glass" href="/DebanjanDas-Resume.pdf" download>
            Download résumé
          </a>
        </div>
      </div>
      <p className="close-links">
        {profile.email}. Also on{" "}
        <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>{" "}
        and{" "}
        <a className="link" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </p>
    </section>
  )
}
