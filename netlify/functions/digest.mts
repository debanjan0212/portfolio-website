import type { Config } from "@netlify/functions"
import { buildAndSendDigest } from "../../shared/agent/digest"
import { blobStore } from "../../shared/agent/store-blobs"

/**
 * Scheduled nightly at 23:00 IST. Netlify cron is UTC and IST is UTC+5:30,
 * so 23:00 IST is 17:30 UTC the same day.
 */
export default async () => {
  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.DIGEST_TO
  const siteUrl = process.env.SITE_URL || process.env.URL || ""

  if (!resendKey || !to || !siteUrl) {
    console.warn("digest skipped: RESEND_API_KEY, DIGEST_TO or SITE_URL missing")
    return new Response("not configured", { status: 200 })
  }

  const result = await buildAndSendDigest({
    store: blobStore,
    siteUrl,
    resendKey,
    to,
    from: process.env.DIGEST_FROM || "Portfolio Agent <onboarding@resend.dev>",
  })

  console.log(`digest: sent=${result.sent} count=${result.count}`)
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  })
}

export const config: Config = { schedule: "30 17 * * *" }
