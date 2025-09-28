import Skills from '../Skills'
import { ThemeProvider } from '../ThemeProvider'

export default function SkillsExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Skills />
      </div>
    </ThemeProvider>
  )
}