import { renderToString } from "react-dom/server"
import App from "./App"
import { certifications, education, knowledgeBase, lab, looking, profile, roles } from "./data/profile"

/** The home page as HTML, exactly as the browser will first render it. */
export function render(): string {
  return renderToString(<App />)
}

const SITE = `https://${profile.site}`

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
