import { useEffect, useRef } from 'react'

import './cursor.css'

/**
 * Premium desktop-only cursor: a precise dot + trailing ring that
 * expands over interactive elements. Never rendered on touch devices
 * or for prefers-reduced-motion users — native cursor stays intact.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!finePointer || reducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('custom-cursor-active')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { x: target.x, y: target.y }
    let rafId = 0
    let visible = false

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX
      target.y = event.clientY

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`

      if (!visible) {
        visible = true
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }

      const interactive = (event.target as HTMLElement | null)?.closest(
        'a, button, [role="button"], input, textarea, label, select',
      )
      ring.classList.toggle('is-active', Boolean(interactive))
    }

    const onLeave = () => {
      visible = false
      ring.style.opacity = '0'
      dot.style.opacity = '0'
    }

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16
      ringPos.y += (target.y - ringPos.y) * 0.16
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      rafId = window.requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    rafId = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
