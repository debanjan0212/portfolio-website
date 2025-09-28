import Portfolio from '../Portfolio'
import { ThemeProvider } from '../ThemeProvider'

export default function PortfolioExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Portfolio />
      </div>
    </ThemeProvider>
  )
}