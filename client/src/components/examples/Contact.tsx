import Contact from '../Contact'
import { ThemeProvider } from '../ThemeProvider'

export default function ContactExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Contact />
      </div>
    </ThemeProvider>
  )
}