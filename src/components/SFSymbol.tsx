import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import type { IconDefinition } from '@bradleyhodges/sfsymbols-types'

type Props = {
  icon: IconDefinition
  size?: number
  color?: string
  className?: string
  weight?: number
}

export function SFSymbol({ icon, size = 22, color, className, weight = 0.5 }: Props) {
  return (
    <SFIcon
      icon={icon}
      size={size}
      color={color}
      weight={weight}
      className={className}
      aria-hidden
    />
  )
}
