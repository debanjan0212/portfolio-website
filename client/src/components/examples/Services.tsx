import Services from '../Services'
import { ThemeProvider } from '../ThemeProvider'

export default function ServicesExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Services />
      </div>
    </ThemeProvider>
  )
}