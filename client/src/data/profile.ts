/**
 * Single source of truth for the facts about Debanjan that the AI agent
 * answers from, and that the reliability panels render. Editing this file
 * updates both the site and the agent's knowledge at once.
 */

export const profile = {
  name: "Debanjan Das",
  title: "Senior Site Reliability Engineer",
  company: "Hitachi Digital Services",
  location: "Bengaluru, India",
  yearsExperience: "7+",
  summary:
    "Senior SRE with 7+ years across cloud infrastructure, observability and platform engineering. Currently building the OAA (Operational Agentic AI) platform at Hitachi Digital Services, where agentic systems are wired into real production operations.",
  focus: [
    "Agentic AI platforms for operations",
    "Observability & OpenTelemetry instrumentation",
    "Kubernetes and platform engineering",
    "Infrastructure as Code",
    "Cost optimisation at scale",
  ],
} as const

export type Experience = {
  company: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
  stack: string[]
}

export const experience: Experience[] = [
  {
    company: "Hitachi Digital Services",
    role: "Senior Site Reliability Engineer",
    period: "Dec 2025 - Present",
    location: "Bengaluru, India",
    summary:
      "Building the OAA (Operational Agentic AI) platform within the HARC Agentic AI team - the observability and reliability layer that agentic systems run on.",
    highlights: [
      "Designing the observability stack for agentic workloads - OpenTelemetry instrumentation across agent traces, tool calls and token spend",
      "Running the metrics pipeline and LGTM (Loki, Grafana, Tempo, Mimir) stack as infrastructure as code",
      "Hands-on across infrastructure, observability and platform engineering for the OAA platform",
    ],
    stack: ["OpenTelemetry", "Grafana", "Loki", "Tempo", "Mimir", "Kubernetes", "Terraform"],
  },
  {
    company: "Signeasy",
    role: "Senior Site Reliability Engineer (Cloud DevOps)",
    period: "Jan 2025 - Dec 2025",
    location: "Bengaluru, India",
    summary:
      "SRE for a digital signature platform serving millions of document workflows, running 100+ microservices on AWS EKS.",
    highlights: [
      "Led a 3-person cost optimisation effort targeting a 25% AWS reduction",
      "Drove SOC2 and HIPAA compliance work using Vanta integration",
      "Spearheaded the IaC transformation with Terraform and Terragrunt",
    ],
    stack: ["AWS", "EKS", "Terraform", "Terragrunt", "Datadog", "Kong"],
  },
  {
    company: "TransUnion (Neustar)",
    role: "Developer (Cloud DevOps)",
    period: "Dec 2022 - Jan 2025",
    location: "Bengaluru, India",
    summary:
      "Enterprise infrastructure for large telecommunications clients including Charter Communications, Comcast and Oracle.",
    highlights: [
      "Migrated 800+ servers from on-premises to private EKS clusters",
      "Executed 200+ production deployments at a 99.8% success rate",
      "Built monitoring for 50+ microservices on the ELK stack",
    ],
    stack: ["AWS EKS", "Kubernetes", "ELK", "Prometheus", "Ansible"],
  },
  {
    company: "Tata Consultancy Services",
    role: "System Engineer (Cloud DevOps)",
    period: "Dec 2021 - Dec 2022",
    location: "Bengaluru, India",
    summary:
      "Led development of 'Kanryo', a GitOps-based SaaS platform, while mentoring 15 fresh graduates.",
    highlights: [
      "Built an enterprise GitOps platform on Kubernetes and ArgoCD",
      "Cut Jenkins build times by 56%, from 45 minutes to 20",
      "Led a team of 15 graduates building DevOps tooling from scratch",
    ],
    stack: ["Kubernetes", "Rancher", "OpenShift", "GitHub Actions", "ArgoCD"],
  },
  {
    company: "Capgemini (Royal Mail)",
    role: "Associate Consultant (DevOps)",
    period: "Aug 2018 - Nov 2021",
    location: "Mumbai, Bangalore, Chennai",
    summary:
      "Delivered an enterprise-wide ELK stack migration and led a 10-member support team for critical client operations.",
    highlights: [
      "Delivered the ELK migration, reducing costs by 40%",
      "Led a 10-member team at a 95% first-call resolution rate",
      "Onboarded 8 enterprise clients onto a new big data platform",
    ],
    stack: ["ELK", "Nagios", "Ansible", "ServiceNow", "Big Data"],
  },
]

/**
 * Flattened text the AI agent is grounded on. Kept as a derived string so it
 * can never drift from what the page itself shows.
 */
export function knowledgeBase(): string {
  const header = [
    `${profile.name} - ${profile.title} at ${profile.company}, ${profile.location}.`,
    `${profile.yearsExperience} years of experience.`,
    profile.summary,
    `Current focus areas: ${profile.focus.join(", ")}.`,
  ].join("\n")

  const roles = experience
    .map((e) =>
      [
        `## ${e.role}, ${e.company} (${e.period}, ${e.location})`,
        e.summary,
        ...e.highlights.map((h) => `- ${h}`),
        `Stack: ${e.stack.join(", ")}`,
      ].join("\n"),
    )
    .join("\n\n")

  return `${header}\n\n${roles}`
}
