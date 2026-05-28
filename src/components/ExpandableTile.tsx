import { useState, type ReactNode } from 'react'
import { sfChevronDown, sfChevronUp } from '@bradleyhodges/sfsymbols'
import type { IconDefinition } from '@bradleyhodges/sfsymbols-types'
import { SFSymbol } from './SFSymbol'

type Props = {
  title: string
  icon: IconDefinition
  iconColor?: string
  preview: ReactNode
  children: ReactNode
  visible?: boolean
  className?: string
  defaultExpanded?: boolean
  /** Show full content always — no collapse (e.g. roaming warning) */
  alwaysOpen?: boolean
}

export function ExpandableTile({
  title,
  icon,
  iconColor = 'var(--sky-600)',
  preview,
  children,
  visible = true,
  className = '',
  defaultExpanded = false,
  alwaysOpen = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded || alwaysOpen)

  const titleRow = (
    <div className="tile-title-row">
      <SFSymbol icon={icon} size={18} color={iconColor} />
      <h3>{title}</h3>
    </div>
  )

  if (alwaysOpen) {
    return (
      <article
        className={`tile expanded always-open ${visible ? 'visible' : ''} ${className}`.trim()}
      >
        <div className="tile-header tile-header-static">{titleRow}</div>
        <div className="tile-body open">{children}</div>
      </article>
    )
  }

  return (
    <article className={`tile ${expanded ? 'expanded' : ''} ${visible ? 'visible' : ''} ${className}`.trim()}>
      <button
        type="button"
        className="tile-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        {titleRow}
        <SFSymbol
          icon={expanded ? sfChevronUp : sfChevronDown}
          size={14}
          color="var(--slate-400)"
          className="tile-chevron"
        />
      </button>

      {!expanded && <div className="tile-preview">{preview}</div>}

      <div className={`tile-body ${expanded ? 'open' : ''}`} hidden={!expanded}>
        {children}
      </div>
    </article>
  )
}
