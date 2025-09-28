import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react"

const highlights = [
  {
    icon: Briefcase,
    title: "7+ Years",
    description: "Professional Experience"
  },
  {
    icon: Calendar,
    title: "50+ Projects",
    description: "Successfully Delivered"
  },
  {
    icon: GraduationCap,
    title: "99.9%",
    description: "Uptime Achieved"
  }
]

const technologies = [
  "AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", 
  "Python", "Bash", "Ansible", "ArgoCD", "ELK Stack"
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section id="about" className="py-20 px-4 relative z-10 bg-white" style={{ backgroundColor: '#ffffff', background: '#ffffff', colorScheme: 'light' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 professional-heading">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto professional-text">
            Passionate Site Reliability Engineer with expertise in building resilient, scalable infrastructure
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-lg leading-relaxed professional-text enhanced-text">
                Hello! I'm Debanjan, a passionate Senior Site Reliability Engineer at Signeasy with over 7 years 
                of experience building, automating, and scaling reliable cloud systems. Based in Bengaluru, I specialize 
                in cloud-native solutions, infrastructure automation, and operational excellence.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground professional-text enhanced-text">
                My journey in tech has taken me through leading organizations including Capgemini, TCS, TransUnion, 
                and now Signeasy. I thrive on solving complex infrastructure challenges, designing scalable 
                architectures with Terraform and Kubernetes, and ensuring systems are always resilient, secure, and cost-effective.
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold professional-heading">Technologies I Work With</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <Badge variant="secondary" className="text-sm py-1">
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Location & Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>Senior SRE at Signeasy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Highlights Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                >
                  <Card className="p-6 hover-elevate transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{highlight.title}</h3>
                        <p className="text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}

            {/* Call to Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Let's Work Together</h3>
                  <p className="text-muted-foreground mb-4">
                    Ready to bring your ideas to life with cutting-edge technology?
                  </p>
                  <button
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-primary font-medium hover:underline"
                    data-testid="button-contact-cta"
                  >
                    Get In Touch →
                  </button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}