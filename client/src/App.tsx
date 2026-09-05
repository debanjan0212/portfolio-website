import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import { SmoothScrollProvider, ScrollProgress } from "./lib/smooth-scroll";
import AgenticOps from "./components/AgenticOps";
import AgentChat from "./components/AgentChat";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <SmoothScrollProvider>
          <ScrollProgress />
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Hero />
              <About />
              <Experience />
              <Skills />
              <AgenticOps />
              <Services />
              <Portfolio />
              <Contact />
            </main>
            <Footer />
          </div>
          <AgentChat />
          </SmoothScrollProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
