import { useEffect, useState } from "react"
import { SNAPSHOT, type LivePayload, type RepoLive, type RepoName } from "@shared/live/github"

export type { RepoLive, RepoName, Run, RunState } from "@shared/live/github"

let pending: Promise<LivePayload> | null = null

function load(): Promise<LivePayload> {
  pending ??= fetch("/api/repos", { headers: { accept: "application/json" } })
    .then(async (res) => {
      // a host without the function answers with the page shell: treat that as "no live data"
      if (!res.ok || !(res.headers.get("content-type") || "").includes("json")) return SNAPSHOT
      const data = (await res.json()) as LivePayload
      return Array.isArray(data?.repos) ? data : SNAPSHOT
    })
    .catch(() => SNAPSHOT)
  return pending
}

/**
 * Live repo state. Starts from the snapshot so nothing on the page waits or jumps.
 * `settled` turns true once GitHub has answered or failed: until then the page
 * is still asking, which is not the same as "could not be reached".
 */
export function useLive() {
  const [data, setData] = useState<LivePayload>(SNAPSHOT)
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    let alive = true
    load().then((d) => {
      if (!alive) return
      setData(d)
      setSettled(true)
    })
    return () => {
      alive = false
    }
  }, [])
  const repo = (name: RepoName): RepoLive => data.repos.find((r) => r.name === name) ?? SNAPSHOT.repos.find((r) => r.name === name)!
  return { ...data, repo, settled }
}

/** The current time, but only once the page is live in a browser. Null in the prerendered HTML. */
export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => setNow(Date.now()), [])
  return now
}

/**
 * "3 days ago", from an ISO date. Without `now` (the prerendered HTML) it
 * gives the plain date instead, so build output never goes stale.
 */
export function ago(iso: string | null | undefined, now: number | null): string {
  if (!iso) return ""
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ""
  if (now == null) return `on ${new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`
  const s = Math.max(0, (now - t) / 1000)
  if (s < 90) return "just now"
  const steps: [number, string][] = [
    [3600, "minute"],
    [86400, "hour"],
    [86400 * 30, "day"],
    [86400 * 365, "month"],
    [Infinity, "year"],
  ]
  const div = [60, 3600, 86400, 86400 * 30, 86400 * 365]
  for (let i = 0; i < steps.length; i++) {
    if (s < steps[i][0]) {
      const n = Math.max(1, Math.floor(s / div[i]))
      return `${n} ${steps[i][1]}${n === 1 ? "" : "s"} ago`
    }
  }
  return ""
}
