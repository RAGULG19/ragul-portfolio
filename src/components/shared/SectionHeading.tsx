import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  index: string
  kicker: string
  title: ReactNode
  description?: string
  editorial?: boolean
}

/**
 * Consistent cinematic section header:
 * mono index + kicker rule → display title → optional description.
 */
export function SectionHeading({
  index,
  kicker,
  title,
  description,
  editorial = false,
}: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <Reveal>
        <div className="section-kicker">
          <span className="section-kicker-index">{index}</span>
          <span className="section-kicker-rule" aria-hidden="true" />
          <span className="section-kicker-text">{kicker}</span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className={editorial ? 'section-title section-title-editorial' : 'section-title'}>
          {title}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.16}>
          <p className="section-description">{description}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
