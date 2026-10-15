import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

/**
 * Magnetic hover — the wrapper drifts slightly toward the pointer.
 * Mouse-only; falls back to a plain wrapper on touch / reduced motion.
 */
export function Magnetic({ children, strength = 12, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 16, mass: 0.4 })

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)

    x.set((dx / (rect.width / 2)) * strength)
    y.set((dy / (rect.height / 2)) * strength)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className ?? 'magnetic-wrap'}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  )
}
