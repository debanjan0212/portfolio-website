import assert from "node:assert/strict"
import { test } from "node:test"
import { fetchAll, latestRun, runState, REPOS } from "../shared/live/github"

test("runState maps GitHub's status and conclusion to one word", () => {
  assert.equal(runState({ status: "completed", conclusion: "success" }), "passing")
  assert.equal(runState({ status: "completed", conclusion: "failure" }), "failing")
  assert.equal(runState({ status: "in_progress", conclusion: null }), "running")
  assert.equal(runState({ status: "completed", conclusion: "cancelled" }), "unknown")
})

test("latestRun finds a workflow by name or file, newest first", () => {
  const runs = [
    { name: "security", path: ".github/workflows/security.yml", status: "completed", conclusion: "failure", html_url: "u2", updated_at: "2026-11-16T00:00:00Z" },
    { name: "ci", path: ".github/workflows/ci.yml", status: "completed", conclusion: "success", html_url: "u1", updated_at: "2026-11-15T00:00:00Z" },
    { name: "security", path: ".github/workflows/security.yml", status: "completed", conclusion: "success", html_url: "u0", updated_at: "2026-11-14T00:00:00Z" },
  ]
  assert.deepEqual(latestRun(runs, "ci"), { state: "passing", url: "u1", at: "2026-11-15T00:00:00Z" })
  // the newest security run failed: the site must say failing, not fall back to the older green one
  assert.equal(latestRun(runs, "security")?.state, "failing")
  assert.equal(latestRun(runs, "deploy"), null)
  assert.equal(latestRun([{ name: "Security Scan", path: ".github/workflows/security.yaml", status: "completed", conclusion: "success" }], "security")?.state, "passing")
})

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body })

test("fetchAll reports live data and never invents a scan that does not exist", async () => {
  const fake = async (url: string) => {
    if (url.endsWith("/actions/runs?branch=main&per_page=30")) return ok({ workflow_runs: [{ name: "ci", status: "completed", conclusion: "success", html_url: "run", updated_at: "2026-11-15T00:00:00Z" }] })
    return ok({ pushed_at: "2026-11-07T10:00:00Z", stargazers_count: 2, html_url: "repo" })
  }
  const out = await fetchAll(fake)
  assert.equal(out.source, "live")
  assert.equal(out.repos.length, REPOS.length)
  for (const r of out.repos) {
    assert.equal(r.ci?.state, "passing")
    assert.equal(r.security, null)
  }
})

test("fetchAll degrades to dates only when GitHub is down, and claims no build state", async () => {
  const down = async () => {
    throw new Error("network")
  }
  const out = await fetchAll(down)
  assert.equal(out.source, "snapshot")
  assert.ok(out.repos.every((r) => r.ci === null && r.security === null))
})

test("one failing repo does not blank the others", async () => {
  const flaky = async (url: string) => {
    if (url.includes("/intentops")) return { ok: false, status: 403, json: async () => ({}) }
    if (url.includes("/actions/runs")) return ok({ workflow_runs: [] })
    return ok({ pushed_at: "2026-11-07T10:00:00Z", stargazers_count: 1, html_url: "repo" })
  }
  const out = await fetchAll(flaky)
  assert.equal(out.source, "live")
  assert.equal(out.repos.find((r) => r.name === "intentops")?.ci, null)
  assert.equal(out.repos.find((r) => r.name === "argus-sre-agent")?.stars, 1)
})
