import { useState, useCallback } from 'react'
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import {
  sfAirplane,
  sfCloudSunFill,
  sfClock,
  sfBuilding2Fill,
  sfSuitcaseFill,
  sfMappinAndEllipse,
  sfAntennaRadiowavesLeftAndRight,
  sfCheckmark,
  sfArrowRight,
  sfSparkles,
  sfMagnifyingglass,
  sfEsim,
  sfMapFill,
  sfFigureHiking,
} from '@bradleyhodges/sfsymbols'
import type { TravelBrief } from './types'
import { SFSymbol } from './components/SFSymbol'
import { BulletList } from './components/BulletList'
import { ExpandableTile } from './components/ExpandableTile'
import { FlightLoader } from './components/FlightLoader'
import './App.css'

const QUICK = ['AC 15 to Tokyo', '7 day trip to Paris', 'BA 178 London', 'Calgary YYC']
const AEROSIM_LOGO = '/aerosim-logo.png'
const PREVIEW_BULLETS = 2

const CARD_COUNT = 11

export default function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<TravelBrief | null>(null)
  const [visibleCards, setVisibleCards] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'fast' | 'cursor'>('cursor')

  const revealCards = useCallback(() => {
    setVisibleCards(0)
    for (let i = 0; i < CARD_COUNT; i++) {
      setTimeout(() => setVisibleCards((n) => Math.max(n, i + 1)), 120 + i * 100)
    }
  }, [])

  const handleSubmit = async (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault()
    const q = (preset ?? query).trim()
    if (!q) return
    setQuery(q)
    setLoading(true)
    setError(null)
    setBrief(null)
    setVisibleCards(0)

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      setBrief(data.brief)
      setSource(data.source === 'fast' ? 'fast' : 'cursor')
      revealCards()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const moreLabel = (total: number, shown: number) =>
    total > shown ? (
      <span className="more-hint">+{total - shown} more — tap to expand</span>
    ) : null

  return (
    <div className="app">
      <div className="sky-bg" aria-hidden />

      <header className="hero">
        <p className="title-eyebrow">AI travel copilot</p>
        <h1 className="title-main">
          <SFSymbol icon={sfAirplane} size={32} color="var(--sky-500)" className="hero-plane" />
          <span className="title-text">
            <span className="title-gradient">Travel Stress </span>
            <span className="title-killer">Killer</span>
          </span>
        </h1>
        <p className="tagline">Flight chaos, zero stress — your skimable pre-landing brief.</p>
      </header>

      <section className="search-panel">
        <form onSubmit={(e) => handleSubmit(e)} className="search-form">
          <div className="input-wrap">
            <SFSymbol icon={sfMagnifyingglass} size={18} color="var(--slate-400)" />
            <input
              type="text"
              placeholder="Flight number (AC 15) or destination (7 day trip to Paris)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading || !query.trim()}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Generating your brief…
              </span>
            ) : (
              <>
                Kill the stress
                <SFSymbol icon={sfArrowRight} size={16} color="#fff" />
              </>
            )}
          </button>
        </form>

        <div className="quick-picks">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              className="chip"
              onClick={() => handleSubmit(undefined, q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="sponsor">
          <p className="sponsor-label">Brought to you by</p>
          <img src={AEROSIM_LOGO} alt="AeroSIM — First thing you'll need when you land" className="sponsor-logo" />
        </div>
      </section>

      {loading && <FlightLoader />}

      {brief && !loading && (
        <section className="results">
          <div className={`headline-card compact ${visibleCards >= 1 ? 'visible' : ''}`}>
            <p className="dest-label">{brief.destination}</p>
            <h2>{brief.headline}</h2>
            <span className={`source-pill ${source}`}>
              <SFSymbol icon={sfSparkles} size={12} color="#fff" />
              {source === 'fast' ? 'AI brief' : 'Cursor AI'}
            </span>
          </div>

          <div className={`wings-card ${visibleCards >= 2 ? 'visible' : ''}`}>
            <div className="wings-icon">
              <SFSymbol icon={sfEsim} size={20} color="var(--sky-600)" />
            </div>
            <img src={AEROSIM_LOGO} alt="AeroSIM" className="wings-logo" />
            <div className="wings-copy">
              <p className="wings-eyebrow">The wings to your journey</p>
              <p className="wings-line">
                Skip $16-$18/day roaming — get your eSIM from AeroSIM on iOS.
              </p>
            </div>
            <a
              href="https://www.aerosim.global"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wings"
            >
              Get AeroSIM on iOS
              <SFIcon icon={sfArrowRight} size={14} color="#fff" />
            </a>
          </div>

          <div className="tile-grid">
            <ExpandableTile
              title="Flight"
              icon={sfAirplane}
              visible={visibleCards >= 3}
              preview={
                <>
                  <BulletList items={brief.flightBullets} limit={PREVIEW_BULLETS} />
                  {moreLabel(brief.flightBullets.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <BulletList items={brief.flightBullets} />
            </ExpandableTile>

            <ExpandableTile
              title="Weather"
              icon={sfCloudSunFill}
              visible={visibleCards >= 4}
              preview={
                <p className="preview-line">
                  <strong>{brief.weather.temp}</strong> · {brief.weather.condition}
                </p>
              }
            >
              <p className="stat">{brief.weather.temp}</p>
              <p className="compact">{brief.weather.condition}</p>
              <p className="muted">{brief.weather.tip}</p>
            </ExpandableTile>

            <ExpandableTile
              title="Timezone"
              icon={sfClock}
              visible={visibleCards >= 5}
              preview={
                <>
                  <BulletList items={brief.timezoneBullets} limit={PREVIEW_BULLETS} />
                  {moreLabel(brief.timezoneBullets.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <BulletList items={brief.timezoneBullets} />
            </ExpandableTile>

            <ExpandableTile
              title="Terminal"
              icon={sfBuilding2Fill}
              visible={visibleCards >= 6}
              preview={
                <>
                  <BulletList items={brief.terminalBullets} limit={PREVIEW_BULLETS} />
                  {moreLabel(brief.terminalBullets.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <BulletList items={brief.terminalBullets} />
            </ExpandableTile>

            <ExpandableTile
              title="Destinations"
              icon={sfMapFill}
              visible={visibleCards >= 7}
              preview={
                <>
                  <BulletList items={brief.destinationSuggestions} limit={PREVIEW_BULLETS} />
                  {moreLabel(brief.destinationSuggestions.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <BulletList items={brief.destinationSuggestions} />
            </ExpandableTile>

            <ExpandableTile
              title="Activities"
              icon={sfFigureHiking}
              visible={visibleCards >= 8}
              preview={
                <>
                  <BulletList items={brief.activitySuggestions} limit={PREVIEW_BULLETS} />
                  {moreLabel(brief.activitySuggestions.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <BulletList items={brief.activitySuggestions} />
            </ExpandableTile>

            <ExpandableTile
              title="Packing"
              icon={sfSuitcaseFill}
              visible={visibleCards >= 9}
              preview={
                <>
                  <ul className="checklist compact-list">
                    {brief.packing.slice(0, PREVIEW_BULLETS).map((item) => (
                      <li key={item}>
                        <SFSymbol icon={sfCheckmark} size={11} color="var(--sky-600)" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {moreLabel(brief.packing.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <ul className="checklist compact-list">
                {brief.packing.map((item) => (
                  <li key={item}>
                    <SFSymbol icon={sfCheckmark} size={11} color="var(--sky-600)" />
                    {item}
                  </li>
                ))}
              </ul>
            </ExpandableTile>

            <ExpandableTile
              title="Local tips"
              icon={sfMappinAndEllipse}
              visible={visibleCards >= 10}
              preview={
                <>
                  <BulletList items={brief.localTips} limit={PREVIEW_BULLETS} />
                  {moreLabel(brief.localTips.length, PREVIEW_BULLETS)}
                </>
              }
            >
              <BulletList items={brief.localTips} />
            </ExpandableTile>

            <ExpandableTile
              title="Roaming Bill Warning🧾"
              icon={sfAntennaRadiowavesLeftAndRight}
              iconColor="var(--amber-600)"
              className="tile-warn"
              visible={visibleCards >= 11}
              alwaysOpen
              preview={null}
            >
              <BulletList items={brief.roamingBullets} className="roaming-bullets" />
            </ExpandableTile>
          </div>
        </section>
      )}

      <footer className="footer">Built at Cursor Calgary Meetup</footer>
    </div>
  )
}
