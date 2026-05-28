# Travel Stress Killer

AI travel copilot built at the **Cursor Calgary Meetup**. Enter a flight number or destination and get a skimable pre-landing brief — flight, weather, timezone, terminal, packing, destinations, activities, roaming, and AeroSIM.

## Quick start

```bash
git clone <your-repo-url>
cd travel-stress-killer
npm install
cp .env.example .env
# Add your API keys to .env (never commit this file)
npm run dev
```

Open http://localhost:5173

## API keys (server-side only)

Keys live in `.env` and are **never** sent to the browser. Add at least one:

| Variable | Purpose | Speed |
|----------|---------|-------|
| `OPENAI_API_KEY` | Fast AI briefs (recommended for demo) | ~3–8s |
| `GROQ_API_KEY` | Free fast alternative ([console.groq.com](https://console.groq.com)) | ~3–8s |
| `CURSOR_API_KEY` | Cursor Cloud Agents ([dashboard](https://cursor.com/dashboard/integrations)) | ~30–60s |

Get keys from [Cursor Integrations](https://cursor.com/dashboard/integrations).

## Demo flow

1. Click a quick pick or type a destination
2. **Instant preview** appears in under 1 second
3. AI upgrades the brief in the background when an API key is configured

## Stack

- Vite + React + TypeScript
- Apple SF Symbols (`@bradleyhodges/sfsymbols-react`)
- Cursor Cloud Agents API + optional OpenAI/Groq for speed
- AeroSIM branding — [aerosim.global](https://www.aerosim.global)

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run preview  # preview production build
```

## Security

- `.env` is gitignored
- API routes run only on the Vite dev/preview server middleware
- For production deploy, use environment variables on your host — do not embed keys in client code

## License

MIT — meetup submission project.
