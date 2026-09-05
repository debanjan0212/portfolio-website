import { ArrowUpRight } from "lucide-react"
import { profile, looking } from "@/data/profile"
import { Magnetic, RevealWords, Rise } from "@/lib/motion"

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "/in/debanjan0212", href: profile.linkedin },
  { label: "GitHub", value: "@debanjan0212", href: profile.github },
]

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-shell">
        <p className="mono-label">Contact</p>

        <h2 className="display mt-6 text-[clamp(2.25rem,7vw,5.5rem)]">
          <RevealWords text="Let's talk about" />
          <br />
          <span className="text-mid">
            <RevealWords text="what you're running." delay={0.1} />
          </span>
        </h2>

        <Rise delay={0.15}>
          <p className="lede mt-9 max-w-xl text-lg">
            Open to SRE, platform and observability roles — IC or lead — and
            especially anything where the thing being made reliable is an AI
            system itself.
          </p>
        </Rise>

        <Rise delay={0.2} className="mt-12">
          <Magnetic
            href={`mailto:${profile.email}`}
            className="group gap-3 rounded-full bg-accent px-8 py-4 text-sm font-medium text-ink-0"
          >
            {profile.email}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Magnetic>
        </Rise>

        <div className="mt-24 grid gap-12 md:grid-cols-2">
          <Rise delay={0.1}>
            <p className="mono-label">Elsewhere</p>
            <div className="mt-6 space-y-px">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between border-t border-hairline/[0.08] py-4 last:border-b"
                >
                  <span className="text-sm text-low">{l.label}</span>
                  <span className="flex items-center gap-2 text-sm text-mid transition-colors group-hover:text-accent">
                    {l.value}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                  </span>
                </a>
              ))}
            </div>
          </Rise>

          <Rise delay={0.16}>
            <p className="mono-label">Open to</p>
            <ul className="mt-6 space-y-3">
              {looking.roles.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-mid">
                  <span className="mt-[0.55rem] h-px w-3 shrink-0 bg-accent/50" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm text-low">{looking.location.join(" · ")}</p>
          </Rise>
        </div>
      </div>
    </section>
  )
}
