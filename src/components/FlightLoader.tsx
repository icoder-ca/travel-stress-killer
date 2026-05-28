import { useEffect, useState } from 'react'
import { SFSymbol } from './SFSymbol'
import { sfAirplane } from '@bradleyhodges/sfsymbols'

const STEPS = [
  'Plotting your route',
  'Scanning weather & timezone',
  'Mapping terminals & gates',
  'Finding destinations & activities',
  'Building your skimable brief',
]

export function FlightLoader() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="flight-loader" aria-live="polite" aria-busy="true">
      <div className="loader-sky">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
        <div className="cloud cloud-d" />
        <div className="plane-track">
          <SFSymbol icon={sfAirplane} size={36} color="var(--sky-600)" className="loader-plane" />
        </div>
      </div>
      <p className="loader-title">Preparing your travel brief</p>
      <p className="loader-step" key={step}>
        {STEPS[step]}…
      </p>
      <div className="loader-bar">
        <span className="loader-bar-fill" />
      </div>
      <p className="loader-hint">Building your preview…</p>
    </section>
  )
}
