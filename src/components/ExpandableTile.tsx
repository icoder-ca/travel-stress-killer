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
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <article className={`tile ${expanded ? 'expanded' : ''} ${visible ? 'visible' : ''} ${className}`.trim()}>
      <button
        type="button"
        className="tile-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="tile-title-row">
          <SFSymbol icon={icon} size={18} color={iconColor} />
          <h3>{title}</h3>
        </div>
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
