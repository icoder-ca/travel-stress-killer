export interface TravelBrief {
  destination: string
  headline: string
  flightBullets: string[]
  weather: { temp: string; condition: string; tip: string }
  timezoneBullets: string[]
  terminalBullets: string[]
  destinationSuggestions: string[]
  activitySuggestions: string[]
  packing: string[]
  localTips: string[]
  roamingBullets: string[]
}
