import { profile } from "@/data/profile"
import { useSay } from "@/lib/prefs"
import IntroVideo from "@/components/IntroVideo"

/**
 * One sentence with room around it, then the intro photo edge to edge.
 * The sentence is the whole pitch; everything below it is the evidence.
 */
export default function Intro() {
  const say = useSay()
  return (
    <section className="intro" aria-label="What I do, in one sentence">
      <p className="thesis shell">
        <span>{say(profile.summary.simple, profile.summary.technical)}</span>
      </p>
      <IntroVideo className="film" />
    </section>
  )
}
