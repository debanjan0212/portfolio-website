/**
 * Live repository facts, straight from the GitHub API.
 *
 * The site never hard-codes "tests passing" or "scan clean". It asks GitHub
 * and shows what GitHub says, so a red build shows up red here too. If GitHub
 * cannot be reached the caller falls back to dates only and says so.
 *
 * A workflow is found by its name: `ci` is tests and evals, `security` is the
 * scan. A repo with no `security` workflow simply has no scan to show.
 */

export const OWNER = "debanjan0212"
export const REPOS = ["argus-sre-agent", "intentops", "agent-harness-sdk", "portfolio-website"] as const
export type RepoName = (typeof REPOS)[number]

export type RunState = "passing" | "failing" | "running" | "unknown"
export type Run = { state: RunState; url: string; at: string }

export type RepoLive = {
  name: RepoName
  url: string
  pushedAt: string | null
  stars: number | null
  ci: Run | null
  security: Run | null
}

export type LivePayload = { source: "live" | "snapshot"; fetchedAt: string; repos: RepoLive[] }

type Fetch = (url: string, init?: { headers?: Record<string, string> }) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>

type GhRun = { name?: string; path?: string; status?: string; conclusion?: string | null; html_url?: string; updated_at?: string }

export function runState(run: GhRun): RunState {
  if (run.status && run.status !== "completed") return "running"
  if (run.conclusion === "success") return "passing"
  if (run.conclusion === "failure" || run.conclusion === "timed_out" || run.conclusion === "startup_failure") return "failing"
  return "unknown"
}

/** Newest run of the workflow whose name or file is `wanted`. Runs arrive newest first. */
export function latestRun(runs: GhRun[], wanted: string): Run | null {
  const hit = runs.find((r) => {
    const name = (r.name || "").toLowerCase()
    const file = (r.path || "").toLowerCase()
    return name === wanted || file.endsWith(`/${wanted}.yml`) || file.endsWith(`/${wanted}.yaml`)
  })
  if (!hit) return null
  return { state: runState(hit), url: hit.html_url || "", at: hit.updated_at || "" }
}

async function getJson(fetchFn: Fetch, url: string, token?: string): Promise<unknown | null> {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "debanjansre.online",
  }
  if (token) headers.authorization = `Bearer ${token}`
  try {
    const res = await fetchFn(url, { headers })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

export async function fetchRepo(fetchFn: Fetch, name: RepoName, token?: string): Promise<RepoLive | null> {
  const base = `https://api.github.com/repos/${OWNER}/${name}`
  const [repo, runs] = await Promise.all([
    getJson(fetchFn, base, token) as Promise<{ pushed_at?: string; stargazers_count?: number; html_url?: string } | null>,
    getJson(fetchFn, `${base}/actions/runs?branch=main&per_page=30`, token) as Promise<{ workflow_runs?: GhRun[] } | null>,
  ])
  if (!repo) return null
  const list = runs?.workflow_runs ?? []
  return {
    name,
    url: repo.html_url || `https://github.com/${OWNER}/${name}`,
    pushedAt: repo.pushed_at ?? null,
    stars: typeof repo.stargazers_count === "number" ? repo.stargazers_count : null,
    ci: latestRun(list, "ci"),
    security: latestRun(list, "security"),
  }
}

/** Last-known dates only. Used when GitHub cannot be reached; never claims a build state. */
export const SNAPSHOT: LivePayload = {
  source: "snapshot",
  fetchedAt: "2026-11-16T00:00:00Z",
  repos: [
    { name: "argus-sre-agent", url: `https://github.com/${OWNER}/argus-sre-agent`, pushedAt: "2026-11-07T00:00:00Z", stars: null, ci: null, security: null },
    { name: "intentops", url: `https://github.com/${OWNER}/intentops`, pushedAt: "2026-11-07T00:00:00Z", stars: null, ci: null, security: null },
    { name: "agent-harness-sdk", url: `https://github.com/${OWNER}/agent-harness-sdk`, pushedAt: "2026-11-07T00:00:00Z", stars: null, ci: null, security: null },
    { name: "portfolio-website", url: `https://github.com/${OWNER}/portfolio-website`, pushedAt: null, stars: null, ci: null, security: null },
  ],
}

export async function fetchAll(fetchFn: Fetch, token?: string): Promise<LivePayload> {
  const got = await Promise.all(REPOS.map((r) => fetchRepo(fetchFn, r, token)))
  // one repo failing must not blank the others: fill the gap from the snapshot
  const repos = REPOS.map((name, i) => got[i] ?? SNAPSHOT.repos.find((s) => s.name === name)!)
  const anyLive = got.some(Boolean)
  return { source: anyLive ? "live" : "snapshot", fetchedAt: new Date().toISOString(), repos }
}
