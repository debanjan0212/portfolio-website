import ThemeToggle from '../ThemeToggle'
import { ThemeProvider } from '../ThemeProvider'

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="flex items-center justify-center min-h-[200px] bg-background">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}