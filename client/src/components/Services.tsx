import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Code2, 
  Smartphone, 
  Cloud, 
  Search, 
  Settings, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react"

const services = [
  {
    icon: Settings,
    title: "DevOps Engineering",
    description: "End-to-end DevOps solutions including automation, CI/CD pipeline design, and Infrastructure as Code implementation.",
    features: [
      "CI/CD Pipeline Setup",
      "Automation Scripts",
      "Infrastructure as Code",
      "Process Optimization"
    ],
    color: "from-amber-600 to-orange-600"
  },
  {
    icon: Search,
    title: "Site Reliability Engineering",
    description: "Comprehensive SRE services focusing on system reliability, monitoring, incident management, and scalability.",
    features: [
      "System Monitoring",
      "Incident Management",
      "Performance Optimization",
      "Reliability Engineering"
    ],
    color: "from-amber-700 to-yellow-700"
  },
  {
    icon: Cloud,
    title: "Cloud Optimization & Security",
    description: "Cloud infrastructure optimization, security implementation, and cost management across AWS platforms.",
    features: [
      "AWS Architecture",
      "Cost Optimization",
      "Security Implementation",
      "Migration Services"
    ],
    color: "from-amber-800 to-orange-800"
  },
  {
    icon: Code2,
    title: "Infrastructure Automation",
    description: "Automated infrastructure provisioning and management using Terraform, Ansible, and modern IaC practices.",
    features: [
      "Terraform/Terragrunt",
      "Ansible Playbooks",
      "Kubernetes Orchestration",
      "Container Management"
    ],
    color: "from-yellow-600 to-amber-600"
  },
  {
    icon: Smartphone,
    title: "Monitoring & Observability",
    description: "Comprehensive monitoring solutions with ELK Stack, alerting systems, and performance dashboards.",
    features: [
      "ELK Stack Implementation",
      "Real-time Monitoring",
      "Custom Dashboards",
      "Alert Management"
    ],
    color: "from-orange-600 to-red-600"
  },
  {
    icon: Users,
    title: "Technical Consulting",
    description: "Strategic guidance on cloud migration, infrastructure modernization, and DevOps transformation.",
    features: [
      "Architecture Review",
      "Migration Planning",
      "Best Practices",
      "Technology Strategy"
    ],
    color: "from-red-600 to-amber-600"
  }
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="services" className="py-20 px-4 bg-accent/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Site Reliability & <span className="text-primary">DevOps</span> Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert infrastructure automation, cloud optimization, and reliability engineering services to scale your systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-6 h-full hover-elevate transition-all duration-300 group-hover:border-primary/50">
                  {/* Service Icon with Gradient */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} p-0.5 mb-6`}>
                    <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  {/* Service Title & Description */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    data-testid={`button-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with cutting-edge 
              technology and exceptional user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                data-testid="button-start-project"
              >
                Start a Project
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                data-testid="button-view-portfolio"
              >
                View Portfolio
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}