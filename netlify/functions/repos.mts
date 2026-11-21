import type { Config } from "@netlify/functions"
import { fetchAll } from "../../shared/live/github"

/**
 * GET /api/repos - live build and scan state for the open-source repos.
 *
 * Cached at the edge for 15 minutes and served stale for a day while it
 * refreshes, so visitors never wait on GitHub.
 *
 * Set GITHUB_TOKEN in Netlify (a fine-grained token with "Public repositories
 * (read-only)" and no other permission). Without it GitHub allows 60 requests
 * an hour per IP address, and functions share their addresses with other
 * sites, so the limit is often already used up. When a lookup fails the site
 * shows dates only and says GitHub could not be reached.
 */
export default async () => {
  const payload = await fetchAll(fetch as never, process.env.GITHUB_TOKEN)
  // a failed lookup is kept for a minute only, so the next visitor retries instead of inheriting it
  const edge = payload.source === "live" ? "public, s-maxage=900, stale-while-revalidate=86400" : "public, s-maxage=60"
  return Response.json(payload, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "netlify-cdn-cache-control": edge,
    },
  })
}

export const config: Config = { path: "/api/repos", method: "GET" }
