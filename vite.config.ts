import { execSync } from "node:child_process"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/** The commit this build came from: Netlify provides it, a local build asks git. */
function commit(): string {
  const fromEnv = process.env.COMMIT_REF || process.env.GITHUB_SHA
  if (fromEnv) return fromEnv.slice(0, 7)
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()
  } catch {
    return "local"
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD__: JSON.stringify({ sha: commit(), date: new Date().toISOString() }),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
})
