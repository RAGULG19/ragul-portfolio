import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import { fadeUp } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}

/**
 * The site-wide blur-to-sharp scroll reveal.
 * Honours prefers-reduced-motion automatically via MotionConfig.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()

  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial={reduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: fadeUp.hidden,
        visible: {
          ...(fadeUp.visible as object),
          transition: {
            duration: 0.85,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </Tag>
  )
}
