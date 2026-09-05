/**
 * Single source of truth. The page renders from this, and the AI agent is
 * grounded on this, so the two can never disagree.
 */

/** Career start: Capgemini, August 2018. Derived so it never goes stale. */
const CAREER_START = new Date("2018-08-09")

function yearsOfExperience(): string {
  const now = new Date()
  let y = now.getFullYear() - CAREER_START.getFullYear()
  const beforeAnniversary =
    now.getMonth() < CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() && now.getDate() < CAREER_START.getDate())
  if (beforeAnniversary) y -= 1
  return `${y}+`
}

export const profile = {
  name: "Debanjan Das",
  first: "Debanjan",
  role: "Senior Site Reliability Engineer",
  company: "Hitachi Digital Services",
  location: "Bengaluru, India",
  email: "itsme.deb1995@gmail.com",
  linkedin: "https://www.linkedin.com/in/debanjan0212/",
  github: "https://github.com/debanjan0212",
  site: "debanjanops.online",
  years: yearsOfExperience(),
  tagline: "Reliability for systems that think",
  intro:
    "I build the observability and reliability layer underneath large systems — most recently the telemetry platform for an agentic AI product, and before that full-stack APM instrumentation across Toyota North America.",
}

export type Role = {
  company: string
  title: string
  period: string
  location: string
  blurb: string
  points: string[]
  stack: string[]
}

export const roles: Role[] = [
  {
    company: "Hitachi Digital Services",
    title: "Senior Site Reliability Engineer — SRE Transformation",
    period: "Dec 2025 — Present",
    location: "Bengaluru, India",
    blurb:
      "Two projects: full-stack observability for Toyota Motors North America, then the backend-agnostic telemetry platform for Hitachi's Operational Agentic AI product.",
    points: [
      "Delivered a backend-agnostic observability platform for the OAA agentic AI platform — 18 managed microservices and around 8 operational agents, alongside Confluent Kafka, PostgreSQL, Redis and App Gateway",
      "Built the instrumentation SDK the platform ships with: framework coverage across the stack, end-to-end distributed traces, metrics, and structured logging on a consistent event/action taxonomy",
      "Instrumented the platform end to end, including telemetry artifact collection and export, so a run can be followed from the first request through every agent that touched it",
      "OpenTelemetry gateway collector configuration, deployed on AKS — cloud-agnostic by design, so the same approach carries to AWS or GCP with the SDK added",
      "Multi-exporter routing so customers send telemetry to their own vendor backend or the bundled LGTM stack, with no application changes",
      "Made agent topologies, and the context and intent behind each operational query, visible to the people running the system — so they can see what broke and what is likely to break next",
      "Led DataDog APM and RUM instrumentation across 9 Toyota applications spanning 200+ repositories on Lambda, ECS Fargate and EKS Fargate — Java backends and Angular frontends",
      "Built an email-to-DataDog ingestion pipeline processing 15,000–18,000 incident emails a day at 1,000 per 8-minute cycle, cutting triage from hours of manual work to near-real-time routing",
      "Shipped ~180 monitors wired to ServiceNow webhooks and PagerDuty, replacing email-based triage entirely",
      "Removed 5–6 hours of daily manual health-check toil through Python and Bash automation",
    ],
    stack: ["OpenTelemetry", "Azure AKS", "DataDog", "LGTM", "Kafka", "Helm", "Python"],
  },
  {
    company: "Signeasy",
    title: "Senior Site Reliability Engineer — Infrastructure Automation & Cost",
    period: "Jan 2025 — Dec 2025",
    location: "Bengaluru, India",
    blurb:
      "Infrastructure automation and cost work across a digital signature platform running 30+ microservices on AWS.",
    points: [
      "Cut average Docker image size from 850MB to 320MB (62%) across 30+ microservices using multi-stage builds, Alpine bases and layer caching",
      "Migrated CI/CD to GitHub Actions with parallel jobs and caching — build times from 18 minutes to 9, and roughly 30% off CodeBuild costs",
      "Moved 30+ services from raw Kubernetes manifests to standardised Helm charts, improving release consistency and rollback reliability",
      "Contributed to SOC2 and HIPAA compliance via Vanta integration with AWS",
      "Ran the annual DR exercise, failing data flow over from us-east-1 to us-west-2 with scripted procedures",
      "Part of a 3-person team targeting a 25% AWS reduction through Kong API Gateway migration and rightsizing",
    ],
    stack: ["AWS", "EKS", "GitHub Actions", "Helm", "Terraform", "DataDog", "Kong"],
  },
  {
    company: "TransUnion (Neustar)",
    title: "Developer — SRE & Network Infrastructure",
    period: "Dec 2022 — Jan 2025",
    location: "Bengaluru, India",
    blurb:
      "Order Management System infrastructure for $1B+ revenue telecom clients including Charter Communications, Comcast and Oracle.",
    points: [
      "Migrated 800+ servers from on-premises to private EKS clusters",
      "Executed 200+ production deployments at a 99.8% success rate, handling 50+ releases a week",
      "Built monitoring for 50+ microservices and 100+ applications on ELK, Prometheus and Grafana",
      "Led the OS migration from CentOS/RHEL to AlmaLinux across production",
      "Wrote Ansible playbooks that cut manual configuration work by 75%",
      "Carried 24/7 on-call for telecom port-in/port-out operations",
    ],
    stack: ["AWS EKS", "Kubernetes", "ELK", "Prometheus", "Ansible", "AlmaLinux"],
  },
  {
    company: "Tata Consultancy Services",
    title: "System Engineer — Platform Automation",
    period: "Dec 2021 — Dec 2022",
    location: "Bengaluru, India",
    blurb: "Built 'Kanryo', a GitOps-based SaaS platform, while mentoring 15 engineers.",
    points: [
      "Led development of Kanryo on Kubernetes, Rancher, OpenShift, GitHub Actions and ArgoCD",
      "Cut Jenkins build times from 45 minutes to 20 (56%) through caching and pipeline streamlining",
      "Built Azure AKS clusters with Terraform and extended Prometheus/Grafana with custom alerting",
    ],
    stack: ["Kubernetes", "ArgoCD", "Rancher", "OpenShift", "Terraform", "Azure AKS"],
  },
  {
    company: "Capgemini",
    title: "Associate Consultant — Infrastructure & Observability",
    period: "Aug 2018 — Nov 2021",
    location: "Mumbai, Bangalore, Chennai",
    blurb: "Enterprise observability for Royal Mail, plus a Kafka-based big data platform.",
    points: [
      "Architected the enterprise-wide ELK migration off legacy Nagios for Royal Mail — 40% lower operational cost, 60% faster incident resolution",
      "Led a 10-member support team at 99.5% SLA compliance",
      "Designed a Kafka-based big data cluster for US mail processing, onboarding 8 enterprise clients in 6 months",
      "Established ITIL incident, change and problem management via ServiceNow; introduced SonarQube and Nexus",
    ],
    stack: ["ELK", "Kafka", "Nagios", "Logstash", "ServiceNow", "SonarQube"],
  },
]

