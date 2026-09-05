import type { Pending, Store } from "./types"

/**
 * Nightly digest. Collects every question the agent could not answer, sends
 * one email, and marks them notified so they are never sent twice.
 *
 * If there is nothing open, no email is sent at all.
 */

export async function buildAndSendDigest({
  store,
  siteUrl,
  resendKey,
  to,
  from,
}: {
  store: Store
  siteUrl: string
  resendKey: string
  to: string
  from: string
}): Promise<{ sent: boolean; count: number }> {
  const all = await store.listPending()
  const open = all.filter((p) => p.status === "open")

  if (open.length === 0) return { sent: false, count: 0 }

  const html = renderDigest(open, siteUrl)

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${resendKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${open.length} question${open.length === 1 ? "" : "s"} your site couldn't answer`,
      html,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`resend ${res.status}: ${detail.slice(0, 300)}`)
  }

  const now = new Date().toISOString()
  for (const p of open) {
    await store.putPending({ ...p, status: "notified", notifiedAt: now })
  }

  return { sent: true, count: open.length }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function renderDigest(open: Pending[], siteUrl: string): string {
  const items = open
    .map((p) => {
      const link = `${siteUrl}/answer?id=${encodeURIComponent(p.id)}&token=${encodeURIComponent(p.token)}`
      const asked = new Date(p.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      })
      return `
        <tr><td style="padding:0 0 22px 0;">
          <div style="border:1px solid #e4e4e7;border-radius:10px;padding:18px;">
            <p style="margin:0 0 10px;font:600 16px/1.45 -apple-system,Segoe UI,sans-serif;color:#18181b;">
              ${escapeHtml(p.question)}
            </p>
            <p style="margin:0 0 16px;font:400 12px/1.5 -apple-system,Segoe UI,sans-serif;color:#71717a;">
              Asked ${asked}${p.askerEmail ? ` &middot; ${escapeHtml(p.askerEmail)}` : ""}
            </p>
            <a href="${link}"
               style="display:inline-block;background:#0e7490;color:#fff;text-decoration:none;
                      padding:9px 18px;border-radius:999px;font:500 13px -apple-system,Segoe UI,sans-serif;">
              Answer this
            </a>
          </div>
        </td></tr>`
    })
    .join("")

  return `<!doctype html><html><body style="margin:0;padding:28px;background:#fafafa;">
    <table role="presentation" style="max-width:560px;margin:0 auto;width:100%;">
      <tr><td style="padding-bottom:22px;">
        <p style="margin:0 0 6px;font:600 19px -apple-system,Segoe UI,sans-serif;color:#18181b;">
          ${open.length} unanswered question${open.length === 1 ? "" : "s"}
        </p>
        <p style="margin:0;font:400 14px/1.55 -apple-system,Segoe UI,sans-serif;color:#52525b;">
          Your site's assistant couldn't answer these. Answer any of them and it
          will use your wording from that moment on — no redeploy needed.
        </p>
      </td></tr>
      ${items}
      <tr><td style="padding-top:10px;">
        <p style="margin:0;font:400 12px -apple-system,Segoe UI,sans-serif;color:#a1a1aa;">
          Sent because questions were queued. Quiet days get no email.
        </p>
      </td></tr>
    </table>
  </body></html>`
}
