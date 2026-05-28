import { sfArrowRight } from '@bradleyhodges/sfsymbols'
import { SFSymbol } from './SFSymbol'

type Props = {
  items: string[]
  className?: string
  limit?: number
}

export function BulletList({ items, className = '', limit }: Props) {
  const shown = limit ? items.slice(0, limit) : items
  return (
    <ul className={`bullet-list ${className}`.trim()}>
      {shown.map((item) => (
        <li key={item}>
          <SFSymbol icon={sfArrowRight} size={11} color="var(--sky-500)" className="bullet-arrow" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
