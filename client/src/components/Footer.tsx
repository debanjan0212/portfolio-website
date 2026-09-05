import { profile } from "@/data/profile"

export default function Footer() {
  return (
    <footer className="relative px-6 pb-12">
      <div className="mx-auto max-w-shell">
        <div className="rule-fade" />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8">
          <p className="mono-label">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mono-label">{profile.location}</p>
        </div>
      </div>
    </footer>
  )
}
