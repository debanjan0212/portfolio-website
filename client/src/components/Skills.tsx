import React from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Code2, Database, Cloud, Palette, Settings, Globe, ChevronRight } from "lucide-react"

const skillCategories = [
  {
    id: "cloud",
    label: "Cloud Technologies",
    icon: Cloud,
    skills: [
      { name: "AWS (EC2, S3, EKS, CloudFront)", level: 95 },
      { name: "Kubernetes", level: 90 },
      { name: "Docker", level: 90 },
      { name: "Helm Charts", level: 85 },
      { name: "Container Management", level: 88 },
      { name: "Cloud Architecture", level: 85 }
    ]
  },
  {
    id: "devops",
    label: "DevOps & Automation", 
    icon: Settings,
    skills: [
      { name: "Terraform / Terragrunt", level: 95 },
      { name: "Ansible", level: 90 },
      { name: "Jenkins", level: 90 },
      { name: "ArgoCD", level: 85 },
      { name: "CI/CD Pipelines", level: 90 },
      { name: "Infrastructure as Code", level: 95 }
    ]
  },
  {
    id: "monitoring",
    label: "Monitoring & Logging",
    icon: Database,
    skills: [
      { name: "ELK Stack", level: 85 },
      { name: "System Monitoring", level: 90 },
      { name: "Performance Optimization", level: 85 },
      { name: "Logging Solutions", level: 88 },
      { name: "Incident Management", level: 85 },
      { name: "Reliability Engineering", level: 90 }
    ]
  },
  {
    id: "programming",
    label: "Programming & Security",
    icon: Code2,
    skills: [
      { name: "Python", level: 90 },
      { name: "Bash Scripting", level: 95 },
      { name: "Vulnerability Management", level: 80 },
      { name: "Security Automation", level: 75 },
      { name: "ITIL/ITSM", level: 70 },
      { name: "API Gateway (Kong)", level: 85 }
    ]
  }
]

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  React.useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setCurrentLevel(level)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, level, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{currentLevel}%</span>
      </div>
      <Progress value={currentLevel} className="h-2" />
    </motion.div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedCategory, setSelectedCategory] = useState<typeof skillCategories[0] | null>(null)

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </motion.div>

        {/* Skills Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {skillCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Dialog key={category.id}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all duration-300 group" data-testid={`card-skill-${category.id}`}>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{category.label}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {category.skills.length} Technologies
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary group-hover:gap-3 transition-all">
                          <span className="text-sm font-medium">View Details</span>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {category.label}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 mt-6">
                    <p className="text-muted-foreground">
                      My proficiency levels in {category.label.toLowerCase()} technologies and tools.
                    </p>
                    
                    <div className="space-y-4">
                      {category.skills.map((skill, skillIndex) => (
                        <SkillBar
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                          delay={skillIndex * 100}
                        />
                      ))}
                    </div>
                    
                    {/* Category Summary */}
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Average Proficiency</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">{category.skills.length}</div>
                          <div className="text-sm text-muted-foreground">Technologies</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </motion.div>

        {/* Additional Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="p-6 text-center hover-elevate">
            <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Full Stack Development</h3>
            <p className="text-sm text-muted-foreground">
              End-to-end web application development with modern technologies
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <Palette className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">UI/UX Focus</h3>
            <p className="text-sm text-muted-foreground">
              Creating intuitive and visually appealing user experiences
            </p>
          </Card>

          <Card className="p-6 text-center hover-elevate">
            <Settings className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">System Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Designing scalable and maintainable software solutions
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}