export const skillGroups = [
  {
    label: "Cloud & Infrastructure",
    items: [
      "AWS (EKS, ECS Fargate, Lambda, VPC, IAM, CloudFront, API Gateway, Route53)",
      "Azure (AKS, Container Apps, App Gateway, Confluent Kafka)",
      "GCP",
      "Kubernetes",
      "Docker",
      "OpenShift",
      "Rancher",
      "Helm",
      "Terraform",
      "Terragrunt",
      "Pulumi",
      "Ansible",
      "Kong API Gateway",
    ],
  },
  {
    label: "Observability",
    items: [
      "OpenTelemetry (Collector, Contrib, SDK instrumentation)",
      "DataDog (APM, RUM, Logs, Monitors)",
      "Prometheus",
      "Grafana",
      "Loki",
      "Tempo",
      "Mimir",
      "ELK / OpenSearch",
      "PagerDuty",
      "ServiceNow webhooks",
    ],
  },
  {
    label: "DevOps & Automation",
    items: [
      "Jenkins",
      "ArgoCD",
      "GitHub Actions",
      "GitOps",
      "GitLab",
      "CI/CD pipeline development",
      "Python",
      "Bash",
      "Linux administration",
    ],
  },
  {
    label: "Practices",
    items: [
      "SLI / SLO / SLA",
      "Error budgets",
      "Incident management",
      "Toil reduction",
      "SOC2 / HIPAA",
      "ITIL",
      "FinOps & cost optimisation",
      "RBAC",
    ],
  },
]

