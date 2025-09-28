import Navigation from '../Navigation'
import { ThemeProvider } from '../ThemeProvider'

export default function NavigationExample() {
  return (
    <ThemeProvider>
      <div className="min-h-[400px] bg-background">
        <Navigation />
        <div className="pt-20 p-8">
          <div className="space-y-4">
            <div id="home" className="h-32 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg flex items-center justify-center">
              <h2 className="text-xl font-bold">Home Section</h2>
            </div>
            <div id="about" className="h-32 bg-accent/50 rounded-lg flex items-center justify-center">
              <h2 className="text-xl font-bold">About Section</h2>
            </div>
            <div id="skills" className="h-32 bg-primary/10 rounded-lg flex items-center justify-center">
              <h2 className="text-xl font-bold">Skills Section</h2>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}