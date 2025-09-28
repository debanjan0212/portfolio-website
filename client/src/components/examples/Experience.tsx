import Experience from '../Experience'
import { ThemeProvider } from '../ThemeProvider'

export default function ExperienceExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Experience />
      </div>
    </ThemeProvider>
  )
}