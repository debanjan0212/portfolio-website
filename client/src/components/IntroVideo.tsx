import { useState } from "react"
import { Play } from "lucide-react"
import { profile } from "@/data/profile"

/**
 * The intro video, as a still photo until it is asked for. It runs edge to
 * edge, too big for the screen, with one small caption in the corner.
 *
 * The photo loads lazily: it is below the first screen at every size. The
 * video file itself (1 to 4 MB) is only fetched on click, and the click is
 * what allows it to play with sound.
 */
export default function IntroVideo({ className = "" }: { className?: string }) {
  const [src, setSrc] = useState("")

  // phones get the lighter encode; decided at the click, so server and browser render the same HTML
  const play = () => setSrc(window.innerWidth < 820 ? "/intro_portfolio_website.mobile.mp4" : "/intro_portfolio_website.web.mp4")

  return (
    <div className={`video ${className}`}>
      <img
        src="/intro-poster-1280.webp"
        srcSet="/intro-poster-720.webp 720w, /intro-poster-1280.webp 1280w, /intro-poster-1920.webp 1920w"
        sizes="100vw"
        alt={`${profile.name} at his desk`}
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
      />
      {src ? (
        <video src={src} playsInline autoPlay controls aria-label={`A short introduction from ${profile.first}`} />
      ) : (
        <button className="video-play" onClick={play}>
          <span>
            <Play size={14} fill="currentColor" aria-hidden />
          </span>
          Watch the 15-second intro
        </button>
      )}
    </div>
  )
}
