/**
 * The redaction and prompt-injection checks from agent-harness-sdk, ported
 * line for line from agent_harness_sdk/guardrails.py so the page can run them
 * on whatever a visitor types. Same patterns, same order, same replacements.
 */

const SECRET_PATTERNS: [RegExp, string][] = [
  [/AKIA[0-9A-Z]{16}/g, "<aws-access-key>"],
  [/eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}/g, "<jwt>"],
  [/\b(bearer)\s+[\w.~+/-]{16,}=*/gi, "$1 <token>"],
  [/\b(password|passwd|secret|api[_-]?key|token|x-api-key)\b("?\s*[=:]\s*"?)[^\s"',;}]+/gi, "$1$2<redacted>"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g, "<private-key>"],
  [/\bpat\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, "<harness-pat>"],
  [/\b(?:\d[ -]?){13,16}\b/g, "<card-number>"],
]

const INJECTION =
  /(ignore (all |any )?(previous|prior|above) (instructions|prompts)|you are now|system (prompt|override)|disregard .{0,30}(rules|instructions)|reveal .{0,20}(prompt|secrets?)|kubectl (delete|exec|apply)|rm -rf|drop table|curl [^ ]+ \| ?(sh|bash))/i

export type Guarded = {
  /** What the model is allowed to see. */
  safe: string
  /** How many secrets were masked. */
  redactions: number
  /** The phrase that looked like an instruction, if any. */
  injection: string | null
}

export function guard(text: string): Guarded {
  let safe = text
  let redactions = 0
  for (const [rx, repl] of SECRET_PATTERNS) {
    safe = safe.replace(rx, (...args) => {
      redactions++
      const groups = args.slice(1, -2) as string[]
      return repl.replace(/\$(\d)/g, (_, n) => groups[Number(n) - 1] ?? "")
    })
  }
  const m = INJECTION.exec(text)
  return { safe, redactions, injection: m ? m[0] : null }
}
