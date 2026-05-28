import { buildPrompt } from './prompt'
import { parseBriefJson } from './parseBrief'
import type { TravelBrief } from './types'

/** Direct chat API — typically 3–8s vs 30–60s for Cloud Agents */
export async function fetchFastLlmBrief(query: string): Promise<TravelBrief | null> {
  const openai = process.env.OPENAI_API_KEY
  if (openai) {
    const brief = await chatCompletion(
      openai,
      'https://api.openai.com/v1/chat/completions',
      'gpt-4o-mini',
      query,
    )
    if (brief) return brief
  }

  const groq = process.env.GROQ_API_KEY
  if (groq) {
    const brief = await chatCompletion(
      groq,
      'https://api.groq.com/openai/v1/chat/completions',
      'llama-3.1-8b-instant',
      query,
    )
    if (brief) return brief
  }

  return null
}

async function chatCompletion(
  apiKey: string,
  url: string,
  model: string,
  query?: string,
): Promise<TravelBrief | null> {
  const q = query ?? ''
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: buildPrompt(q) }],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 1200,
      }),
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) return null

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const text = data.choices?.[0]?.message?.content
    if (!text) return null
    return parseBriefJson(text)
  } catch {
    return null
  }
}
