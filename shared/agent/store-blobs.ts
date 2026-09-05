import { getStore } from "@netlify/blobs"
import type { Entry, Pending, Store } from "./types"

/**
 * Netlify Blobs adapter. No account, no connection string, no cost at this
 * traffic - it ships with the platform.
 *
 * Entries and pending questions are each kept as one JSON document rather than
 * a blob per record: the collection is small, and one read per request beats
 * N list+get round trips.
 */

const ENTRIES_KEY = "entries.json"
const PENDING_KEY = "pending.json"

function blobs() {
  return getStore({ name: "agent-knowledge", consistency: "strong" })
}

/**
 * Storage being unavailable must not take the assistant down. If a write
 * fails the site loses the learning loop for that request - bad, but far
 * better than answering every visitor with an error. Reads already fall back
 * to an empty collection, so the agent simply answers from the profile.
 */
function warn(op: string, err: unknown) {
  console.error(`blob ${op} failed:`, err instanceof Error ? err.message : err)
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await blobs().get(key, { type: "text" })
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch (err) {
    warn(`get ${key}`, err)
    return fallback
  }
}

async function writeJson(key: string, value: unknown): Promise<boolean> {
  try {
    await blobs().set(key, JSON.stringify(value))
    return true
  } catch (err) {
    warn(`set ${key}`, err)
    return false
  }
}

export const blobStore: Store = {
  async listEntries() {
    return readJson<Entry[]>(ENTRIES_KEY, [])
  },

  async putEntry(entry) {
    const all = await readJson<Entry[]>(ENTRIES_KEY, [])
    const i = all.findIndex((e) => e.id === entry.id)
    if (i >= 0) all[i] = entry
    else all.push(entry)
    await writeJson(ENTRIES_KEY, all)
  },

  async listPending() {
    return readJson<Pending[]>(PENDING_KEY, [])
  },

  async getPending(id) {
    const all = await readJson<Pending[]>(PENDING_KEY, [])
    return all.find((p) => p.id === id) ?? null
  },

  async putPending(p) {
    const all = await readJson<Pending[]>(PENDING_KEY, [])
    const i = all.findIndex((x) => x.id === p.id)
    if (i >= 0) all[i] = p
    else all.push(p)
    await writeJson(PENDING_KEY, all)
  },
}
