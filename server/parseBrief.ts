import type { TravelBrief } from './types'

export function toBullets(value: unknown, max = 4): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').slice(0, max)
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[.!?]\s+|\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, max)
  }
  return []
}

function objectToBullets(obj: unknown, keys: string[]): string[] {
  if (!obj || typeof obj !== 'object') return []
  const record = obj as Record<string, string>
  return keys.map((k) => record[k]).filter((v) => typeof v === 'string' && v.trim())
}

const ROAMING_COST = '$16-$18/day'
const AEROSIM_CTA = 'Get your eSIM from AeroSIM on iOS'

/** Enforce $16-$18/day wording and AeroSIM iOS CTA in roaming bullets */
export function normalizeRoamingBullets(bullets: string[]): string[] {
  const esimCta = AEROSIM_CTA
  const defaultRoaming = `Canadian carriers charge ${ROAMING_COST} roaming`

  let costLine =
    bullets.find((b) => !/aerosim|esim|ios/i.test(b)) ?? bullets[0] ?? defaultRoaming

  costLine = costLine
    .replace(/\$?\s*16\s*[–—-]\s*18\s*(\/\s*)?day/gi, ROAMING_COST)
    .replace(/~\s*\$16-\$18\/day/gi, ROAMING_COST)
    .replace(/\b(sixteen|eighteen)(\s+to\s+(sixteen|eighteen))?/gi, ROAMING_COST)
    .replace(/\$50[^.]*day/gi, ROAMING_COST)

  if (!costLine.includes(ROAMING_COST)) {
    costLine = defaultRoaming
  }

  return [costLine, esimCta]
}

export function normalizeBrief(raw: Record<string, unknown>): TravelBrief | null {
  const destination = typeof raw.destination === 'string' ? raw.destination : ''
  const headline = typeof raw.headline === 'string' ? raw.headline : ''
  if (!destination) return null

  const weatherRaw = raw.weather as Record<string, string> | undefined
  const flightBullets = toBullets(raw.flightBullets ?? raw.flightSummary, 4)
  const timezoneBullets =
    toBullets(raw.timezoneBullets, 3).length > 0
      ? toBullets(raw.timezoneBullets, 3)
      : objectToBullets(raw.timezone, ['offset', 'local', 'jetLagTip'])
  const terminalBullets =
    toBullets(raw.terminalBullets, 3).length > 0
      ? toBullets(raw.terminalBullets, 3)
      : objectToBullets(raw.terminal, ['airport', 'terminal', 'gateTip'])

  return {
    destination,
    headline,
    flightBullets,
    weather: {
      temp: weatherRaw?.temp ?? '—',
      condition: weatherRaw?.condition ?? '—',
      tip: weatherRaw?.tip ?? '',
    },
    timezoneBullets,
    terminalBullets,
    destinationSuggestions: toBullets(
      raw.destinationSuggestions ?? raw.destinations ?? raw.placesToVisit,
      5,
    ),
    activitySuggestions: toBullets(
      raw.activitySuggestions ?? raw.activities ?? raw.thingsToDo,
      5,
    ),
    packing: toBullets(raw.packing, 6),
    localTips: toBullets(raw.localTips, 5),
    roamingBullets: normalizeRoamingBullets(
      toBullets(raw.roamingBullets ?? raw.roamingWarning, 3),
    ),
  }
}

export function parseBriefJson(text: string): TravelBrief | null {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    const parsed = JSON.parse(match[0]) as Record<string, unknown>
    const brief = normalizeBrief(parsed)
    if (!brief) return null
    const hasContent =
      brief.flightBullets.length > 0 ||
      brief.terminalBullets.length > 0 ||
      brief.destinationSuggestions.length > 0 ||
      brief.activitySuggestions.length > 0 ||
      brief.localTips.length > 0
    if (!hasContent) return null
    return brief
  } catch {
    return null
  }
}

export function tryParsePartialJson(text: string): TravelBrief | null {
  const start = text.indexOf('{')
  if (start === -1) return null
  let slice = text.slice(start)
  const end = slice.lastIndexOf('}')
  if (end === -1) return null
  slice = slice.slice(0, end + 1)
  return parseBriefJson(slice)
}
