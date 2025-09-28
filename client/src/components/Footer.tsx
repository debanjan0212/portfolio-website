import { motion } from "framer-motion"
import { Heart, ArrowUp, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/debanjan0212",
    label: "GitHub"
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/debanjan0212",
    label: "LinkedIn"
  },
  {
    icon: Mail,
    href: "mailto:itsdebanjandas@gmail.com",
    label: "Email"
  }
]

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact", href: "#contact" }
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="relative py-12 px-4 bg-accent/50 border-t">
      <div className="max-w-6xl mx-auto">
        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            className="rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            data-testid="button-back-to-top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                DD
              </div>
              <span className="text-xl font-bold">Debanjan Das</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Senior Site Reliability Engineer passionate about building resilient systems 
              and cloud infrastructure automation. Based in Bengaluru, India.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    asChild
                    data-testid={`footer-social-${social.label.toLowerCase()}`}
                  >
                    <a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  data-testid={`footer-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold">Get In Touch</h3>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span>
                <br />
                <a 
                  href="mailto:itsdebanjandas@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  itsdebanjandas@gmail.com
                </a>
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Location:</span>
                <br />
                Bengaluru, India
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Status:</span>
                <br />
                <span className="text-green-500">Available for projects</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© 2024 Debanjan Das. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>using React, TypeScript & Framer Motion</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span>Last updated: January 2025</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-transparent blur-3xl" />
      </div>
    </footer>
  )
}