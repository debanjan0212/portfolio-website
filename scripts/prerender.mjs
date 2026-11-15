/**
 * Turns the built single-page app into a real HTML page.
 *
 * `vite build` leaves an empty <div id="root">: fine for a browser, invisible
 * to anything that does not run JavaScript (most AI crawlers, link previews,
 * job-board scrapers, a visitor on a bad connection). This script renders the
 * home page with the server bundle and writes the result into index.html,
 * together with schema.org data and /llms.txt. The browser then hydrates the
 * same markup, so nobody sees a blank page and nobody sees different content.
 *
 * Run by `npm run build`, after both vite builds.
 */
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const htmlPath = path.join(root, "dist/public/index.html")
const server = await import(pathToFileURL(path.join(root, "dist/server/entry-server.js")).href)

const app = server.render()
// "<" inside JSON would let a string close the script tag early
const data = JSON.stringify(server.jsonLd()[0]).replace(/</g, "\\u003c")

let html = await readFile(htmlPath, "utf8")
for (const marker of ["<!--app-->", "<!--jsonld-->"]) {
  if (!html.includes(marker)) throw new Error(`prerender: ${marker} is missing from index.html`)
}
html = html.replace("<!--app-->", app).replace("<!--jsonld-->", `<script type="application/ld+json">${data}</script>`)

// The first screen uses both faces. Preloading them removes the flash of fallback text and the layout shift it causes.
const assets = await readdir(path.join(root, "dist/public/assets"))
const fonts = ["geist-latin-wght-normal", "geist-mono-latin-wght-normal"].map((name) => assets.find((f) => f.startsWith(name) && f.endsWith(".woff2"))).filter(Boolean)
if (fonts.length !== 2) throw new Error("prerender: could not find the Geist font files to preload")
html = html.replace("</title>", `</title>\n${fonts.map((f) => `    <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join("\n")}`)

if (app.length < 5000) throw new Error("prerender: the rendered page is suspiciously small")

await writeFile(htmlPath, html)
await writeFile(path.join(root, "dist/public/llms.txt"), server.llmsTxt())

console.log(`prerender: index.html ${(html.length / 1024).toFixed(1)} kB, llms.txt written`)
