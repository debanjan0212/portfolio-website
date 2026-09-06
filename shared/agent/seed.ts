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
    q: "How would you rate him out of 10, or how good is he?",
    a: "I won't put a number on him — a self-rating from someone's own website is worth nothing, and you shouldn't trust one. Judge him on the record instead: 800+ servers migrated to private EKS at a 99.8% deployment success rate, an observability platform delivered for an agentic AI product, APM and RUM across 200+ Toyota repositories, 40% off Royal Mail's operational costs. Ask me about any of those and I'll give you specifics you can check.",
    tags: ["rating", "rate", "score", "how good", "opinion", "best", "strong"],
  },
  {
    q: "What are his weaknesses, or what is he not good at?",
    a: "He's an infrastructure and reliability engineer, not a product or frontend developer — he instruments applications rather than building them. He also did not build the AI agents on the OAA platform, only the observability layer underneath. Anything more candid than that is worth asking him directly.",
    tags: ["weakness", "gaps", "not good", "limitations", "cons"],
  },
  {
    q: "Can I have his phone number?",
    a: "No — and not because I'm being difficult. Phone numbers on public websites exist to be scraped by recruiters selling insurance. Email him at itsme.deb1995@gmail.com and he'll reply, usually with a real answer rather than a callback menu.",
    tags: ["phone", "number", "mobile", "call", "contact", "whatsapp"],
  },
  {
    q: "What is he like to work with?",
    a: "You should ask someone who has, rather than a program he wrote. What the record shows: he has mentored 15 graduates at TCS, led a 10-member support team at Capgemini, and carried 24/7 on-call for telecom systems — none of which survives being difficult to work with. He'll happily put you in touch with references.",
    tags: ["personality", "work with", "team", "culture", "collaborate"],
  },
  {
    q: "Tell me about his personal life, family or hobbies",
    a: "That's not something this site covers — it's a professional profile, and he'd rather tell you himself over a conversation. Ask me about the work instead, there's plenty of it.",
    tags: ["personal", "family", "married", "hobbies", "private", "life", "age"],
  },
  {
    q: "Is he available for freelance or consulting work?",
    a: "That's worth asking him directly at itsme.deb1995@gmail.com — availability changes, and he'd rather answer honestly for your specific timeline than have me guess.",
    tags: ["freelance", "consulting", "contract", "part time", "available"],
  },
  {
    q: "What certifications does he have?",
    a: "I don't have a certification list on file. Ask him at itsme.deb1995@gmail.com — and in fairness, migrating 800+ servers to EKS is a more convincing credential than most exams.",
    tags: ["certification", "certified", "aws certified", "cka", "credentials"],
  },
  {
    q: "Does he know Terraform or OpenTofu?",
    a: "Yes, both. Terraform and Terragrunt for the IaC transformation at Signeasy, Terraform for AKS clusters at TCS, and OpenTofu for the observability stack at Hitachi. He also works with Pulumi and CloudFormation.",
    tags: ["terraform", "opentofu", "tofu", "iac", "pulumi", "cloudformation"],
  },
  {
    q: "What is his experience with Azure versus AWS?",
    a: "Both, properly. AWS is the longer relationship — EKS, ECS Fargate, Lambda, VPC, IAM, CloudFront, API Gateway across TransUnion and Signeasy. Azure is the current one: AKS, Container Apps, App Gateway and Confluent Kafka for the OAA platform at Hitachi. He has touched GCP but would not claim it as a strength.",
    tags: ["azure", "aws", "gcp", "cloud", "multi-cloud"],
  },
  {
    q: "Has he worked with Kafka?",
    a: "Yes. He designed a Kafka-based big data cluster at Capgemini for US mail processing, and at Hitachi he instruments the Confluent Kafka fabric the OAA agents communicate over — so inter-agent messages are as traceable as any HTTP call.",
    tags: ["kafka", "confluent", "streaming", "messaging", "events"],
  },
  {
    q: "What does he do about alert fatigue?",
    a: "Treats it as a design problem rather than a tuning problem. At Toyota he applied Grok parsing and reference-table enrichment to strip false positives and de-duplicate repeats before anything reached a human, and replaced email-based triage with ~180 monitors routed through ServiceNow and PagerDuty. The goal is fewer alerts that all matter, not more alerts that mostly don't.",
    tags: ["alert", "fatigue", "noise", "monitoring", "paging", "signal"],
  },
  {
    q: "How does he think about SLOs and error budgets?",
    a: "As a decision-making tool, not a dashboard. An SLO is only real if burning the budget actually changes what ships — otherwise it's a number nobody looks at. He defines SLIs with the teams who own the service, aligns SLO targets with them, and uses budget burn as the gate on the next release.",
    tags: ["slo", "sli", "error budget", "reliability", "sla"],
  },
  {
    q: "What is the hardest problem he has solved?",
    a: "Probably the 800+ server migration to private EKS at TransUnion — live systems for telecom clients where port-in and port-out operations could not stop. The technical work is one thing; doing it at 99.8% deployment success across 200+ releases without a business-visible outage is the harder half.",
    tags: ["hardest", "difficult", "challenge", "proud", "biggest"],
  },
  {
    q: "Does he do frontend or full-stack development?",
    a: "No, and he'd tell you the same. He is an infrastructure and reliability engineer. He has instrumented Java and Angular applications and worked across Node and React build pipelines, but he doesn't build product frontends and doesn't claim to.",
    tags: ["frontend", "fullstack", "react", "developer", "ui"],
  },
  {
    q: "What is he learning at the moment?",
    a: "Agentic AI operations, mostly by building the observability for one. The interesting part is that agents make decisions nobody wrote down, so the usual tooling assumptions stop holding — you have to capture intent and context, not just spans and status codes.",
    tags: ["learning", "studying", "growth", "next", "interested"],
  },
  {
    q: "Why should we hire him?",
    a: "I'd rather give you the facts and let you decide, since I'm hardly an impartial witness. He has spent eight years making large systems explainable — 800+ servers migrated at 99.8% deployment success, 40% off Royal Mail's operational costs, APM and RUM across 200+ Toyota repositories, and the observability platform for an agentic AI product. If those are the problems on your desk, he has solved versions of them already.",
    tags: ["hire", "why", "fit", "candidate", "recruit"],
  },
  {
    q: "What time is it, or what is today's date?",
    a: "I can tell you the time and date — both where Debanjan is in Bengaluru and, roughly, where you are. Just ask. It's the least an assistant should manage.",
    tags: ["time", "date", "today", "clock", "timezone", "now"],
  },
  {
    q: "How does this chatbot work?",
    a: "Fairly: it retrieves from a curated set of answers Debanjan has written, and it is instructed to say it doesn't know rather than improvise. Anything it can't answer gets queued and emailed to him at 11pm, and once he answers it I can answer it permanently. He built it — appropriately enough for someone whose job is making systems explain themselves.",
    tags: ["chatbot", "how do you work", "ai", "bot", "assistant", "built"],
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

  /* ------------------------------------------------------------------ */
  /* Depth on each role. The five companies were the biggest gap - the    */
  /* agent could name them but not say what he actually did at each.     */
  /* ------------------------------------------------------------------ */
  {
    q: "What did he do at Capgemini?",
    a: "Three years, August 2018 to November 2021, across Mumbai, Bangalore and Chennai. He architected the enterprise-wide ELK migration off legacy Nagios for Royal Mail, led a 10-member support team at 99.5% SLA compliance, and designed a Kafka-based big data cluster for US mail processing that onboarded 8 enterprise clients in six months. He also put ITIL incident, change and problem management in place through ServiceNow, and introduced SonarQube and Nexus.",
    tags: ["capgemini", "royal mail", "elk", "first job", "history"],
  },
  {
    q: "Tell me about the Royal Mail ELK migration",
    a: "It replaced legacy Nagios with an ELK stack across Royal Mail infrastructure — the whole estate, not a pilot. The measured outcome was 40% lower operational cost and 60% faster incident resolution. It is the piece of work that pushed him from infrastructure support into observability properly, because the argument he had to make internally was not 'this tool is nicer', it was 'the current tooling cannot answer the questions we are being asked during incidents'.",
    tags: ["royal mail", "elk", "nagios", "migration", "capgemini", "logstash"],
  },
  {
    q: "What did he do at TCS?",
    a: "A year, December 2021 to December 2022, as a System Engineer on platform automation. He led development of 'Kanryo', a GitOps-based SaaS platform built on Kubernetes, Rancher, OpenShift, GitHub Actions and ArgoCD, while mentoring 15 engineers. He also cut Jenkins build times from 45 minutes to 20 — 56% — through caching and pipeline streamlining, and built Azure AKS clusters with Terraform with custom Prometheus and Grafana alerting on top.",
    tags: ["tcs", "tata", "kanryo", "gitops", "argocd", "jenkins", "mentoring"],
  },
  {
    q: "What is Kanryo?",
    a: "A GitOps-based SaaS platform he led the development of at TCS, running on Kubernetes with Rancher and OpenShift, and GitHub Actions plus ArgoCD driving delivery. It is also where he did his first real mentoring — 15 engineers on the team.",
    tags: ["kanryo", "tcs", "gitops", "platform"],
  },
  {
    q: "What did he do at TransUnion?",
    a: "Just over two years, December 2022 to January 2025, on Order Management System infrastructure for telecom clients with $1B+ revenue — Charter Communications, Comcast and Oracle. He migrated 800+ servers from on-premises to private EKS clusters, ran 200+ production deployments at 99.8% success across 50+ releases a week, built monitoring for 50+ microservices and 100+ applications on ELK, Prometheus and Grafana, led the OS migration from CentOS/RHEL to AlmaLinux across production, and wrote Ansible playbooks that cut manual configuration work by 75%. He carried 24/7 on-call for port-in and port-out operations throughout.",
    tags: ["transunion", "neustar", "eks", "migration", "on-call", "telecom"],
  },
  {
    q: "What did he do at Signeasy?",
    a: "A year, January to December 2025, on infrastructure automation and cost for a digital signature platform running 30+ microservices on AWS. He cut average Docker image size from 850MB to 320MB, moved CI/CD to GitHub Actions and took build times from 18 minutes to 9, migrated 30+ services from raw Kubernetes manifests to standardised Helm charts, contributed to SOC2 and HIPAA compliance through Vanta, and ran the annual DR exercise failing data flow from us-east-1 over to us-west-2.",
    tags: ["signeasy", "aws", "cost", "docker", "soc2", "hipaa", "dr"],
  },
  {
    q: "How did he get Docker images from 850MB down to 320MB?",
    a: "Multi-stage builds, Alpine base images and deliberate layer caching, applied across 30+ microservices at Signeasy. 62% off the average image. The point was not the number — smaller images meant faster pulls, faster rollbacks and less registry cost, which is what actually showed up in the deployment times.",
    tags: ["docker", "images", "optimisation", "signeasy", "alpine"],
  },
  {
    q: "What is his CI/CD experience?",
    a: "Jenkins, GitHub Actions, ArgoCD, GitLab and Azure Pipelines, and he has rebuilt pipelines rather than just maintained them. At Signeasy he moved CI/CD to GitHub Actions with parallel jobs and caching — 18 minutes to 9, and roughly 30% off CodeBuild costs. At TCS he took Jenkins builds from 45 minutes to 20 and drove delivery through ArgoCD on a GitOps model.",
    tags: ["cicd", "jenkins", "github actions", "argocd", "gitops", "pipelines"],
  },
  {
    q: "What is his disaster recovery experience?",
    a: "He ran the annual DR exercise at Signeasy, failing the data flow over from us-east-1 to us-west-2 with scripted procedures. He is fairly blunt about DR: an untested runbook is a document, not a recovery plan, and the value of the exercise is finding the steps that were wrong while nobody is losing money.",
    tags: ["dr", "disaster recovery", "failover", "aws", "resilience"],
  },
  {
    q: "What did he build for Toyota?",
    a: "He led DataDog APM and RUM instrumentation across 9 Toyota Motors North America applications spanning 200+ repositories, on Lambda, ECS Fargate and EKS Fargate — Java backends and Angular frontends. He shipped around 180 monitors wired into ServiceNow webhooks and PagerDuty, which replaced email-based triage entirely, and removed 5–6 hours of daily manual health-check toil with Python and Bash.",
    tags: ["toyota", "tmna", "datadog", "apm", "rum", "hitachi"],
  },
  {
    q: "Tell me about the incident email pipeline",
    a: "Toyota's incident traffic arrived as email — 15,000 to 18,000 a day. He built a cron-driven ingestion pipeline that pushed them into DataDog at 1,000 per 8-minute cycle, with Grok parsing and reference-table enrichment to kill duplicates and false positives. Triage went from hours of manual reading to near-real-time routing. It is his favourite kind of problem: unglamorous, nobody wants it, and it gives a team back most of a working day.",
    tags: ["toyota", "automation", "datadog", "python", "toil", "pipeline"],
  },

  /* ------------------------------------------------------------------ */
  /* Judgment and approach - what interviewers actually probe.           */
  /* ------------------------------------------------------------------ */
  {
    q: "Prometheus, DataDog or OpenTelemetry — which does he prefer?",
    a: "He has shipped all three in production and treats it as the wrong question. OpenTelemetry is the instrumentation layer and is the one decision he would argue hardest for, because it is what stops you being locked to a vendor — that is precisely the design of the OAA platform, where the backend is swappable and the application code never changes. Prometheus and DataDog are backends, and which one is right depends on what a team already runs, what they can operate, and what they are willing to pay. Instrument once with OTel, then argue about the backend later.",
    tags: ["opentelemetry", "prometheus", "datadog", "opinion", "vendor lock-in"],
  },
  {
    q: "When would he tell a team not to add more monitoring?",
    a: "When nobody acts on what is already there. More dashboards on top of alerts nobody reads makes the noise problem worse, not better. His order of operations is: find the alerts that fire and get ignored, delete or fix those first, and only then ask what is genuinely missing. He has done the deletion side of this — the ~180 monitors he shipped at Toyota replaced email triage rather than being added on top of it.",
    tags: ["monitoring", "alert fatigue", "opinion", "signal", "noise"],
  },
  {
    q: "How does he approach observability for a system he did not build?",
    a: "That is most of his career, and the OAA platform is the extreme version of it — he instrumented around 8 operational agents and 18 services he had no hand in writing. The approach is to start from the questions the operators are actually asking during an incident, work backwards to the signals that would answer them, and put the instrumentation in a shared layer rather than asking every team to add it themselves. On OAA that shared layer was the SDK, so services inherited traces, metrics and structured logging instead of each one reinventing it.",
    tags: ["approach", "instrumentation", "method", "observability", "philosophy"],
  },
  {
    q: "What is different about observing AI agents versus normal services?",
    a: "A normal service does what you wrote. An agent makes decisions you did not write, so the interesting question stops being 'which call was slow' and becomes 'what did it see, what did it decide, and why'. That means capturing context and intent alongside the usual traces and metrics, and making the agent topology visible — which agent handed off to which, and where the chain actually went wrong. Latency and errors still matter, they are just no longer the whole picture.",
    tags: ["agents", "ai", "observability", "opinion", "oaa", "tracing"],
  },
  {
    q: "How does he reduce toil?",
    a: "He looks for the thing somebody does every morning. At Toyota that was 5–6 hours a day of manual health checks, replaced with Python and Bash. At TransUnion it was manual configuration work, cut 75% with Ansible playbooks. At Toyota again, it was reading incident email by hand. None of it is clever engineering — it is noticing that a human is being used as a cron job and fixing that.",
    tags: ["toil", "automation", "python", "ansible", "sre"],
  },
  {
    q: "What does he do in the first 90 days of a new role?",
    a: "Learn what actually pages people and what they ignore, before changing anything. He tends to find the gap between the documented system and the one people describe in an incident channel, and start there. He has joined five organisations now, twice into estates with no working observability at all, so he has a fairly settled routine for it — listen, instrument, then argue.",
    tags: ["onboarding", "new role", "approach", "hiring", "90 days"],
  },

  /* ------------------------------------------------------------------ */
  /* Practical hiring questions.                                         */
  /* ------------------------------------------------------------------ */
  {
    q: "What is his experience with Linux?",
    a: "Eight years of it, and not just as a user. He led the production OS migration from CentOS and RHEL to AlmaLinux at TransUnion, ran on-premises server estates before moving them to Kubernetes, and writes Bash for automation daily. The 800+ server migration was Linux administration at scale before it was a Kubernetes project.",
    tags: ["linux", "centos", "rhel", "almalinux", "sysadmin"],
  },
  {
    q: "Has he worked with observability at scale?",
    a: "Yes, on several different axes. 100+ applications and 50+ microservices monitored at TransUnion, 200+ repositories instrumented at Toyota, an enterprise-wide ELK estate at Royal Mail, and 18 services plus around 8 agents on OAA. Different kinds of scale — breadth of repositories, depth of a single platform, and size of an estate — and he has done all three.",
    tags: ["scale", "observability", "experience", "breadth"],
  },
  {
    q: "What tools does he use day to day?",
    a: "OpenTelemetry and its collector, DataDog, the LGTM stack — Loki, Grafana, Tempo, Mimir — Kubernetes on AKS and EKS, Helm, Terraform and OpenTofu, Kafka, GitHub Actions and ArgoCD, and Python and Bash for everything in between. PagerDuty and ServiceNow for the incident side.",
    tags: ["tools", "stack", "daily", "technologies"],
  },
  {
    q: "Does he have experience with multiple clouds?",
    a: "AWS and Azure in production, and GCP at a working level. AWS at TransUnion and Signeasy — EKS, ECS Fargate, Lambda, VPC, IAM, CloudFront, Route53. Azure at TCS and Hitachi — AKS, Container Apps, App Gateway, Confluent Kafka. The OAA observability design is deliberately cloud-agnostic, so the same approach carries over with the SDK added.",
    tags: ["cloud", "aws", "azure", "gcp", "multi-cloud"],
  },
  {
    q: "Has he worked in a regulated or compliance-heavy environment?",
    a: "Yes. SOC2 and HIPAA at Signeasy through the Vanta integration with AWS, ITIL incident, change and problem management at Capgemini through ServiceNow, and telecom port-in and port-out operations at TransUnion, which carry regulatory obligations of their own. He has also done RBAC and access-control work as part of it.",
    tags: ["compliance", "soc2", "hipaa", "itil", "regulated", "rbac"],
  },
  {
    q: "What size of team has he worked in?",
    a: "Everything from a 3-person cost-optimisation team at Signeasy to a 10-member support team he led at Capgemini and 15 engineers he mentored at TCS. He works across teams more than inside one — instrumenting 200+ repositories at Toyota meant working with whoever owned each of them.",
    tags: ["team", "size", "collaboration", "leadership"],
  },
  {
    q: "Does he have management experience?",
    a: "Team lead and mentoring rather than formal line management. He led a 10-member support team at Capgemini at 99.5% SLA compliance, and mentored 15 engineers at TCS. He is open to an SRE lead or manager role next, but equally happy on the senior or staff IC track — the deciding factor is the problem, not the title.",
    tags: ["management", "leadership", "mentoring", "lead", "hiring"],
  },
  {
    q: "What languages does he speak?",
    a: "English at C2, Hindi at upper intermediate, and Bengali natively.",
    tags: ["languages", "english", "hindi", "bengali", "spoken"],
  },
  {
    q: "What is the site itself built with?",
    a: "React, Vite and TypeScript with Tailwind, Framer Motion for the movement and Lenis for the scroll, deployed on Netlify with serverless functions behind this assistant. Which is a bit off-brand for an SRE, but he wanted the thing you are talking to now to be a real system rather than a widget.",
    tags: ["site", "portfolio", "stack", "meta", "react", "netlify"],
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
