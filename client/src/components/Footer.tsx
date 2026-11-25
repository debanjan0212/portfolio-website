import { profile } from "@/data/profile"
import { useVitals } from "@/lib/vitals"

declare const __BUILD__: { sha: string; date: string }

/**
 * The footer reports on the page itself: how fast it loaded for this visitor,
 * how much it weighed, and which commit is live. An SRE's site should be able
 * to show its own numbers.
 */
export default function Footer() {
  const v = useVitals()
  const built = new Date(__BUILD__.date)
  const builtText = Number.isNaN(built.getTime()) ? "" : built.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

  return (
    <footer className="foot">
      <div className="shell">
      <div className="foot-live">
        <h2>This page, measured on your device</h2>
        <dl className="foot-nums">
          <div>
            <dt>Main content shown in</dt>
            <dd>{v.lcp == null ? "measuring" : `${(v.lcp / 1000).toFixed(2)} s`}</dd>
          </div>
          <div>
            <dt>Layout shift</dt>
            <dd>{v.cls == null ? "measuring" : v.cls.toFixed(3)}</dd>
          </div>
          <div>
            <dt>Downloaded</dt>
            <dd>{v.kb == null ? "measuring" : `${Math.round(v.kb)} kB`}</dd>
          </div>
          <div>
            <dt>Build</dt>
            <dd>
              {__BUILD__.sha}
              {builtText && `, ${builtText}`}
            </dd>
          </div>
        </dl>
      </div>
      <div className="foot-row">
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {profile.name}, {profile.location}. {profile.tagline}.
        </span>
        <nav aria-label="Footer">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`${profile.github}/portfolio-website`} target="_blank" rel="noreferrer">
            Source of this site
          </a>
          <a href="/DebanjanDas-Resume.pdf" download>
            Résumé
          </a>
        </nav>
      </div>
      </div>
      {/* the last thing on the page is the name, edge to edge */}
      <p className="wordmark" aria-hidden>
        {profile.name}
      </p>
    </footer>
  )
}
