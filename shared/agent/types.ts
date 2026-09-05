/** Shared types for the knowledge collection and the question queue. */

export type Entry = {
  id: string
  /** What a visitor might ask. Used for retrieval. */
  question: string
  /** Debanjan's answer, in his own words. */
  answer: string
  /** Extra keywords to help retrieval find this entry. */
  tags: string[]
  source: "profile" | "debanjan"
  createdAt: string
  updatedAt: string
}

export type Pending = {
  id: string
  question: string
  /** Full visitor conversation leading to the question, for context. */
  context: string[]
  /** Optional - only if the visitor volunteered it. */
  askerEmail?: string
  status: "open" | "notified" | "answered" | "dismissed"
  createdAt: string
  notifiedAt?: string
  answeredAt?: string
  answer?: string
  /** Single-use token embedded in the digest link. */
  token: string
}

/**
 * Storage the agent needs. Netlify Blobs in production, a JSON file in dev -
 * the orchestrator does not know or care which.
 */
export interface Store {
  listEntries(): Promise<Entry[]>
  putEntry(entry: Entry): Promise<void>

  listPending(): Promise<Pending[]>
  getPending(id: string): Promise<Pending | null>
  putPending(p: Pending): Promise<void>
}
