import type { Entry, Store } from "./types"

/**
 * Starting collection, so the agent is useful on day one instead of emailing
 * Debanjan about every common recruiter question.
 *
 * Everything here stays at the level his public CV already states. Nothing
 * describes how anything was implemented internally, and nothing is specific
 * to a client's systems - the SDK and the platform are Hitachi's, not his to
 * detail publicly.
 */

const seeds: { q: string; a: string; tags?: string[] }[] = [
  {
    q: "What is he building right now?",
    a: "He has just delivered the backend-agnostic observability platform for OAA, Hitachi's Operational Agentic AI product. It covers 18 managed microservices and around 8 operational agents: an instrumentation SDK giving end-to-end traces, metrics and structured logging, feeding an OpenTelemetry gateway collector on AKS. Two separate things are portable here, and they should not be confused: switching telemetry backend needs no application changes at all, while moving to another cloud such as AWS or GCP carries over the same design and requires the SDK to be added there.",
    tags: ["current", "oaa", "agentic", "observability", "opentelemetry"],
  },
  {
    q: "Did he build the AI agents themselves?",
    a: "No, and he's straightforward about that. He built the observability layer underneath them. The agents were built by other teams; his job was making them explain themselves, so the people operating the platform can see the agent topology, the context and intent behind a query, and where something actually went wrong.",
    tags: ["scope", "agents", "honesty"],
  },
  {
    q: "What does backend-agnostic actually mean here?",
    a: "Multi-exporter routing. A customer can send telemetry to whatever vendor backend they already pay for, or use the bundled LGTM stack — Loki, Grafana, Tempo, Mimir — without changing a line of application code. That is specifically about the backend, not the cloud: running on a different cloud is also supported by the same design, but does require the SDK to be added there.",
    tags: ["architecture", "lgtm", "vendor", "exporters"],
  },
  {
    q: "How deep is his OpenTelemetry experience?",
    a: "Deep and current. He built the instrumentation SDK for an agentic AI platform — framework coverage across the stack, distributed tracing end to end, metrics, and structured logging on a consistent event and action taxonomy — and configured the gateway collector that collects it, including telemetry from the Kafka fabric the agents communicate over.",
    tags: ["opentelemetry", "otel", "sdk", "tracing", "instrumentation"],
  },
  {
    q: "What is his Kubernetes experience?",
    a: "Around five years of it in production, since late 2021. AKS at Hitachi for the OAA observability stack, private EKS clusters at TransUnion where he migrated 800+ servers from on-premises, EKS at Signeasy across 30+ microservices, and Rancher and OpenShift at TCS. He also moved 30+ services from raw manifests to standardised Helm charts.",
    tags: ["kubernetes", "eks", "aks", "helm", "openshift", "rancher"],
  },
  {
    q: "What is the largest migration he has run?",
    a: "800+ servers from on-premises to private EKS clusters at TransUnion, supporting telecom clients including Charter Communications, Comcast and Oracle. Alongside it he ran 200+ production deployments at a 99.8% success rate, handling 50+ releases a week.",
    tags: ["migration", "scale", "transunion", "eks"],
  },
  {
    q: "What kind of role is he looking for?",
    a: "Senior or Staff SRE on the IC track, SRE lead or manager, platform and observability specialist roles, and AI infrastructure or agentic platform work. He's open to all four — the deciding factor is the problem, not the title.",
    tags: ["hiring", "role", "looking", "next"],
  },
  {
    q: "Where is he based and would he relocate?",
    a: "Bengaluru, India. He's open to remote, to Bengaluru or hybrid roles, and to international relocation for the right position.",
    tags: ["location", "relocation", "remote", "bengaluru"],
  },
  {
    q: "How many years of experience does he have?",
    a: "Eight years, starting at Capgemini in August 2018. Capgemini, then TCS, TransUnion, Signeasy, and now Hitachi Digital Services.",
    tags: ["experience", "years", "career"],
  },
  {
    q: "What has he done with cost optimisation?",
    a: "Several things. He cut Docker images from 850MB to 320MB across 30+ microservices at Signeasy, took build times from 18 minutes to 9 via GitHub Actions with parallel execution for roughly 30% off CodeBuild costs, and was part of a 3-person team targeting a 25% AWS reduction. Earlier, his ELK migration for Royal Mail cut operational costs by 40%.",
    tags: ["cost", "finops", "optimisation", "docker", "aws"],
  },
  {
    q: "Has he led or mentored a team?",
    a: "Yes. He led and mentored 15 graduates at TCS building the Kanryo GitOps platform, and led a 10-member support team at Capgemini running Royal Mail infrastructure at 99.5% SLA compliance. He's open to formal lead or manager roles.",
    tags: ["leadership", "mentoring", "team", "manager"],
  },
  {
    q: "What is his incident management and on-call experience?",
    a: "He carried 24/7 on-call at TransUnion for telecom port-in and port-out operations. At Hitachi he shipped around 180 monitors wired into ServiceNow and PagerDuty for Toyota North America, replacing email-based triage, and built an ingestion pipeline handling 15,000 to 18,000 incident emails a day. He works to SLIs, SLOs and error budgets.",
    tags: ["incident", "oncall", "pagerduty", "slo", "servicenow"],
  },
  {
    q: "What did he do on the Toyota project?",
    a: "He led DataDog APM and RUM instrumentation across 9 Toyota North America applications spanning 200+ repositories, on Lambda, ECS Fargate and EKS Fargate, covering Java backends and Angular frontends. He also built the incident email ingestion pipeline and around 180 monitors, and removed 5 to 6 hours of daily manual health-check toil through automation.",
    tags: ["toyota", "tmna", "datadog", "apm", "rum"],
  },
  {
    q: "What is his Infrastructure as Code experience?",
    a: "Terraform and Terragrunt for the IaC transformation at Signeasy, Terraform for Azure AKS clusters at TCS, Ansible playbooks at TransUnion that cut manual configuration work by 75%, and Helm chart based deployment for the observability stack at Hitachi. He also works with Pulumi and CloudFormation.",
    tags: ["terraform", "iac", "ansible", "helm", "terragrunt", "pulumi"],
  },
  {
    q: "What programming languages does he use?",
    a: "Python and Bash are his day-to-day for automation and instrumentation work. He has instrumented Java and Angular applications, and worked across Node.js and React build pipelines. He's an infrastructure engineer rather than a product developer.",
    tags: ["python", "bash", "languages", "programming"],
  },
  {
    q: "What is his education?",
    a: "B.Tech in Electrical and Electronics Engineering from Vellore Institute of Technology, 2014 to 2018, CGPA 8.48 with First Class Distinction. He published a research paper on emotion recognition using machine learning and neuroscience, and interned at Schneider Electric, TE Connectivity and BEML.",
    tags: ["education", "degree", "vit", "college"],
  },
  {
    q: "What compliance or security work has he done?",
    a: "He contributed to SOC2 and HIPAA compliance at Signeasy using Vanta integrated with AWS for vulnerability management and audit readiness, led an OS migration from CentOS and RHEL to AlmaLinux at TransUnion for security compliance and end-of-life risk, and established ITIL processes via ServiceNow at Capgemini.",
    tags: ["soc2", "hipaa", "compliance", "security", "itil"],
  },
  {
    q: "How can I contact him?",
    a: "Email is best: itsme.deb1995@gmail.com. He's also on LinkedIn at /in/debanjan0212 and GitHub at @debanjan0212.",
    tags: ["contact", "email", "reach", "hire"],
  },
  {
    q: "What are his salary expectations?",
    a: "That's not something to settle through a website. Email him directly at itsme.deb1995@gmail.com and he'll discuss it with you.",
    tags: ["salary", "compensation", "ctc", "package"],
  },
  {
    q: "Can he share the internal details of the OAA platform or the SDK?",
    a: "Not publicly. The SDK and the platform belong to Hitachi, so he keeps the description at the architectural level — what it does and why it was built that way, not how it is implemented internally. He's happy to go deeper on his approach and reasoning in a conversation.",
    tags: ["confidential", "privacy", "internal", "proprietary", "details"],
  },
]

/**
 * Adds missing seeds, and refreshes seeded answers whose wording has changed.
 * Safe to run repeatedly.
 *
 * Anything Debanjan answered himself (source "debanjan") is never touched -
 * his words always win over a seed, even if a seed later covers the same
 * question.
 */
export async function seedCollection(
  store: Store,
): Promise<{ added: number; updated: number }> {
  const existing = await store.listEntries()
  const byQuestion = new Map(existing.map((e) => [e.question.trim().toLowerCase(), e]))
  const now = new Date().toISOString()
  let added = 0
  let updated = 0

  for (const s of seeds) {
    const current = byQuestion.get(s.q.trim().toLowerCase())

    if (!current) {
      await store.putEntry({
        id: `seed-${added}-${Date.now().toString(36)}`,
        question: s.q,
        answer: s.a,
        tags: s.tags ?? [],
        source: "profile",
        createdAt: now,
        updatedAt: now,
      })
      added++
      continue
    }

    // Only correct our own seeds, and only when the text actually moved.
    if (current.source === "profile" && current.answer !== s.a) {
      await store.putEntry({ ...current, answer: s.a, tags: s.tags ?? [], updatedAt: now })
      updated++
    }
  }

  return { added, updated }
}
