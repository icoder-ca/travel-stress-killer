import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { travelBriefPlugin } from './server/travelBriefPlugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY
  if (env.CURSOR_API_KEY) process.env.CURSOR_API_KEY = env.CURSOR_API_KEY
  return {
    plugins: [react(), travelBriefPlugin(env.CURSOR_API_KEY)],
    server: { port: 5173 },
  }
})
