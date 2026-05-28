export const buildPrompt = (query: string) =>
  `You are Travel Stress Killer. Traveler input: "${query}".

Return ONLY valid JSON (no markdown fences). Be specific to the EXACT destination and trip in the input — never default to Tokyo or another city.

Honor everything in the prompt: trip length (e.g. 5 days), age (e.g. 24), interests (sightseeing, local culture, nightlife, budget). Tailor destinationSuggestions, activitySuggestions, localTips, and packing to that traveler — e.g. younger culture-focused trips: ruin bars, thermal baths, local markets, walking districts; not generic tourist traps.

Rules: max 12 words per bullet; include real places; 3 flightBullets, 2 timezoneBullets, 2 terminalBullets, 4 destinationSuggestions, 4 activitySuggestions, 5 packing, 4 localTips, 2 roamingBullets (last mentions AeroSIM eSIM).

{
  "destination": "City, Country",
  "headline": "max 8 words",
  "flightBullets": ["...", "..."],
  "weather": { "temp": "e.g. 24°C", "condition": "short", "tip": "wear tip" },
  "timezoneBullets": ["offset vs Calgary", "jet lag tip"],
  "terminalBullets": ["airport", "terminal tip"],
  "destinationSuggestions": ["place", "place"],
  "activitySuggestions": ["activity", "activity"],
  "packing": ["item", "item"],
  "localTips": ["tip", "tip"],
  "roamingBullets": ["roaming risk for Canadians", "AeroSIM eSIM fix"]
}`
