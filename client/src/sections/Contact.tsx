import { looking, profile } from "@/data/profile"

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "/in/debanjan0212", href: profile.linkedin },
  { label: "GitHub", value: "@debanjan0212", href: profile.github },
]

export default function Contact() {
  return (
    <section id="contact" className="sec shell contact" aria-labelledby="contact-title">
      <h2 id="contact-title">
        Let's talk about
        <br />
        <span className="text-mid">what you're running.</span>
      </h2>
      <a className="pill pill-solid contact-mail" href={`mailto:${profile.email}`}>
        <span>{profile.email}</span>
      </a>

      <div className="contact-grid">
        <div>
          <h3>Elsewhere</h3>
          <div className="contact-links">
            {links.map((l) => (
              <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <span>{l.label}</span>
                <span>{l.value}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3>Open to</h3>
          <ul className="contact-open">
            {looking.roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="fine">{looking.location.join(". ")}.</p>
        </div>
      </div>
    </section>
  )
}
