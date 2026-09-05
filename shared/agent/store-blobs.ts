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

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await blobs().get(key, { type: "text" })
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

async function writeJson(key: string, value: unknown) {
  await blobs().set(key, JSON.stringify(value))
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
