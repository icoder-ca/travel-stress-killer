import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchCursorBrief } from '../server/cursorApi'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const query = (req.body as { query?: string })?.query?.trim()
  if (!query) {
    res.status(400).json({ error: 'Enter a flight number or destination' })
    return
  }

  const apiKey = process.env.CURSOR_API_KEY
  if (!apiKey && !process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
    res.status(503).json({ error: 'API keys not configured on the server.' })
    return
  }

  try {
    const brief = await fetchCursorBrief(apiKey ?? '', query)
    const source = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY ? 'fast' : 'cursor'
    res.status(200).json({ brief, source })
  } catch (err) {
    res.status(502).json({
      error: err instanceof Error ? err.message : 'Failed to generate travel brief',
    })
  }
}

export const config = {
  maxDuration: 60,
}
