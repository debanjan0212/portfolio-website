import type { Entry } from "./types"

/**
 * Keyword retrieval over the collection.
 *
 * Deliberately not embeddings: this collection is small (tens to low hundreds
 * of entries), an embedding call would add latency and cost to every single
 * message, and BM25-ish scoring over a small corpus is more than good enough.
 * If the collection ever passes ~500 entries, revisit.
 */

const STOP = new Set([
  "a","an","and","are","as","at","be","but","by","can","did","do","does","for","from","had","has",
  "have","he","her","him","his","how","i","in","is","it","its","of","on","or","that","the","their",
  "them","there","they","this","to","was","were","what","when","where","which","who","why","will",
  "with","you","your","about","tell","me","please","would","could","should","much","many","any",
])

export function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
}

/** Light stemming so "migrations" matches "migration". */
function stem(t: string): string {
  return t.replace(/(ing|ed|es|s)$/, "")
}

export type Scored = { entry: Entry; score: number }

export function retrieve(query: string, entries: Entry[], limit = 6): Scored[] {
  const qTokens = tokenise(query).map(stem)
  if (qTokens.length === 0) return []

  const N = entries.length || 1

  // Document frequency, so common words across the collection count for less.
  const df = new Map<string, number>()
  const docTokens = entries.map((e) => {
    const toks = new Set(
      [...tokenise(e.question), ...tokenise(e.answer), ...e.tags.flatMap(tokenise)].map(stem),
    )
    toks.forEach((t) => df.set(t, (df.get(t) || 0) + 1))
    return toks
  })

  const scored = entries.map((entry, i) => {
    let score = 0
    for (const q of qTokens) {
      if (!docTokens[i].has(q)) continue
      const idf = Math.log(1 + N / (1 + (df.get(q) || 0)))
      // Question matches are worth more than body matches.
      const inQuestion = tokenise(entry.question).map(stem).includes(q)
      score += idf * (inQuestion ? 2.2 : 1)
    }
    return { entry, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Whether retrieval found enough to be worth answering from. Below this the
 * orchestrator escalates to Debanjan instead of letting the model improvise.
 */
export function hasUsableContext(scored: Scored[]): boolean {
  return scored.length > 0 && scored[0].score >= 1.1
}
