import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ChevronDown, Github, Linkedin, Mail, MapPin, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import professionalPortrait from "../assets/professional_portrait_final.jpg"

// Full-Screen Animation Canvas - The primary visual layer
function AnimationCanvas() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Motion values for smooth parallax without React re-renders
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  // Track mouse movement with throttled motion values
  useEffect(() => {
    let animationFrame: number
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      
      animationFrame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = (e.clientY / window.innerHeight) * 2 - 1
        mouseX.set(x)
        mouseY.set(y)
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [mouseX, mouseY])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 0%, rgba(160, 82, 45, 0.05) 35%, rgba(210, 180, 140, 0.02) 100%)'
      }}
    >
      {/* Immersive Spline 3D Layer - Reduced Opacity */}
      <div className="absolute inset-0 w-full h-full">
        {isLoading && (
          <motion.div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-950/20 via-background to-orange-900/10 flex items-center justify-center z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                className="w-16 h-16 border-4 border-amber-600/60 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="text-amber-200/80 text-xl font-light tracking-wide"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Initializing Immersive Experience...
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Reduced Opacity Spline for Better Readability */}
        <div 
          className="w-full h-full"
          style={{ 
            opacity: 0.2,
            mixBlendMode: 'multiply',
            filter: 'contrast(0.8) brightness(0.6) saturate(0.7)',
            backgroundColor: 'transparent'
          }}
        >
          <iframe 
            src='https://my.spline.design/projectpromolookatmouse-ddlyf0zWizL0p3CxWVOAfFxt/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            style={{ border: 'none' }}
            title="Immersive 3D Animation"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
        
        {/* Error Fallback with Animated Background */}
        {hasError && (
          <motion.div 
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.15) 50%, rgba(210, 180, 140, 0.1) 100%)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-amber-200/60 text-lg">Immersive Mode Unavailable</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Programmable DevOps Animation Layer - Reduced for Readability */}
      <div style={{ opacity: 0.1, position: 'relative', zIndex: 1 }}>
        <ProgrammableDevOpsLayer mouseX={smoothMouseX} mouseY={smoothMouseY} />
      </div>

      {/* Overlay Gradient for Text Legibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  )
}

// Programmable DevOps Animation Layer - Covers entire screen
function ProgrammableDevOpsLayer({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  // Create meaningful parallax transforms with proper scaling - NO HOOKS INSIDE LOOPS
  const nodeParallaxX = useTransform(mouseX, (value: number) => value * 40)
  const nodeParallaxY = useTransform(mouseY, (value: number) => value * 30)
  const pipelineParallaxX = useTransform(mouseX, (value: number) => value * 25)
  const pipelineParallaxY = useTransform(mouseY, (value: number) => value * 20)
  const labelParallaxX = useTransform(mouseX, (value: number) => value * 15)
  const labelParallaxY = useTransform(mouseY, (value: number) => value * 12)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Memoize DevOps network nodes to prevent regeneration on every render
  const networkNodes = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 20,
    delay: Math.random() * 5,
    speed: Math.random() * 0.5 + 0.3
  })), [])

  // Memoize pipeline connections to prevent regeneration
  const pipelineConnections = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x1: Math.random() * 100,
    y1: Math.random() * 100,
    x2: Math.random() * 100,
    y2: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 2
  })), [])

  // Memoize orbital systems to prevent regeneration
  const orbitalSystems = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    centerX: Math.random() * 80 + 10,
    centerY: Math.random() * 80 + 10,
    radius: Math.random() * 60 + 30,
    satellites: Math.floor(Math.random() * 4) + 2,
    speed: Math.random() * 1 + 0.5
  })), [])

  // Memoize floating DevOps elements
  const floatingElements = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    label: ['CI/CD', 'K8s', 'AWS', 'Docker', 'Terraform', 'Jenkins', 'Helm', 'Istio', 'Prometheus', 'Grafana', 'ELK', 'Redis', 'Kafka', 'SRE', 'DevOps'][i],
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 4
  })), [])

  return (
    <div ref={layerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="devops-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="rgba(139, 69, 19, 0.3)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#devops-dots)"/>
        </svg>
      </div>

      {/* Dynamic Network Nodes - Full Screen Coverage */}
      {networkNodes.map((node) => (
        <motion.div
          key={`node-${node.id}`}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
            x: nodeParallaxX,
            y: nodeParallaxY
          }}
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.3, 0.9, 0.3],
            rotate: [0, 360]
          }}
          transition={{
            duration: node.speed * 8,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div 
            className="rounded-full border-2 border-amber-500/60 bg-gradient-to-br from-amber-600/20 to-orange-600/40 backdrop-blur-sm"
            style={{
              width: `${node.size}px`,
              height: `${node.size}px`
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-amber-400/40 to-orange-500/40 animate-pulse" />
          </div>
        </motion.div>
      ))}

      {/* Pipeline Data Flow Lines */}
      <motion.svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0 pointer-events-none"
        style={{
          x: pipelineParallaxX,
          y: pipelineParallaxY
        }}
      >
        {pipelineConnections.map((connection) => (
          <motion.line
            key={`pipeline-${connection.id}`}
            x1={`${connection.x1}%`}
            y1={`${connection.y1}%`}
            x2={`${connection.x2}%`}
            y2={`${connection.y2}%`}
            stroke="url(#pipeline-gradient)"
            strokeWidth="2"
            strokeDasharray="10,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0],
              strokeDashoffset: [0, -20, -40]
            }}
            transition={{
              duration: connection.duration,
              delay: connection.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        <defs>
          <linearGradient id="pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 69, 19, 0.8)"/>
            <stop offset="50%" stopColor="rgba(255, 140, 0, 0.9)"/>
            <stop offset="100%" stopColor="rgba(160, 82, 45, 0.6)"/>
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Orbital DevOps Systems */}
      {orbitalSystems.map((system) => (
        <div
          key={`orbital-${system.id}`}
          className="absolute"
          style={{
            left: `${system.centerX}%`,
            top: `${system.centerY}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {Array.from({ length: system.satellites }).map((_, satIndex) => (
            <motion.div
              key={`satellite-${system.id}-${satIndex}`}
              className="absolute w-6 h-6 bg-gradient-to-br from-amber-500/70 to-orange-600/80 rounded-full border border-amber-400/60"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                rotate: [0, 360],
                x: [
                  Math.cos((satIndex / system.satellites) * Math.PI * 2) * system.radius,
                  Math.cos((satIndex / system.satellites) * Math.PI * 2 + Math.PI / 2) * system.radius,
                  Math.cos((satIndex / system.satellites) * Math.PI * 2 + Math.PI) * system.radius,
                  Math.cos((satIndex / system.satellites) * Math.PI * 2 + 3 * Math.PI / 2) * system.radius,
                  Math.cos((satIndex / system.satellites) * Math.PI * 2 + 2 * Math.PI) * system.radius
                ],
                y: [
                  Math.sin((satIndex / system.satellites) * Math.PI * 2) * system.radius,
                  Math.sin((satIndex / system.satellites) * Math.PI * 2 + Math.PI / 2) * system.radius,
                  Math.sin((satIndex / system.satellites) * Math.PI * 2 + Math.PI) * system.radius,
                  Math.sin((satIndex / system.satellites) * Math.PI * 2 + 3 * Math.PI / 2) * system.radius,
                  Math.sin((satIndex / system.satellites) * Math.PI * 2 + 2 * Math.PI) * system.radius
                ]
              }}
              transition={{
                duration: 15 / system.speed,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-r from-amber-300/50 to-orange-400/50 animate-pulse" />
            </motion.div>
          ))}
        </div>
      ))}

      {/* Floating DevOps Icons and Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={`floating-${element.id}`}
          className="absolute w-8 h-8 opacity-60"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            x: labelParallaxX,
            y: labelParallaxY
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            rotate: [0, 360, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full rounded border border-amber-500/40 bg-gradient-to-br from-amber-600/30 to-orange-600/50 flex items-center justify-center text-amber-300 text-xs font-mono">
            {element.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-black">
      {/* Full-Screen Animation Canvas - Primary Visual Layer */}
      <AnimationCanvas />
      
      {/* Content Layer - Split Layout Design */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
            
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  <span className="text-white">Debanjan Das</span>
                </h1>
                
                <h2 className="text-xl lg:text-2xl font-medium mb-2 text-gray-300">
                  DevOps Engineer
                </h2>
                
                <h3 className="text-2xl lg:text-3xl font-semibold mb-6 leading-tight">
                  <span className="text-white">Transforming Ideas Into </span>
                  <span className="text-red-500">Digital Reality</span>
                </h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                  Senior Site Reliability Engineer with 7+ years transforming infrastructure challenges into scalable, automated solutions. Building resilient systems that power innovation at <span className="text-primary font-semibold">Signeasy</span>.
                </p>
                
                <div className="flex items-center gap-2 text-gray-400 mt-4">
                  <MapPin className="h-4 w-4" />
                  <span>Bengaluru, India</span>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-4 mb-8"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                  data-testid="button-github"
                >
                  <Github className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                  data-testid="button-linkedin"
                >
                  <Linkedin className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                  data-testid="button-email"
                >
                  <Mail className="h-5 w-5 text-white" />
                </Button>
              </motion.div>

              {/* Call to Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-xl transition-all duration-300"
                  data-testid="button-projects"
                >
                  <FolderOpen className="w-5 h-5 mr-2" />
                  MY PROJECTS
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  onClick={scrollToAbout}
                  data-testid="button-about"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Side - Professional Portrait (Pop Out Effect) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Clean portrait with natural pop-out and floating animation */}
              <motion.img 
                src={professionalPortrait} 
                alt="Debanjan Das - Professional Portrait" 
                className="w-80 h-96 lg:w-96 lg:h-[500px] object-cover object-center relative z-10"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
                  background: 'transparent'
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 8, 0, -8, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                data-testid="img-professional-portrait"
              />
            </motion.div>
            
          </div>
        </div>

        {/* Scroll indicator - Fixed in Safe Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToAbout}
            className="text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-black/10 border border-white/10"
            data-testid="button-scroll-about"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}