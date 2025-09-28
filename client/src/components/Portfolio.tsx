import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ExternalLink, Github, Eye, Calendar, Users, TrendingUp, ChevronLeft, ChevronRight, Building2 } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "SOC2 & HIPAA Compliance Implementation",
    description: "Implementing comprehensive compliance framework using Vanta integration with AWS for regulatory compliance across digital document handling and vulnerability management at Signeasy",
    shortDescription: "SOC2 & HIPAA compliance framework for digital signature platform",
    technologies: ["Vanta", "AWS", "SOC2", "HIPAA", "Security"],
    category: "Security",
    status: "In Progress",
    impact: "Enhanced security posture for millions of document workflows",
    company: "Signeasy"
  },
  {
    id: 2,
    title: "Enterprise Server Migration (800+ Servers)",
    description: "Orchestrated migration of 800+ servers from on-premises to private EKS clusters, supporting $1B+ revenue telecommunications clients including Charter Communications, Comcast, and Oracle",
    shortDescription: "Large-scale server migration to EKS for Fortune 500 clients",
    technologies: ["AWS EKS", "Kubernetes", "Migration", "Enterprise"],
    category: "Migration", 
    status: "Completed",
    impact: "99.8% deployment success rate across 200+ production deployments",
    company: "TransUnion"
  },
  {
    id: 3,
    title: "Kanryo GitOps SAAS Platform",
    description: "Led development of GitOps-based SAAS platform using Kubernetes, Rancher, OpenShift, GitHub Actions, and ArgoCD while managing 15 fresh graduates",
    shortDescription: "Enterprise GitOps platform development from scratch",
    technologies: ["Kubernetes", "Rancher", "OpenShift", "GitOps", "ArgoCD"],
    category: "Platform",
    status: "Completed",
    impact: "56% improvement in build times (45 to 20 minutes)",
    company: "TCS"
  },
  {
    id: 4,
    title: "ELK Stack Migration & Cost Optimization",
    description: "Successfully delivered enterprise-wide ELK stack migration for Royal Mail, reducing operational costs by 40% and improving incident resolution time by 60%",
    shortDescription: "Enterprise ELK migration with significant cost savings",
    technologies: ["ELK Stack", "Elasticsearch", "Logstash", "Kibana", "Migration"],
    category: "Monitoring",
    status: "Completed", 
    impact: "40% cost reduction, 60% faster incident resolution",
    company: "Capgemini/Royal Mail"
  },
  {
    id: 5,
    title: "Infrastructure Cost Optimization",
    description: "Leading 3-member team analyzing AWS infrastructure costs, targeting 25% reduction through Kong API Gateway migration, S3 optimization, and ALB consolidation",
    shortDescription: "AWS cost optimization initiative targeting 25% reduction",
    technologies: ["AWS", "Kong API Gateway", "S3", "ALB", "Cost Optimization"],
    category: "Optimization",
    status: "In Progress",
    impact: "Targeting 25% AWS infrastructure cost reduction",
    company: "Signeasy"
  }
]

const ProjectCard = ({ project, onClick }: { project: typeof projects[0], onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden hover-elevate transition-all duration-300 group-hover:border-primary/50">
        {/* Project Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
              {project.status}
            </Badge>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/20">
              {project.title.split(' ').map(word => word[0]).join('')}
            </div>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4">
            {project.shortDescription}
          </p>

          {/* Company & Impact */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 text-primary" />
              <span>{project.company}</span>
            </div>
            <div className="text-xs text-primary font-medium">
              {project.impact}
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 gap-2">
              <ExternalLink className="h-3 w-3" />
              Demo
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-2">
              <Github className="h-3 w-3" />
              Code
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-primary">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of projects I've built with passion and precision
          </p>
        </motion.div>

        {/* Projects Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {projects.map((project) => (
                <CarouselItem key={project.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-8 md:-left-12" />
            <CarouselNext className="-right-8 md:-right-12" />
          </Carousel>
        </motion.div>

        {/* Project Details Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Project Image */}
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                    <div className="text-8xl font-bold text-primary/20">
                      {selectedProject.title.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground text-sm">
                        {selectedProject.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Company</h3>
                      <p className="text-muted-foreground text-sm">
                        {selectedProject.company}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Impact</h3>
                      <p className="text-primary text-sm font-medium">
                        {selectedProject.impact}
                      </p>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="font-semibold mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button className="gap-2" data-testid="button-view-demo">
                      <ExternalLink className="h-4 w-4" />
                      View Demo
                    </Button>
                    <Button variant="outline" className="gap-2" data-testid="button-view-code">
                      <Github className="h-4 w-4" />
                      View Code
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}