import Footer from '../Footer'
import { ThemeProvider } from '../ThemeProvider'

export default function FooterExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Footer />
      </div>
    </ThemeProvider>
  )
}