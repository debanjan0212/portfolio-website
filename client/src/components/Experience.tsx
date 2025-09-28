import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Building2, TrendingUp } from "lucide-react"

const experiences = [
  {
    company: "Signeasy",
    position: "Senior Site Reliability Engineer (Cloud DevOps)",
    duration: "Jan 2025 - Present",
    location: "Bengaluru, India",
    description: "Managing SRE initiatives for cloud-based digital signature platform serving millions of document workflows globally",
    keyImpact: "SOC2/HIPAA compliance & 25% AWS cost optimization",
    technologies: ["AWS", "Kubernetes", "Terraform", "DataDog", "Kong API Gateway"],
    achievements: [
      "Leading 3-member cost optimization team targeting 25% AWS reduction",
      "Implementing SOC2 & HIPAA compliance using Vanta integration",
      "Spearheading IaC transformation with Terraform/Terragrunt"
    ]
  },
  {
    company: "TransUnion (Neustar)",
    position: "Developer (Cloud DevOps)", 
    duration: "Dec 2022 - Jan 2025",
    location: "Bengaluru, India",
    description: "Orchestrated enterprise infrastructure for $1B+ revenue telecommunications clients including Charter Communications, Comcast, and Oracle",
    keyImpact: "800+ server migration with 99.8% deployment success rate",
    technologies: ["AWS EKS", "Kubernetes", "ELK Stack", "Prometheus", "Ansible"],
    achievements: [
      "Migrated 800+ servers from on-premises to private EKS clusters",
      "Executed 200+ production deployments with 99.8% success rate",
      "Implemented monitoring for 50+ microservices using ELK Stack"
    ]
  },
  {
    company: "Tata Consultancy Services",
    position: "System Engineer (Cloud DevOps)",
    duration: "Dec 2021 - Dec 2022", 
    location: "Bengaluru, India",
    description: "Led development of 'Kanryo' GitOps-based SAAS platform while managing and mentoring 15 fresh graduates",
    keyImpact: "56% build time improvement (45 to 20 minutes)",
    technologies: ["Kubernetes", "Rancher", "OpenShift", "GitHub Actions", "ArgoCD"],
    achievements: [
      "Built enterprise GitOps platform using Kubernetes and ArgoCD",
      "Optimized Jenkins CI/CD pipelines reducing build times by 56%",
      "Led team of 15 graduates building DevOps solutions from scratch"
    ]
  },
  {
    company: "Capgemini (Royal Mail)",
    position: "Associate Consultant (DevOps)",
    duration: "Aug 2018 - Nov 2021",
    location: "Mumbai, Bangalore, Chennai",
    description: "Delivered enterprise-wide ELK stack migration and led 10-member support team for critical client operations",
    keyImpact: "40% cost reduction & 60% faster incident resolution",
    technologies: ["ELK Stack", "Nagios", "Ansible", "ServiceNow", "Big Data"],
    achievements: [
      "Successfully delivered ELK migration reducing costs by 40%",
      "Led 10-member team with 95% first-call resolution rate",
      "Onboarded 8 enterprise clients for new big data platform"
    ]
  }
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="experience" className="py-20 px-4 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-primary">Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional growth and key achievements
          </p>
        </motion.div>

        {/* Experience Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              data-testid={`card-experience-${exp.company.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Card className="p-6 h-full hover-elevate transition-all duration-300">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-primary mb-1">{exp.position}</h3>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="h-4 w-4" />
                    {exp.company}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                {/* Key Impact */}
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Key Impact</span>
                  </div>
                  <p className="text-sm text-primary font-medium">
                    {exp.keyImpact}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Achievements */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {exp.achievements.slice(0, 3).map((achievement, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1 text-xs">•</span>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}