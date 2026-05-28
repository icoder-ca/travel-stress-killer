import type { TravelBrief } from '../types'

type Template = Omit<TravelBrief, 'headline'> & { headline: string }

const TEMPLATES: Record<string, Template> = {
  tokyo: {
    destination: 'Tokyo, Japan',
    headline: 'Neon calm — your arrival playbook',
    flightBullets: ['Narita or Haneda — Haneda is faster to central Tokyo', 'Plan 60–90 min for immigration + bags', 'Buy Suica card at airport station'],
    weather: { temp: '24°C', condition: 'Humid, partly cloudy', tip: 'Light layers + compact umbrella' },
    timezoneBullets: ['JST UTC+9 · +15h from Calgary', 'Stay awake until 9pm local day one'],
    terminalBullets: ['Narita T1/T2 or Haneda T3', 'Follow JR signs to city'],
    destinationSuggestions: ['Shibuya Crossing & Sky', 'Senso-ji Asakusa', 'Meiji Shrine Harajuku', 'TeamLab Planets Toyosu'],
    activitySuggestions: ['Tsukiji outer market breakfast', 'Day trip Nikko shrines', 'Izakaya alley Omoide Yokocho', 'Last trains ~midnight'],
    packing: ['Universal adapter', 'Walking shoes', 'Cash ¥', 'Pocket umbrella', 'eSIM'],
    localTips: ['IC card for all transit', 'Quiet on trains', 'Konbini ATMs work'],
    roamingBullets: ['Roaming $12–15/day from Canada', 'AeroSIM eSIM before you fly'],
  },
  paris: {
    destination: 'Paris, France',
    headline: 'Bon voyage — CDG to the city',
    flightBullets: ['CDG Terminals 2E/2F for long-haul', 'RER B or Le Bus Direct to central', 'Clear security early for Schengen'],
    weather: { temp: '19°C', condition: 'Mild, showers possible', tip: 'Scarf + light rain shell' },
    timezoneBullets: ['CET UTC+1 · +8h from Calgary', 'Morning light helps jet lag'],
    terminalBullets: ['Charles de Gaulle (CDG)', 'Terminal 2E international'],
    destinationSuggestions: ['Louvre timed entry', 'Montmartre Sacré-Cœur', 'Le Marais walk', 'Versailles day trip'],
    activitySuggestions: ['Café + croissant culture', 'Seine evening cruise', 'Musée d\'Orsay half-day', 'Validate Metro tickets'],
    packing: ['EU adapter', 'Crossbody bag', 'Comfortable flats', 'Euro cash'],
    localTips: ['Book museum slots ahead', 'Sunday some shops closed', 'Pickpocket-aware metros'],
    roamingBullets: ['EU caps help some plans — still pricey', 'AeroSIM eSIM for data'],
  },
  london: {
    destination: 'London, UK',
    headline: 'Mind the gap — Heathrow made easy',
    flightBullets: ['Heathrow T5 BA or T3 partners', 'Elizabeth line to Zone 1', 'Allow 75 min immigration peak'],
    weather: { temp: '16°C', condition: 'Cool, breezy, rain possible', tip: 'Layers + umbrella always' },
    timezoneBullets: ['BST UTC+1 · +7h from Calgary', 'Push through until 10pm UK'],
    terminalBullets: ['Heathrow (LHR) T5', 'Elizabeth line beats Piccadilly peak'],
    destinationSuggestions: ['British Museum free entry', 'Borough Market lunch', 'Tower of London', 'Camden + Regent\'s Canal'],
    activitySuggestions: ['West End show book ahead', 'Sunday roast pub', 'Thames Clipper boat', 'Oyster/contactless tap'],
    packing: ['UK adapter', 'Waterproof shell', 'Power bank', '£ cash'],
    localTips: ['Stand right on escalators', 'Timed entries for hotspots', 'Black cabs use meter'],
    roamingBullets: ['UK roaming costly for Canadians', 'AeroSIM eSIM on landing'],
  },
  calgary: {
    destination: 'Calgary, Canada',
    headline: 'YYC connections decoded',
    flightBullets: ['YYC Concourses A–D', 'WestJet hub peaks AM/PM', 'CTrain to downtown available'],
    weather: { temp: '14°C', condition: 'Clear, Chinook possible', tip: 'Layer for same-day swings' },
    timezoneBullets: ['MDT UTC-6 · home zone', 'No jet lag — head start'],
    terminalBullets: ['Calgary International YYC', 'Domestic Concourse D'],
    destinationSuggestions: ['Banff day trip book shuttles', 'Calgary Tower views', 'Stephen Avenue walk', 'Studio Bell music museum'],
    activitySuggestions: ['Plus15 downtown winter walks', 'Stampede grounds if in season', 'Inglewood coffee crawl', 'Uber zones signed at curb'],
    packing: ['ID ready', 'Headphones', 'Reusable bottle', 'Layers'],
    localTips: ['CTrain free downtown zone', 'Tip 15–18% dining', 'Parks Canada booking for Banff'],
    roamingBullets: ['Domestic — no roaming', 'Grab AeroSIM before your intl leg'],
  },
}

const ALIASES: [RegExp, keyof typeof TEMPLATES][] = [
  [/paris|cdg|france/i, 'paris'],
  [/tokyo|japan|nrt|hnd|narita|haneda/i, 'tokyo'],
  [/london|lhr|heathrow|uk|britain/i, 'london'],
  [/calgary|yyc|westjet/i, 'calgary'],
]

export function buildInstantBrief(query: string): TravelBrief {
  let key: keyof typeof TEMPLATES = 'tokyo'
  for (const [re, k] of ALIASES) {
    if (re.test(query)) {
      key = k
      break
    }
  }

  const t = TEMPLATES[key]
  return {
    ...t,
    headline: `${t.headline.split('—')[0].trim()} — ${query.slice(0, 28)}`,
  }
}
