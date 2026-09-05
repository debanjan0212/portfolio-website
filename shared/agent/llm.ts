/**
 * Provider-agnostic LLM call.
 *
 * The orchestrator does not care who serves the model. Set one key and the
 * provider is picked automatically:
 *
 *   GEMINI_API_KEY     -> Google Gemini      (genuinely free tier, no card)
 *   GROQ_API_KEY       -> Groq               (free tier, very fast)
 *   OPENAI_API_KEY     -> OpenAI             (no free tier, paid only)
 *   ANTHROPIC_API_KEY  -> Anthropic          (no free tier, paid only)
 *
 * Set LLM_PROVIDER explicitly to override the order.
 */

export type Provider = "gemini" | "groq" | "openai" | "anthropic"

export type LlmConfig = { provider: Provider; apiKey: string; model: string }

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-4-5",
}

/** Free tiers first, so an unconfigured site costs nothing by default. */
const ORDER: Provider[] = ["gemini", "groq", "openai", "anthropic"]

const KEY_ENV: Record<Provider, string> = {
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
}

export function resolveConfig(env: Record<string, string | undefined>): LlmConfig | null {
  const forced = env.LLM_PROVIDER as Provider | undefined
  const order = forced && ORDER.includes(forced) ? [forced] : ORDER

  for (const provider of order) {
    const apiKey = env[KEY_ENV[provider]]
    if (apiKey) {
      return { provider, apiKey, model: env.AGENT_MODEL || DEFAULT_MODEL[provider] }
    }
  }
  return null
}

export type Msg = { role: "user" | "assistant"; content: string }

/**
 * One text completion. Returns the model's reply as a plain string - streaming
 * is handled by the orchestrator, which needs the whole reply anyway so it can
 * check for NEEDS_DEBANJAN before showing anything.
 */
export async function complete({
  config,
  system,
  messages,
  maxTokens = 700,
}: {
  config: LlmConfig
  system: string
  messages: Msg[]
  maxTokens?: number
}): Promise<string> {
  switch (config.provider) {
    case "gemini":
      return gemini(config, system, messages, maxTokens)
    case "anthropic":
      return anthropic(config, system, messages, maxTokens)
    case "groq":
    case "openai":
      return openaiCompatible(config, system, messages, maxTokens)
  }
}

async function fail(res: Response, provider: string): Promise<never> {
  const detail = await res.text().catch(() => "")
  throw new Error(`${provider} ${res.status}: ${detail.slice(0, 300)}`)
}

async function gemini(
  cfg: LlmConfig,
  system: string,
  messages: Msg[],
  maxTokens: number,
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": cfg.apiKey },
      body: JSON.stringify({
        // Gemini keeps the system prompt separate, like Anthropic does.
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.3 },
      }),
    },
  )
  if (!res.ok) await fail(res, "gemini")

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  return (data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "").trim()
}

async function anthropic(
  cfg: LlmConfig,
  system: string,
  messages: Msg[],
  maxTokens: number,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": cfg.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: cfg.model, max_tokens: maxTokens, system, messages }),
  })
  if (!res.ok) await fail(res, "anthropic")

  const data = (await res.json()) as { content?: { text?: string }[] }
  return (data.content?.[0]?.text || "").trim()
}

/** Groq and OpenAI both speak the OpenAI chat-completions shape. */
async function openaiCompatible(
  cfg: LlmConfig,
  system: string,
  messages: Msg[],
  maxTokens: number,
): Promise<string> {
  const base =
    cfg.provider === "groq"
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions"

  const res = await fetch(base, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: maxTokens,
      temperature: 0.3,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  })
  if (!res.ok) await fail(res, cfg.provider)

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  return (data.choices?.[0]?.message?.content || "").trim()
}
