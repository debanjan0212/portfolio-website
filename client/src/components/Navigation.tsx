import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Briefcase, Code, Wrench, FolderOpen, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "./ThemeToggle"

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Skills", href: "#skills", icon: Code },
  { name: "Services", href: "#services", icon: Wrench },
  { name: "Portfolio", href: "#portfolio", icon: FolderOpen },
  { name: "Contact", href: "#contact", icon: Mail },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.slice(1))
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    element?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-background/80 border shadow-lg"
          : "bg-transparent"
      } rounded-full px-6 py-3`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          DD
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.href.slice(1)
            
            return (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeNavItem"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "menu"}
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-background/95 backdrop-blur-md border rounded-2xl shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeSection === item.href.slice(1)
                
                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}