export type Project = {
  title: string
  org: string
  period: string
  summary: string
  metrics: { value: string; label: string }[]
  tags: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: "Backend-agnostic observability for an agentic AI platform",
    org: "Hitachi Digital Services",
    period: "2026 — Delivered",
    summary:
      "A plug-and-play OpenTelemetry architecture for the OAA agentic platform: an instrumentation SDK giving end-to-end traces, metrics and structured logging, behind a gateway collector on AKS. Telemetry routes to any vendor backend or a bundled LGTM stack with no application changes, and the design is cloud-agnostic — the same approach carries to AWS or GCP. I did not build the agents; I made them observable, so the people running them can see what broke and why.",
    metrics: [
      { value: "18", label: "microservices instrumented" },
      { value: "8", label: "operational agents traced" },
    ],
    tags: ["OpenTelemetry", "Azure AKS", "LGTM", "Kafka", "Helm", "Python"],
    featured: true,
  },
  {
    title: "Toyota TMNA — full-stack APM & RUM instrumentation",
    org: "Hitachi Digital Services",
    period: "2025 — 2026",
    summary:
      "DataDog APM and RUM across 9 Toyota applications and 200+ repositories on Lambda, ECS Fargate and EKS Fargate, with ~180 monitors wired into ServiceNow and PagerDuty.",
    metrics: [
      { value: "200+", label: "repositories" },
      { value: "~180", label: "monitors shipped" },
    ],
    tags: ["DataDog", "Java", "Angular", "AWS Lambda", "ECS Fargate"],
  },
  {
    title: "Incident email ingestion pipeline",
    org: "Toyota TMNA",
    period: "2025 — 2026",
    summary:
      "Cron-driven ingestion of 15,000–18,000 daily incident emails into DataDog at 1,000 per 8-minute cycle, with Grok parsing and reference-table enrichment to kill false positives and duplicates.",
    metrics: [
      { value: "18k", label: "emails a day" },
      { value: "hours → minutes", label: "triage time" },
    ],
    tags: ["Python", "DataDog API", "Grok", "Automation"],
  },
  {
    title: "Kubernetes migration at scale",
    org: "TransUnion",
    period: "2023 — 2024",
    summary:
      "800+ servers moved from on-premises to private EKS clusters for $1B+ revenue telecom clients, across 200+ production releases.",
    metrics: [
      { value: "800+", label: "servers migrated" },
      { value: "99.8%", label: "deployment success" },
    ],
    tags: ["AWS EKS", "Kubernetes", "Ansible", "Prometheus"],
  },
  {
    title: "CI/CD and image size optimisation",
    org: "Signeasy",
    period: "2025",
    summary:
      "Docker images down from 850MB to 320MB across 30+ microservices, and build times from 18 minutes to 9 via GitHub Actions with parallel execution.",
    metrics: [
      { value: "62%", label: "smaller images" },
      { value: "~30%", label: "lower build cost" },
    ],
    tags: ["Docker", "GitHub Actions", "Helm", "AWS"],
  },
  {
    title: "ELK enterprise migration",
    org: "Capgemini / Royal Mail",
    period: "2020 — 2021",
    summary:
      "Replaced legacy Nagios with an ELK stack across Royal Mail infrastructure, and onboarded 8 enterprise clients onto a Kafka-based big data cluster within six months.",
    metrics: [
      { value: "40%", label: "cost reduction" },
      { value: "60%", label: "faster resolution" },
    ],
    tags: ["ELK", "Logstash", "Kafka", "Nagios"],
  },
]

export const education = {
  degree: "B.Tech, Electrical and Electronics Engineering",
  school: "Vellore Institute of Technology (VIT), Vellore",
  period: "2014 — 2018",
  detail: "CGPA 8.48/10, First Class with Distinction",
  extra:
    "Published a research paper on emotion recognition using machine learning and neuroscience. Internships at Schneider Electric, TE Connectivity and BEML.",
}

export const languages = [
  { name: "English", level: "Proficient (C2)" },
  { name: "Hindi", level: "Upper intermediate (B2)" },
  { name: "Bengali", level: "Native" },
]

/** What he is looking for — asked directly, not inferred. */
export const looking = {
  roles: [
    "Senior / Staff SRE on the IC track",
    "SRE lead or manager",
    "Platform and observability specialist roles",
    "AI infrastructure and agentic platform roles",
  ],
  location: [
    "Open to remote",
    "Bengaluru or hybrid",
    "Open to international relocation",
  ],
  headline: "The OAA backend-agnostic observability platform is the work he'd point at first.",
}

export function knowledgeBase(): string {
  const head = [
    `${profile.name} — ${profile.role} at ${profile.company}, ${profile.location}.`,
    `${profile.years} years of experience. Contact: ${profile.email}. LinkedIn: ${profile.linkedin}.`,
    profile.intro,
    "",
    "WHAT HE IS LOOKING FOR",
    ...looking.roles.map((r) => `- ${r}`),
    `Location: ${looking.location.join("; ")}.`,
    looking.headline,
  ].join("\n")

  const exp = roles
    .map((r) =>
      [
        `## ${r.title}, ${r.company} (${r.period}, ${r.location})`,
        r.blurb,
        ...r.points.map((p) => `- ${p}`),
        `Stack: ${r.stack.join(", ")}`,
      ].join("\n"),
    )
    .join("\n\n")

  const proj = projects
    .map(
      (p) =>
        `## ${p.title} — ${p.org} (${p.period})\n${p.summary}\n${p.metrics
          .map((m) => `${m.value} ${m.label}`)
          .join("; ")}`,
    )
    .join("\n\n")

  const skills = skillGroups
    .map((g) => `${g.label}: ${g.items.join(", ")}`)
    .join("\n")

  const edu = `${education.degree}, ${education.school} (${education.period}). ${education.detail} ${education.extra}`
  const langs = languages.map((l) => `${l.name}: ${l.level}`).join("; ")

  return [
    head,
    "\nEXPERIENCE\n" + exp,
    "\nSELECTED PROJECTS\n" + proj,
    "\nSKILLS\n" + skills,
    "\nEDUCATION\n" + edu,
    "\nLANGUAGES\n" + langs,
  ].join("\n")
}
