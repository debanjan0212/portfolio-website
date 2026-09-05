import { mkdir, readFile, writeFile } from "fs/promises"
import { dirname, join } from "path"
import type { Entry, Pending, Store } from "./types"

/**
 * Dev adapter: the same Store contract, backed by a gitignored JSON file, so
 * `npm run dev` exercises the real orchestrator rather than a stub.
 */

const DIR = join(process.cwd(), ".agent-data")
const ENTRIES = join(DIR, "entries.json")
const PENDING = join(DIR, "pending.json")

async function read<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T
  } catch {
    return fallback
  }
}

async function write(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(value, null, 2))
}

export const fileStore: Store = {
  async listEntries() {
    return read<Entry[]>(ENTRIES, [])
  },
  async putEntry(entry) {
    const all = await read<Entry[]>(ENTRIES, [])
    const i = all.findIndex((e) => e.id === entry.id)
    if (i >= 0) all[i] = entry
    else all.push(entry)
    await write(ENTRIES, all)
  },
  async listPending() {
    return read<Pending[]>(PENDING, [])
  },
  async getPending(id) {
    const all = await read<Pending[]>(PENDING, [])
    return all.find((p) => p.id === id) ?? null
  },
  async putPending(p) {
    const all = await read<Pending[]>(PENDING, [])
    const i = all.findIndex((x) => x.id === p.id)
    if (i >= 0) all[i] = p
    else all.push(p)
    await write(PENDING, all)
  },
}
