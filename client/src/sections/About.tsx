import { useRef, useState } from "react"
import { ArrowUpRight, BadgeCheck, GraduationCap, Play } from "lucide-react"
import { certifications, education, profile } from "@/data/profile"
import { useSay } from "@/lib/prefs"

function Intro() {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  // phones get the lighter encode; picked once
  const [src] = useState(() => (typeof window !== "undefined" && window.innerWidth < 820 ? "/intro_portfolio_website.mobile.mp4" : "/intro_portfolio_website.web.mp4"))

  const play = () => {
    // nothing is downloaded or played until it is asked for
    setStarted(true)
  }

  return (
    <div className="video">
      {/* the poster is a lazy image, so the photo is only fetched when this section is near the screen */}
      <img src="/intro-poster.webp" alt={`${profile.name} at his desk`} width={1280} height={720} loading="lazy" decoding="async" />
      {started && <video ref={ref} src={src} playsInline autoPlay controls aria-label={`A short introduction from ${profile.first}`} />}
      {!started && (
        <button className="video-play" onClick={play}>
          <span>
            <Play size={15} fill="currentColor" aria-hidden />
          </span>
          Watch the 15-second intro
        </button>
      )}
    </div>
  )
}

export default function About() {
  const say = useSay()

  return (
    <section id="about" className="sec shell" aria-labelledby="about-title">
      <div className="about">
        <Intro />
        <div className="about-text">
          <h2 id="about-title" className="h2">
            {say("The person behind it", "About")}
          </h2>
          <p style={{ marginTop: "1.1rem" }}>
            {say(
              "Most of my work comes down to one question: when something breaks at 3am, can the system tell you why? I like the unglamorous half of the job too, like deleting the manual health check somebody has run every morning for two years.",
              "Most of my work comes down to one thing: when something breaks at 3am, can the system tell you why. Agents make decisions you did not write, so the only way to trust one in production is to see exactly what it saw and why it acted.",
            )}
          </p>

          <div className="creds">
            {certifications.map((c) => (
              <div className="glass cred" key={c.name}>
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
                        Verify this credential <ArrowUpRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden />
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="glass cred">
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
        </div>
      </div>
    </section>
  )
}
