import type { Variants } from 'framer-motion'

/** Shared cinematic easing curves */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

/** Blur-to-sharp rise — the signature reveal of the site (with depth scale) */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.965, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE_OUT },
  },
}

/** Sober fade for smaller UI parts */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
}

/** Scale-in used for glass cards and nodes */
export const popIn: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.94, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE_OUT },
  },
}

/** Slide-in used along the timeline rails */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: -42, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE_OUT },
  },
}

/** Parent stagger controller */
export const staggerChildren = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
})
