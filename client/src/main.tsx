import { createRoot, hydrateRoot } from "react-dom/client"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist-mono"
import "./index.css"
import App from "./App"

const root = document.getElementById("root")!
const isAnswer = window.location.pathname.replace(/\/$/, "") === "/answer"

// The home page ships as real HTML (see scripts/prerender.mjs) and is hydrated.
// Anything else, and local dev, renders from scratch.
if (root.firstElementChild && !isAnswer) hydrateRoot(root, <App />)
else {
  root.textContent = ""
  createRoot(root).render(<App />)
}
