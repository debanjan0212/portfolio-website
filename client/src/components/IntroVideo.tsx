import { useState } from "react"
import { Play } from "lucide-react"
import { profile } from "@/data/profile"

/**
 * The intro video, as a still photo until it is asked for.
 *
 * The photo is the largest thing on the first screen, so it is loaded early
 * and in two sizes. The video file itself (1 to 4 MB) is only fetched on click,
 * and the click is what allows it to play with sound.
 */
export default function IntroVideo({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const [src, setSrc] = useState("")

  // phones get the lighter encode; decided at the click, so server and browser render the same HTML
  const play = () => setSrc(window.innerWidth < 820 ? "/intro_portfolio_website.mobile.mp4" : "/intro_portfolio_website.web.mp4")

  return (
    <div className={`video ${className}`} style={style}>
      <img
        src="/intro-poster-1280.webp"
        srcSet="/intro-poster-720.webp 720w, /intro-poster-1280.webp 1280w"
        sizes="(min-width: 940px) 34rem, 100vw"
        alt={`${profile.name} at his desk`}
        width={1280}
        height={720}
        decoding="async"
        {...{ fetchpriority: "high" }}
      />
      {src ? (
        <video src={src} playsInline autoPlay controls aria-label={`A short introduction from ${profile.first}`} />
      ) : (
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
