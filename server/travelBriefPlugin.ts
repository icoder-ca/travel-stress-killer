import type { Plugin } from 'vite'
import { fetchCursorBrief } from './cursorApi'

function briefHandler(apiKey: string | undefined) {
  return async (
    req: import('http').IncomingMessage,
    res: import('http').ServerResponse,
    next: () => void,
  ) => {
    if (req.method !== 'POST') return next()

    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', async () => {
      try {
        const { query } = JSON.parse(body || '{}') as { query?: string }
        if (!query?.trim()) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Enter a flight number or destination' }))
          return
        }

        if (!apiKey && !process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'Add CURSOR_API_KEY or OPENAI_API_KEY to .env and restart.',
            }),
          )
          return
        }

        const brief = await fetchCursorBrief(apiKey ?? '', query.trim())
        const source = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY ? 'fast' : 'cursor'
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ brief, source }))
      } catch (err) {
        res.statusCode = 502
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error: err instanceof Error ? err.message : 'Failed to generate travel brief',
          }),
        )
      }
    })
  }
}

export function travelBriefPlugin(apiKey?: string): Plugin {
  const handler = briefHandler(apiKey)
  return {
    name: 'travel-brief-api',
    configureServer(server) {
      server.middlewares.use('/api/brief', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/brief', handler)
    },
  }
}
