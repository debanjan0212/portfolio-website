import { renderToString } from "react-dom/server"
import App from "./App"
import { certifications, education, knowledgeBase, lab, looking, profile, roles } from "./data/profile"
import { notePath, notes } from "./data/notes"

/** One page as HTML, exactly as the browser will first render it. */
export function render(path = "/"): string {
  return renderToString(<App path={path} />)
}

const SITE = `https://${profile.site}`

export type Page = { path: string; title: string; description: string; ogType: "profile" | "article"; jsonLd: object }

/** Every page that is written out as real HTML at build time: the portfolio, then each write-up. */
export function pages(): Page[] {
  return [
    { path: "/", title: "", description: "", ogType: "profile", jsonLd: jsonLd()[0] },
    ...notes.map((n) => ({
      path: notePath(n),
      title: `${n.title} | ${profile.name}`,
      description: n.summary,
      ogType: "article" as const,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: n.title,
        description: n.summary,
        url: `${SITE}${notePath(n)}`,
        mainEntityOfPage: `${SITE}${notePath(n)}`,
        datePublished: n.date,
        dateModified: n.date,
        inLanguage: "en",
        image: `${SITE}/og-image.png`,
        author: { "@type": "Person", "@id": `${SITE}/#person`, name: profile.name, url: `${SITE}/` },
        about: { "@type": "SoftwareSourceCode", name: n.repo.label, codeRepository: n.repo.url },
        isPartOf: { "@id": `${SITE}/#website` },
      },
    })),
  ]
}

/** /sitemap.xml, from the same list, so a new write-up cannot be forgotten. */
export function sitemap(): string {
  const urls = [
    { loc: `${SITE}/`, freq: "weekly", priority: "1.0" },
    ...notes.map((n) => ({ loc: `${SITE}${notePath(n)}`, freq: "monthly", priority: "0.8", lastmod: n.date })),
    { loc: `${SITE}/DebanjanDas-Resume.pdf`, freq: "monthly", priority: "0.6" },
  ]
  const body = urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>${"lastmod" in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

/** schema.org data, so search engines, AI assistants and job boards read the same facts the page shows. */
export function jsonLd(): object[] {
  const person = {
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: profile.name,
    url: `${SITE}/`,
    image: `${SITE}/og-image.png`,
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.summary.technical,
    worksFor: { "@type": "Organization", name: profile.company },
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    sameAs: [profile.linkedin, profile.github],
    alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
    knowsAbout: [
      "Site Reliability Engineering",
      "Observability",
      "OpenTelemetry",
      "Kubernetes",
      "Platform Engineering",
      "GitOps",
      "SLOs and error budgets",
      "AI agents for operations",
      "Model Context Protocol",
      "DevSecOps",
    ],
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: c.issuer },
      ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
    })),
    hasOccupation: {
      "@type": "Occupation",
      name: "Site Reliability Engineer",
      skills: "OpenTelemetry, Kubernetes, AWS, Azure, GCP, Terraform, OpenTofu, Argo CD, Datadog, Prometheus, Grafana, Python",
    },
    seeks: { "@type": "Demand", name: looking.roles.join("; ") },
    subjectOf: notes.map((n) => ({ "@type": "TechArticle", headline: n.title, url: `${SITE}${notePath(n)}`, datePublished: n.date })),
  }

  const site = {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: `${profile.name}, ${profile.role}`,
    inLanguage: "en",
    author: { "@id": `${SITE}/#person` },
  }

  const page = {
    "@type": "ProfilePage",
    "@id": `${SITE}/#page`,
    url: `${SITE}/`,
    name: `${profile.name}, ${profile.role}`,
    isPartOf: { "@id": `${SITE}/#website` },
    mainEntity: { "@id": `${SITE}/#person` },
  }

  const code = lab
    .filter((p) => p.repo)
    .map((p) => ({
      "@type": "SoftwareSourceCode",
      name: p.name,
      description: p.summary,
      codeRepository: p.repo,
      programmingLanguage: "Python",
      license: "https://opensource.org/license/mit",
      keywords: p.tags.join(", "),
      author: { "@id": `${SITE}/#person` },
    }))

  return [{ "@context": "https://schema.org", "@graph": [person, site, page, ...code] }]
}

/** /llms.txt: the same facts as plain text, for AI assistants that read sites directly. */
export function llmsTxt(): string {
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.role} at ${profile.company}, ${profile.location}. ${profile.summary.technical}`,
    "",
    "This file is generated from the same data the website renders, so the two cannot disagree.",
    "",
    "## Open-source projects",
    ...lab.map((p) => `- [${p.name}](${p.repo}): ${p.kicker}. ${p.summary}`),
    "",
    "## Write-ups",
    ...notes.map((n) => `- [${n.title}](${SITE}${notePath(n)}): ${n.kind}. ${n.summary}`),
    "",
    "## Experience",
    ...roles.map((r) => `- ${r.company}, ${r.title} (${r.period}). ${r.blurb}`),
    "",
    "## Links",
    `- Website: ${SITE}/`,
    `- Resume (PDF): ${SITE}/DebanjanDas-Resume.pdf`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    `- Email: ${profile.email}`,
    "",
    "## Full profile",
    "",
    knowledgeBase(),
    "",
  ].join("\n")
}
