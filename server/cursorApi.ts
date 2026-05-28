import type { TravelBrief } from './types'
import { buildPrompt } from './prompt'
import { parseBriefJson } from './parseBrief'
import { fetchFastLlmBrief } from './fastLlm'

const API = 'https://api.cursor.com/v1'

function authHeader(apiKey: string) {
  return { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` }
}

/**
 * Fastest path first:
 * 1. OpenAI/Groq direct chat (~3–8s) if keys in .env
 * 2. Cursor Cloud Agent (~30–60s) — slow but uses CURSOR_API_KEY
 */
export async function fetchCursorBrief(apiKey: string, query: string): Promise<TravelBrief> {
  const fast = await fetchFastLlmBrief(query)
  if (fast) return fast

  const cloud = await fetchCloudBrief(apiKey, query)
  if ('brief' in cloud) return cloud.brief

  throw new Error(cloud.error)
}

async function fetchCloudBrief(
  apiKey: string,
  query: string,
  timeoutMs = 55000,
): Promise<{ brief: TravelBrief } | { error: string }> {
  const headers = {
    ...authHeader(apiKey),
    'Content-Type': 'application/json',
  }

  let createRes: Response
  try {
    createRes = await fetch(`${API}/agents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: `Travel-${query.slice(0, 40)}`,
        prompt: { text: buildPrompt(query) },
        model: { id: 'composer-2', params: [{ id: 'fast', value: 'true' }] },
      }),
      signal: AbortSignal.timeout(15000),
    })
  } catch (e) {
    return { error: `Cursor API unreachable: ${e instanceof Error ? e.message : 'network'}` }
  }

  if (!createRes.ok) {
    const body = await createRes.text().catch(() => '')
    return { error: `Cursor API ${createRes.status}: ${body.slice(0, 150)}` }
  }

  const created = (await createRes.json()) as {
    agent?: { id: string }
    run?: { id: string }
  }

  const agentId = created.agent?.id
  const runId = created.run?.id
  if (!agentId || !runId) return { error: 'Cursor API returned no agent/run id' }

  const brief = await pollUntilBrief(apiKey, agentId, runId, timeoutMs)
  if (brief) return { brief }

  return { error: 'Cursor agent timed out — add OPENAI_API_KEY to .env for ~5s briefs' }
}

async function pollUntilBrief(
  apiKey: string,
  agentId: string,
  runId: string,
  timeoutMs: number,
): Promise<TravelBrief | null> {
  const deadline = Date.now() + timeoutMs
  await sleep(300)

  while (Date.now() < deadline) {
    try {
      const runRes = await fetch(`${API}/agents/${agentId}/runs/${runId}`, {
        headers: authHeader(apiKey),
        signal: AbortSignal.timeout(8000),
      })

      if (runRes.ok) {
        const run = (await runRes.json()) as { status: string; result?: string }
        if (run.status === 'FINISHED' && run.result) {
          const brief = parseBriefJson(run.result)
          if (brief) return brief
        }
        if (['ERROR', 'CANCELLED', 'EXPIRED'].includes(run.status)) return null
      }
    } catch {
      /* retry */
    }
    await sleep(600)
  }
  return null
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
