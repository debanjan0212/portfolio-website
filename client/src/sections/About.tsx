import portrait from "@/assets/portrait-cutout.webp"
import { profile, education, languages } from "@/data/profile"
import { RevealWords, Rise } from "@/lib/motion"
import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-shell items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
        {/* Portrait, treated to sit in the dark rather than on top of it:
            desaturated, accent-tinted, and masked away at the bottom edge. */}
        <div className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            {/*
              No frame. A boxed photo on a dark canvas always reads as pasted
              on; a cut-out standing in the light behind it reads as part of
              the scene. The glow sits behind the figure, the floor fade
              dissolves the bottom edge, so there is no rectangle anywhere.
            */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[12%] h-[70%] w-[85%] -translate-x-1/2 rounded-full blur-[70px]"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--accent) / 0.13), transparent 68%)",
              }}
            />

            {/*
              No parallax on the figure. Moving the image inside its own frame
              slid the head out of the top and made the floor fade travel
              across the body as you scrolled. The column is sticky instead:
              the portrait holds still and the text moves past it.
            */}
            <img
              src={portrait}
              alt={profile.name}
              className="relative w-full select-none object-contain contrast-[1.02] saturate-[0.92]"
              draggable={false}
            />

            {/* Dissolve the bottom edge into the canvas. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgb(var(--ink-0) / 0.9) 62%, rgb(var(--ink-0)))",
              }}
            />
          </motion.div>

          <Rise delay={0.2} className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {languages.map((l) => (
              <p key={l.name} className="mono-label">
                {l.name} <span className="text-mid">{l.level}</span>
              </p>
            ))}
          </Rise>
        </div>

        <div>
          <p className="mono-label">About</p>

          <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.25rem)]">
            <RevealWords text="I make large systems" />
            <br />
            <span className="text-mid">
              <RevealWords text="explain themselves." delay={0.1} />
            </span>
          </h2>

          <div className="mt-9 space-y-5 text-base leading-relaxed text-mid md:text-lg">
            <Rise delay={0.1}>
              <p>
                {profile.years.replace("+", "")} years in, most of my work comes down to one thing: when
                something breaks at 3am, can the system tell you why. That has
                taken me through Royal Mail's ELK migration, 800+ servers moved
                onto private EKS at TransUnion, and full-stack APM and RUM across
                nine Toyota applications.
              </p>
            </Rise>
            <Rise delay={0.16}>
              <p>
                Right now I'm building the observability layer for an agentic AI
                platform at Hitachi Digital Services — which turns out to be the
                same problem with sharper teeth. Agents make decisions you did not
                write, so the only way to trust one in production is to be able to
                see exactly what it saw and why it acted.
              </p>
            </Rise>
            <Rise delay={0.22}>
              <p>
                I like the unglamorous half of this work: killing toil, cutting
                images from 850MB to 320MB, deleting the manual health check
                somebody has run every morning for two years.
              </p>
            </Rise>
          </div>

          <Rise delay={0.28} className="mt-12">
            <div className="rule-fade" />
            <div className="mt-6">
              <p className="mono-label">Education</p>
              <p className="mt-3 text-hi">{education.degree}</p>
              <p className="mt-1 text-sm text-mid">
                {education.school} · {education.period} · {education.detail}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-low">
                {education.extra}
              </p>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}
