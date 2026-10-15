import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

import fallbackProfileImg from '../../assets/profile-photo.jpg'
import { profile } from '../../data/profile'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { fadeUp, staggerChildren } from '../../lib/motion'
import { GithubIcon, LinkedinIcon } from '../shared/BrandIcons'
import { Magnetic } from '../shared/Magnetic'
import { TiltCard } from '../shared/TiltCard'

import './Hero.css'

const profilePhotoModules = import.meta.glob<string>(
  '../../assets/{my-new-photo.png,my-new-photo.jpg,profile-photo-cutout.png,profile-photo.jpg}',
  { eager: true, import: 'default', query: '?url' },
)

const profileImg =
  profilePhotoModules['../../assets/my-new-photo.png'] ??
  profilePhotoModules['../../assets/my-new-photo.jpg'] ??
  profilePhotoModules['../../assets/profile-photo-cutout.png'] ??
  fallbackProfileImg

export function Hero() {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const photoRef = useRef<HTMLImageElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const animationTimerRef = useRef<number | null>(null)
  const [photoAnimating, setPhotoAnimating] = useState(false)

  const replayPhoto = useCallback(() => {
    const image = photoRef.current
    const canvas = particleCanvasRef.current
    const context = canvas?.getContext('2d')
    if (!image || !canvas || !context || !image.complete || !image.naturalWidth) return

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current)
    }

    const bounds = image.getBoundingClientRect()
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.round(bounds.width * pixelRatio)
    canvas.height = Math.round(bounds.height * pixelRatio)
    canvas.style.width = `${bounds.width}px`
    canvas.style.height = `${bounds.height}px`
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    setPhotoAnimating(true)
    if (reducedMotion) {
      animationTimerRef.current = window.setTimeout(() => {
        context.clearRect(0, 0, bounds.width, bounds.height)
        setPhotoAnimating(false)
      }, 520)
      return
    }

    const columns = 16
    const rows = 20
    const cellWidth = bounds.width / columns
    const cellHeight = bounds.height / rows
    const sourceScale = image.naturalWidth / bounds.width
    const sourceCropTop = Math.max(
      0,
      (image.naturalHeight - bounds.height * sourceScale) * 0.2,
    )
    const particles = Array.from({ length: columns * rows }, (_, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const seed = Math.sin(index * 127.1 + 311.7) * 43758.5453
      const random = seed - Math.floor(seed)
      const angle = Math.atan2(row - rows / 2, column - columns / 2) + (random - 0.5) * 0.9
      const distance = 18 + random * Math.min(bounds.width, bounds.height) * 0.3
      return {
        column,
        row,
        driftX: Math.cos(angle) * distance,
        driftY: Math.sin(angle) * distance - random * 24,
        rotation: (random - 0.5) * 0.5,
        depth: 0.65 + random * 0.55,
      }
    })
    const duration = 1120
    const startedAt = performance.now()
    const easeOut = (value: number) => 1 - (1 - value) ** 3
    const easeInOut = (value: number) => value < 0.5
      ? 4 * value ** 3
      : 1 - ((-2 * value + 2) ** 3) / 2

    const drawFrame = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const scatter = progress < 0.48
        ? easeOut(Math.max(0, (progress - 0.12) / 0.36))
        : 1 - easeInOut(Math.min(1, (progress - 0.48) / 0.47))

      context.clearRect(0, 0, bounds.width, bounds.height)
      particles.forEach((particle, index) => {
        const x = particle.column * cellWidth
        const y = particle.row * cellHeight
        const spread = Math.max(0, scatter)
        const opacity = progress < 0.12
          ? 1
          : progress < 0.48
            ? Math.max(0.12, 1 - (progress - 0.12) / 0.4)
            : Math.min(1, (progress - 0.48) / 0.48)
        const scale = 1 - spread * (1 - particle.depth) * 0.42

        context.save()
        context.globalAlpha = opacity
        context.translate(
          x + cellWidth / 2 + particle.driftX * spread,
          y + cellHeight / 2 + particle.driftY * spread,
        )
        context.rotate(particle.rotation * spread)
        context.scale(scale, scale)
        context.drawImage(
          image,
          x * sourceScale,
          y * sourceScale + sourceCropTop,
          cellWidth * sourceScale,
          cellHeight * sourceScale,
          -cellWidth / 2,
          -cellHeight / 2,
          cellWidth - 1,
          cellHeight - 1,
        )
        // A few restrained cyan/violet data flecks reinforce the digital dissolve.
        if (progress > 0.2 && index % 7 === 0) {
          context.fillStyle = index % 2 === 0 ? '#71e7ff' : '#a996ff'
          context.globalAlpha = opacity * spread * 0.62
          context.fillRect(-1, -1, 2, 2)
        }
        context.restore()
      })

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(drawFrame)
      } else {
        context.clearRect(0, 0, bounds.width, bounds.height)
        animationFrameRef.current = null
        setPhotoAnimating(false)
      }
    }

    animationFrameRef.current = requestAnimationFrame(drawFrame)
  }, [reducedMotion])

  useEffect(() => () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    if (animationTimerRef.current !== null) window.clearTimeout(animationTimerRef.current)
  }, [])

  // Mouse-parallax source (normalized -1..1 across the viewport).
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 55, damping: 16, mass: 0.6 })
  const springY = useSpring(rawY, { stiffness: 55, damping: 16, mass: 0.6 })

  useEffect(() => {
    if (!finePointer || reducedMotion) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [finePointer, reducedMotion, rawX, rawY])

  // Layer speeds: text drifts gently, photo counter-moves + tilts for depth.
  const copyX = useTransform(springX, (value) => value * 18)
  const copyY = useTransform(springY, (value) => value * 13)
  const visualX = useTransform(springX, (value) => value * -34)
  const visualY = useTransform(springY, (value) => value * -26)
  const visualRotY = useTransform(springX, (value) => value * -4)
  const visualRotX = useTransform(springY, (value) => value * 2.5)

  // Leaving the hero: elements recede with depth — no hard jumps.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroFadeOpacity = useTransform(heroScroll, [0, 0.9], [1, 0.12])
  const heroFadeScale = useTransform(heroScroll, [0, 1], [1, 0.955])

  return (
    <section
      ref={heroRef}
      id="home"
      className="hero-section"
      aria-label="Introduction"
    >
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={staggerChildren(0.09, 0.15)}
          style={{
            x: copyX,
            y: copyY,
            opacity: heroFadeOpacity,
            scale: heroFadeScale,
          }}
        >
          {/* Badges */}
          <motion.div className="hero-badges" variants={fadeUp}>
            {profile.badges.map((badge, index) => (
              <span key={badge} className="badge">
                {index === 0 ? (
                  <span className="badge-dot" aria-hidden="true" />
                ) : null}
                {badge}
              </span>
            ))}
          </motion.div>

          {/* Name — the loudest element */}
          <motion.h1 className="hero-name" variants={fadeUp}>
            {'RAGUL G'.split(' ').map((word) => (
              <span key={word} className="hero-name-mask">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 1,
                    delay: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Role */}
          <motion.p className="hero-role" variants={fadeUp}>
            <span className="hero-role-line" aria-hidden="true" />
            <span className="hero-role-label">
              {profile.heroTitle.toUpperCase()}
            </span>
            <span className="hero-role-line" aria-hidden="true" />
          </motion.p>

          {/* Tagline */}
          <motion.p className="hero-tagline" variants={fadeUp}>
            Turning Data
            <br />
            <span className="text-gradient">Into Intelligence.</span>
          </motion.p>

          {/* Supporting title */}
          <motion.p className="hero-supporting" variants={fadeUp}>
            {profile.supportingTitle}
          </motion.p>

          <motion.p className="hero-description" variants={fadeUp}>
            {profile.description}
          </motion.p>

          {/* Technology line */}
          <motion.ul
            className="hero-tech"
            variants={fadeUp}
            aria-label="Core technologies"
          >
            {profile.techLine.map((tech, index) => (
              <li key={tech} className="hero-tech-item">
                {tech}
                {index < profile.techLine.length - 1 ? (
                  <span className="hero-tech-sep" aria-hidden="true">
                    •
                  </span>
                ) : null}
              </li>
            ))}
          </motion.ul>

          {/* Actions */}
          <motion.div className="hero-actions" variants={fadeUp}>
            <Magnetic>
              <a className="btn btn-primary" href="#projects">
                View Projects
                <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
              </a>
            </Magnetic>

            <Magnetic>
              <a
                className="btn btn-secondary"
                href={profile.resume.href}
                download={profile.resume.filename}
              >
                <Download size={16} className="btn-icon" aria-hidden="true" />
                Download Resume
              </a>
            </Magnetic>

            <Magnetic>
              <a
                className="btn btn-ghost"
                href={profile.resume.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </Magnetic>
          </motion.div>

          {/* Socials */}
          <motion.div className="hero-socials" variants={fadeUp}>
            <span className="hero-socials-label">Connect</span>
            <Magnetic strength={7}>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="hero-social"
                aria-label="Ragul G on GitHub"
              >
                <GithubIcon size={18} />
                <span>GitHub</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </Magnetic>

            <Magnetic strength={7}>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hero-social"
                aria-label="Ragul G on LinkedIn"
              >
                <LinkedinIcon size={18} />
                <span>LinkedIn</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Transparent portrait with restrained orbital light */}
        <motion.div
          className="hero-visual-parallax"
          style={{
            x: visualX,
            y: visualY,
            rotateY: visualRotY,
            rotateX: visualRotX,
            opacity: heroFadeOpacity,
            scale: heroFadeScale,
            transformPerspective: 1100,
          }}
        >
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.92, x: 40, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
          <TiltCard className="profile-stage" maxTilt={5}>
            <div className="profile-halo" aria-hidden="true" />

            {/* 3D orbital system — rotates in on load, reacts to the mouse */}
            <div className="profile-orbit-layer" aria-hidden="true">
              <div className="profile-orbit profile-orbit-one">
                <span className="orbit-node orbit-node-cyan" />
              </div>
              <div className="profile-orbit profile-orbit-two">
                <span className="orbit-node orbit-node-violet" />
              </div>
              <div className="profile-orbit-ellipse">
                <span className="orbit-node orbit-node-ellipse" />
              </div>
              <div className="profile-light-ring" />

              {/* Small glowing data particles around the portrait */}
              <div className="profile-dust">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div
              className={`profile-image-wrap${photoAnimating ? ' is-animating' : ''}`}
              style={{ '--portrait-mask': `url("${profileImg}")` } as CSSProperties}
            >
              <button
                className="profile-photo-button"
                type="button"
                onClick={replayPhoto}
                aria-label="Replay portrait particle dissolve animation"
              >
                <img
                  ref={photoRef}
                  src={profileImg}
                  alt="Ragul G - AI and Data Science Student"
                  width={1072}
                  height={1467}
                  decoding="async"
                />
              </button>
              <canvas ref={particleCanvasRef} className="profile-particle-canvas" aria-hidden="true" />
            </div>
          </TiltCard>
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll to explore</span>
        <span className="hero-scroll-track">
          <motion.span
            className="hero-scroll-thumb"
            animate={{ y: ['-100%', '320%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  )
}
