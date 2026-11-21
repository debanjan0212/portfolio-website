/**
 * Turns the built single-page app into real HTML pages.
 *
 * `vite build` leaves an empty <div id="root">: fine for a browser, invisible
 * to anything that does not run JavaScript (most AI crawlers, link previews,
 * job-board scrapers, a visitor on a bad connection). This script renders each
 * page with the server bundle and writes the result as its own index.html,
 * with its own title, description, canonical address and schema.org data. It
 * also writes /sitemap.xml and /llms.txt from the same data. The browser then
 * hydrates the same markup, so nobody sees a blank page and nobody sees
 * different content.
 *
 * Run by `npm run build`, after both vite builds.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = path.join(root, "dist/public")
const server = await import(pathToFileURL(path.join(root, "dist/server/entry-server.js")).href)
const SITE = "https://debanjansre.online"

let template = await readFile(path.join(out, "index.html"), "utf8")
for (const marker of ["<!--app-->", "<!--jsonld-->"]) {
  if (!template.includes(marker)) throw new Error(`prerender: ${marker} is missing from index.html`)
}

// Both typefaces are on every first screen. Preloading them removes the flash of fallback text and the layout shift it causes.
const assets = await readdir(path.join(out, "assets"))
const fonts = ["geist-latin-wght-normal", "geist-mono-latin-wght-normal"].map((name) => assets.find((f) => f.startsWith(name) && f.endsWith(".woff2"))).filter(Boolean)
if (fonts.length !== 2) throw new Error("prerender: could not find the Geist font files to preload")
const fontLinks = fonts.map((f) => `    <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join("\n")
// The intro photo is the largest thing on the home page's first screen.
const photoLink = `    <link rel="preload" as="image" href="/intro-poster-1280.webp" imagesrcset="/intro-poster-720.webp 720w, /intro-poster-1280.webp 1280w" imagesizes="(min-width: 940px) 34rem, 100vw" fetchpriority="high" />`

const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

/** Swap one tag in the head, and fail loudly if index.html no longer has it. */
function swap(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: no match for ${pattern}`)
  return html.replace(pattern, replacement)
}

for (const page of server.pages()) {
  const home = page.path === "/"
  const app = server.render(page.path)
  if (app.length < 5000) throw new Error(`prerender: ${page.path} rendered suspiciously small`)

  // "<" inside JSON would let a string close the script tag early
  const data = JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")
  let html = template.replace("<!--app-->", () => app).replace("<!--jsonld-->", () => `<script type="application/ld+json">${data}</script>`)
  html = html.replace("</title>", () => `</title>\n${fontLinks}${home ? `\n${photoLink}` : ""}`)

  if (!home) {
    const url = `${SITE}${page.path}`
    const title = attr(page.title)
    const description = attr(page.description)
    html = swap(html, /<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
    html = swap(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/, () => `<meta name="description" content="${description}" />`)
    html = swap(html, /<link rel="canonical" href="[^"]*" \/>/, () => `<link rel="canonical" href="${url}" />`)
    html = swap(html, /<meta property="og:type" content="[^"]*" \/>/, () => `<meta property="og:type" content="${page.ogType}" />`)
    html = swap(html, /<meta property="og:url" content="[^"]*" \/>/, () => `<meta property="og:url" content="${url}" />`)
    html = swap(html, /<meta property="og:title" content="[^"]*" \/>/, () => `<meta property="og:title" content="${title}" />`)
    html = swap(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, () => `<meta property="og:description" content="${description}" />`)
    html = swap(html, /<meta name="twitter:title" content="[^"]*" \/>/, () => `<meta name="twitter:title" content="${title}" />`)
    html = swap(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, () => `<meta name="twitter:description" content="${description}" />`)
    // these two describe a person's profile page, not an article
    html = html.replace(/\s*<meta property="profile:(first|last)_name" content="[^"]*" \/>/g, "")
  }

  const dir = path.join(out, page.path)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, "index.html"), html)
  console.log(`prerender: ${page.path} ${(html.length / 1024).toFixed(1)} kB`)
}

await writeFile(path.join(out, "llms.txt"), server.llmsTxt())
await writeFile(path.join(out, "sitemap.xml"), server.sitemap())
console.log("prerender: llms.txt and sitemap.xml written")
