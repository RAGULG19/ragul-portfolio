import { useEffect, useRef } from 'react'

import './background.css'

/**
 * Cinematic AI / Data-intelligence backdrop.
 *
 * DOM layers: data grid · cyan/violet light fields · tilted 3D geometry ·
 * cursor-following radial light · spotlight · film grain · vignette.
 *
 * Canvas layers (single rAF): flowing data motes · wireframe sphere ·
 * floating rings · orbital lines with comets · small cubes · geometric
 * nodes · neural network with cursor synapses · star particles · cursor
 * light trail.
 *
 * Performance: DPR capped at 2, pauses when the tab is hidden, reduced
 * counts on mobile, fully static frame for prefers-reduced-motion, and
 * pointer-reactive motion only on fine-pointer (mouse) devices.
 */

const FOV = 720

/* ------------------------------ models ------------------------------ */

interface Star {
  nx: number
  ny: number
  depth: number
  size: number
  phase: number
  rx: number
  ry: number
}

interface NeuralNode {
  nx: number
  ny: number
  depth: number
  phase: number
  speed: number
  rx: number
  ry: number
}

interface PositionedNode {
  x: number
  y: number
  node: NeuralNode
}

interface Mote {
  p: number
  ny: number
  speed: number
  depth: number
  len: number
  dir: number
  violet: boolean
  oy: number
}

interface TrailPoint {
  x: number
  y: number
  life: number
}

/** Every geometry piece shares parallax offsets driven by the cursor. */
interface GeoBase {
  depth: number
  ox: number
  oy: number
}

interface SphereGeo extends GeoBase {
  nx: number
  ny: number
  radius: number
  rotX: number
  rotY: number
  violet: boolean
}

interface RingGeo extends GeoBase {
  nx: number
  ny: number
  radius: number
  tilt: number
  rotY: number
  phase: number
  violet: boolean
}

interface CubeGeo extends GeoBase {
  nx: number
  ny: number
  size: number
  rotX: number
  rotY: number
  violet: boolean
}

interface OrbitGeo extends GeoBase {
  nx: number
  ny: number
  radius: number
  tilt: number
  rotY: number
  phase: number
  violet: boolean
}

interface NodeGeo extends GeoBase {
  nx: number
  ny: number
  size: number
  rotY: number
  violet: boolean
}

interface Rotated {
  x: number
  y: number
  z: number
}

interface Projected {
  x: number
  y: number
  scale: number
}

/* ----------------------------- helpers ----------------------------- */

function makeGlowSprite(color: string): HTMLCanvasElement {
  const size = 48
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }

  return sprite
}

function rotatePoint(
  x: number,
  y: number,
  z: number,
  rotX: number,
  rotY: number,
): Rotated {
  const cosY = Math.cos(rotY)
  const sinY = Math.sin(rotY)
  const cosX = Math.cos(rotX)
  const sinX = Math.sin(rotX)

  const x1 = x * cosY + z * sinY
  const z1 = -x * sinY + z * cosY
  const y1 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX

  return { x: x1, y: y1, z: z2 }
}

function projectPoint(p: Rotated, cx: number, cy: number): Projected {
  const scale = FOV / (FOV + p.z)
  return { x: cx + p.x * scale, y: cy + p.y * scale, scale }
}

const CUBE_VERTS: [number, number, number][] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
]

const CUBE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

const HEX: [number, number][] = [
  [1, 0],
  [0.5, 0.866],
  [-0.5, 0.866],
  [-1, 0],
  [-0.5, -0.866],
  [0.5, -0.866],
]

const CYAN_RGB = '69, 224, 255'
const VIOLET_RGB = '139, 124, 255'

export function InteractiveBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const glowCyanRef = useRef<HTMLDivElement>(null)
  const glowVioletRef = useRef<HTMLDivElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches

    /* ---------------- particle fields ---------------- */

    const starCount = mobile ? 44 : 150
    const nodeCount = mobile ? 18 : 52
    const moteCount = mobile ? 2 : 12

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      depth: 0.25 + Math.random() * 0.75,
      size: Math.random() < 0.7 ? 1.4 : 2.4,
      phase: Math.random() * Math.PI * 2,
      rx: 0,
      ry: 0,
    }))

    const nodes: NeuralNode[] = Array.from({ length: nodeCount }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      depth: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.55,
      rx: 0,
      ry: 0,
    }))

    const motes: Mote[] = Array.from({ length: moteCount }, (_, i) => ({
      p: Math.random() * 1.3,
      ny: 0.08 + Math.random() * 0.84,
      speed: 0.07 + Math.random() * 0.1,
      depth: 0.3 + Math.random() * 0.6,
      len: 60 + Math.random() * 60,
      dir: i % 2 === 0 ? 1 : -1,
      violet: i % 3 === 2,
      oy: 0,
    }))

    /* ------------- floating 3D geometry ------------- */

    const sphereGeos: SphereGeo[] = [
      { nx: 0.78, ny: 0.3, depth: 0.6, radius: 190, rotX: 0.42, rotY: 0.5, violet: false, ox: 0, oy: 0 },
    ]

    const ringGeos: RingGeo[] = mobile
      ? [{ nx: 0.16, ny: 0.68, depth: 0.45, radius: 96, tilt: 1.1, rotY: 0, phase: 0, violet: false, ox: 0, oy: 0 }]
      : [
          { nx: 0.15, ny: 0.68, depth: 0.45, radius: 118, tilt: 1.1, rotY: 0, phase: 0, violet: false, ox: 0, oy: 0 },
          { nx: 0.87, ny: 0.76, depth: 0.3, radius: 168, tilt: 0.85, rotY: 0, phase: 2.1, violet: true, ox: 0, oy: 0 },
        ]

    const cubeGeos: CubeGeo[] = mobile
      ? []
      : [
          { nx: 0.25, ny: 0.22, depth: 0.7, size: 42, rotX: 0.5, rotY: 0.7, violet: false, ox: 0, oy: 0 },
          { nx: 0.66, ny: 0.76, depth: 0.5, size: 32, rotX: 0.9, rotY: 0.2, violet: true, ox: 0, oy: 0 },
        ]

    const orbitGeos: OrbitGeo[] = mobile
      ? [{ nx: 0.78, ny: 0.3, depth: 0.6, radius: 210, tilt: 1.18, rotY: 0, phase: 0, violet: false, ox: 0, oy: 0 }]
      : [
          { nx: 0.78, ny: 0.3, depth: 0.6, radius: 330, tilt: 1.18, rotY: 0, phase: 0, violet: false, ox: 0, oy: 0 },
          { nx: 0.14, ny: 0.3, depth: 0.4, radius: 190, tilt: 0.95, rotY: 0, phase: 3.4, violet: true, ox: 0, oy: 0 },
        ]

    const nodeGeos: NodeGeo[] = mobile
      ? []
      : [
          { nx: 0.44, ny: 0.13, depth: 0.65, size: 16, rotY: 0, violet: false, ox: 0, oy: 0 },
          { nx: 0.9, ny: 0.55, depth: 0.4, size: 14, rotY: 1.2, violet: true, ox: 0, oy: 0 },
          { nx: 0.07, ny: 0.85, depth: 0.5, size: 15, rotY: 2.3, violet: false, ox: 0, oy: 0 },
        ]

    const cyanSprite = makeGlowSprite('rgba(69, 224, 255, 0.42)')
    const violetSprite = makeGlowSprite('rgba(139, 124, 255, 0.36)')

    const trail: TrailPoint[] = []
    const trailPos = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }

    /** Energy ripples emitted from the cursor while it moves. */
    const ripples: { x: number; y: number; r: number; life: number }[] = []
    let rippleClock = 0

    /** Reused per-frame screen positions of the data particles. */
    const starPts: { x: number; y: number; d: number }[] = []

    /** Light pulses that travel along active neural connections. */
    const pulses: {
      a: number
      b: number
      t: number
      speed: number
      violet: boolean
    }[] = []
    let pulseClock = 0

    /* ---------------- sizing ---------------- */

    let width = 1
    let height = 1

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    /* ---------------- pointer ---------------- */

    const pointer = {
      x: width / 2,
      y: height / 2,
      tx: width / 2,
      ty: height / 2,
      active: false,
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.tx = event.clientX
      pointer.ty = event.clientY
      pointer.active = true
    }

    const onPointerLeaveWindow = () => {
      pointer.active = false
      pointer.tx = width / 2
      pointer.ty = height / 2
    }

    if (finePointer && !reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener(
        'mouseleave',
        onPointerLeaveWindow,
      )
      root.classList.add('has-pointer')
    }

    /** Slower-trailing position for the cursor glow + trail head. */
    const glowPos = { x: width / 2, y: height / 2 }

    /* ---------------- render tuning ---------------- */

    const linkDistance = mobile ? 140 : 212
    const cursorLinkDistance = mobile ? 0 : 265
    const magneticRadius = mobile ? 0 : 330
    const repelRadius = mobile ? 0 : 320

    let rafId = 0
    let lastTime = performance.now()
    let elapsed = 0
    let parallaxX = 0
    let parallaxY = 0

    /* ---------------- per-frame drawers ---------------- */

    const easeGeometry = (
      list: GeoBase[],
      geoEase: number,
      nx: number,
      ny: number,
    ) => {
      for (const g of list) {
        const tx = nx * g.depth * 34
        const ty = ny * g.depth * 24
        g.ox += (tx - g.ox) * geoEase
        g.oy += (ty - g.oy) * geoEase
      }
    }

    const drawSphere = (g: SphereGeo, k: number) => {
      const cx = g.nx * width + g.ox
      const cy = g.ny * height + g.oy
      const R = g.radius * k
      const rgb = g.violet ? VIOLET_RGB : CYAN_RGB
      const rotX = g.rotX + Math.sin(elapsed * 0.00007) * 0.1
      const lat = 5
      const lon = 7
      const seg = 26

      ctx.lineWidth = 1

      // Latitude rings.
      for (let i = 1; i < lat; i += 1) {
        const phi = (Math.PI * i) / lat
        const ringR = R * Math.sin(phi)
        const y0 = R * Math.cos(phi)

        ctx.beginPath()
        for (let s = 0; s <= seg; s += 1) {
          const t = (s / seg) * Math.PI * 2
          const pr = projectPoint(
            rotatePoint(ringR * Math.cos(t), y0, ringR * Math.sin(t), rotX, g.rotY),
            cx,
            cy,
          )
          if (s === 0) ctx.moveTo(pr.x, pr.y)
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.strokeStyle = `rgba(${rgb}, 0.3)`
        ctx.stroke()
      }

      // Meridian great circles.
      for (let j = 0; j < lon; j += 1) {
        const theta = (Math.PI * 2 * j) / lon

        ctx.beginPath()
        for (let s = 0; s <= seg; s += 1) {
          const phi = (s / seg) * Math.PI * 2
          const hr = R * Math.sin(phi)
          const pr = projectPoint(
            rotatePoint(
              hr * Math.cos(theta),
              R * Math.cos(phi),
              hr * Math.sin(theta),
              rotX,
              g.rotY,
            ),
            cx,
            cy,
          )
          if (s === 0) ctx.moveTo(pr.x, pr.y)
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.strokeStyle = `rgba(${rgb}, 0.22)`
        ctx.stroke()
      }

      // Glowing geometric nodes on the wireframe.
      const sprite = g.violet ? violetSprite : cyanSprite
      for (let i = 1; i < lat; i += 1) {
        const phi = (Math.PI * i) / lat
        const ringR = R * Math.sin(phi)
        const y0 = R * Math.cos(phi)

        for (let j = 0; j < lon; j += 1) {
          if ((i + j) % 2 !== 0) continue
          const theta = (Math.PI * 2 * j) / lon
          const pr = projectPoint(
            rotatePoint(
              ringR * Math.cos(theta),
              y0,
              ringR * Math.sin(theta),
              rotX,
              g.rotY,
            ),
            cx,
            cy,
          )
          const size = 24 * pr.scale
          ctx.globalAlpha = 0.5 * pr.scale
          ctx.drawImage(sprite, pr.x - size / 2, pr.y - size / 2, size, size)
          ctx.globalAlpha = 1
          ctx.fillStyle = `rgba(214, 244, 255, ${0.5 * pr.scale})`
          ctx.fillRect(pr.x - 1, pr.y - 1, 2, 2)
        }
      }
    }

    const drawRing = (g: RingGeo, k: number) => {
      const cx = g.nx * width + g.ox
      const cy = g.ny * height + g.oy
      const R = g.radius * k
      const rgb = g.violet ? VIOLET_RGB : CYAN_RGB
      const seg = 56

      ctx.lineWidth = 1
      ctx.beginPath()
      for (let s = 0; s <= seg; s += 1) {
        const t = (s / seg) * Math.PI * 2
        const pr = projectPoint(
          rotatePoint(R * Math.cos(t), R * Math.sin(t), 0, g.tilt, g.rotY),
          cx,
          cy,
        )
        if (s === 0) ctx.moveTo(pr.x, pr.y)
        else ctx.lineTo(pr.x, pr.y)
      }
      ctx.strokeStyle = `rgba(${rgb}, 0.3)`
      ctx.stroke()

      // Travelling bright arc + head glow.
      ctx.beginPath()
      for (let s = 0; s <= 14; s += 1) {
        const t = g.phase + (s / 14) * 1.1
        const pr = projectPoint(
          rotatePoint(R * Math.cos(t), R * Math.sin(t), 0, g.tilt, g.rotY),
          cx,
          cy,
        )
        if (s === 0) ctx.moveTo(pr.x, pr.y)
        else ctx.lineTo(pr.x, pr.y)
      }
      ctx.strokeStyle = `rgba(${rgb}, 0.58)`
      ctx.lineWidth = 1.9
      ctx.stroke()
      ctx.lineWidth = 1

      const head = projectPoint(
        rotatePoint(
          R * Math.cos(g.phase),
          R * Math.sin(g.phase),
          0,
          g.tilt,
          g.rotY,
        ),
        cx,
        cy,
      )
      const size = 36 * head.scale
      ctx.globalAlpha = 0.62
      ctx.drawImage(
        g.violet ? violetSprite : cyanSprite,
        head.x - size / 2,
        head.y - size / 2,
        size,
        size,
      )
      ctx.globalAlpha = 1
    }

    const drawOrbit = (g: OrbitGeo, k: number) => {
      const cx = g.nx * width + g.ox
      const cy = g.ny * height + g.oy
      const R = g.radius * k
      const rgb = g.violet ? VIOLET_RGB : CYAN_RGB
      const seg = 64

      ctx.lineWidth = 1
      ctx.beginPath()
      for (let s = 0; s <= seg; s += 1) {
        const t = (s / seg) * Math.PI * 2
        const pr = projectPoint(
          rotatePoint(R * Math.cos(t), R * Math.sin(t), 0, g.tilt, g.rotY),
          cx,
          cy,
        )
        if (s === 0) ctx.moveTo(pr.x, pr.y)
        else ctx.lineTo(pr.x, pr.y)
      }
      ctx.strokeStyle = `rgba(${rgb}, 0.22)`
      ctx.stroke()

      // Comet: glowing head with a fading tail along the orbit.
      const sprite = g.violet ? violetSprite : cyanSprite
      for (let i = 0; i < 5; i += 1) {
        const t = g.phase - i * 0.14
        const pr = projectPoint(
          rotatePoint(R * Math.cos(t), R * Math.sin(t), 0, g.tilt, g.rotY),
          cx,
          cy,
        )
        const size = (30 - i * 5) * pr.scale
        ctx.globalAlpha = (1 - i / 5) * 0.58
        ctx.drawImage(sprite, pr.x - size / 2, pr.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
    }

    const drawCube = (g: CubeGeo, k: number) => {
      const cx = g.nx * width + g.ox
      const cy = g.ny * height + g.oy
      const s = g.size * k
      const rgb = g.violet ? VIOLET_RGB : CYAN_RGB

      const pts = CUBE_VERTS.map(([x, y, z]) =>
        projectPoint(
          rotatePoint(x * s, y * s, z * s, g.rotX, g.rotY),
          cx,
          cy,
        ),
      )

      ctx.lineWidth = 1.2
      ctx.strokeStyle = `rgba(${rgb}, 0.34)`
      ctx.beginPath()
      for (const [a, b] of CUBE_EDGES) {
        ctx.moveTo(pts[a].x, pts[a].y)
        ctx.lineTo(pts[b].x, pts[b].y)
      }
      ctx.stroke()

      ctx.fillStyle = 'rgba(214, 244, 255, 0.4)'
      for (const p of pts) {
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2)
      }
    }

    const drawNodeGeo = (g: NodeGeo, k: number) => {
      const cx = g.nx * width + g.ox
      const cy = g.ny * height + g.oy
      const s = g.size * k
      const rgb = g.violet ? VIOLET_RGB : CYAN_RGB

      ctx.beginPath()
      HEX.forEach(([x, y], i) => {
        const pr = projectPoint(
          rotatePoint(x * s, y * s, 0, 0.55, g.rotY),
          cx,
          cy,
        )
        if (i === 0) ctx.moveTo(pr.x, pr.y)
        else ctx.lineTo(pr.x, pr.y)
      })
      ctx.closePath()
      ctx.strokeStyle = `rgba(${rgb}, 0.45)`
      ctx.lineWidth = 1
      ctx.stroke()

      const size = 32
      ctx.globalAlpha = 0.55
      ctx.drawImage(
        g.violet ? violetSprite : cyanSprite,
        cx - size / 2,
        cy - size / 2,
        size,
        size,
      )
      ctx.globalAlpha = 1
    }

    const drawMotes = (deltaMs: number) => {
      const boostRadius = 330
      const span = 1.3

      for (const mote of motes) {
        const position = () => {
          const raw = ((mote.p % span) + span) % span
          const t = raw - 0.15
          const base = mote.dir > 0 ? t * width : width - t * width
          return base + parallaxX * mote.depth * 1.1
        }

        let x = position()
        const driftY = parallaxY * mote.depth * 1.15

        // Amplify + bend the stream near the cursor.
        let boost = 1
        let targetOy = 0
        if (magneticRadius > 0 && pointer.active) {
          const dx = x - pointer.x
          const dy = mote.ny * height + driftY + mote.oy - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist > 1 && dist < boostRadius) {
            const closeness = 1 - dist / boostRadius
            boost = 1 + closeness * 1.6
            targetOy = (dy >= 0 ? 1 : -1) * closeness * 34
          }
        }

        mote.p += (mote.speed * boost * deltaMs) / 1000
        mote.oy += (targetOy - mote.oy) * (1 - Math.pow(0.02, deltaMs / 1000))

        x = position()
        const y = mote.ny * height + driftY + mote.oy

        if (x < -140 || x > width + 140) continue

        const rgb = mote.violet ? VIOLET_RGB : CYAN_RGB
        const tailX = x - mote.len * mote.dir
        const gradient = ctx.createLinearGradient(x, y, tailX, y)
        gradient.addColorStop(0, `rgba(${rgb}, 0.55)`)
        gradient.addColorStop(1, `rgba(${rgb}, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(tailX, y)
        ctx.stroke()

        const size = 22
        ctx.globalAlpha = 0.62
        ctx.drawImage(
          mote.violet ? violetSprite : cyanSprite,
          x - size / 2,
          y - size / 2,
          size,
          size,
        )
        ctx.globalAlpha = 1
      }
    }

    /* ---------------- main frame ---------------- */

    const drawFrame = (deltaMs: number) => {
      elapsed += deltaMs

      // Ease pointer toward the target (frame-rate independent).
      const ease = 1 - Math.pow(0.0018, deltaMs / 1000)
      pointer.x += (pointer.tx - pointer.x) * ease
      pointer.y += (pointer.ty - pointer.y) * ease

      const normX = pointer.active ? (pointer.x - width / 2) / (width / 2) : 0
      const normY = pointer.active ? (pointer.y - height / 2) / (height / 2) : 0
      // 3-layer depth: far grid ~4px · particles ~8–15px · lights drift over time
      parallaxX = normX * 14
      parallaxY = normY * 10

      // Slow ambient drift keeps lighting alive even when the mouse is still.
      const lightDriftX = Math.sin(elapsed * 0.00011) * 52
      const lightDriftY = Math.cos(elapsed * 0.00009) * 38
      const gridDriftX = Math.sin(elapsed * 0.00006) * 9
      const gridDriftY = Math.cos(elapsed * 0.00005) * 7

      // DOM depth layers follow the pointer at different speeds.
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${parallaxX * 0.3 + gridDriftX}px, ${parallaxY * 0.3 + gridDriftY}px, 0)`
      }
      if (glowCyanRef.current) {
        glowCyanRef.current.style.transform = `translate3d(${parallaxX * 1.4 + lightDriftX}px, ${parallaxY * 1.4 + lightDriftY}px, 0)`
      }
      if (glowVioletRef.current) {
        glowVioletRef.current.style.transform = `translate3d(${-parallaxX * 1.2 - lightDriftY}px, ${-parallaxY * 1.2 + lightDriftX * 0.6}px, 0)`
      }

      // Tilt variables consumed by the 3D geo DOM layer.
      root.style.setProperty('--par-x', normX.toFixed(4))
      root.style.setProperty('--par-y', normY.toFixed(4))

      // Cursor-following radial light + section spotlight.
      if (finePointer && !reducedMotion) {
        const glowEase = 1 - Math.pow(0.046, deltaMs / 1000)
        glowPos.x += (pointer.x - glowPos.x) * glowEase
        glowPos.y += (pointer.y - glowPos.y) * glowEase

        if (cursorGlowRef.current) {
          cursorGlowRef.current.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0)`
        }

        root.style.setProperty('--spot-x', `${pointer.x}px`)
        root.style.setProperty('--spot-y', `${pointer.y}px`)
      }

      ctx.clearRect(0, 0, width, height)

      const scaleK = Math.max(0.62, Math.min(1.15, width / 1440))
      const geoEase = 1 - Math.pow(0.008, deltaMs / 1000)

      // Cursor-biased positions + continuous ambient rotation.
      easeGeometry(sphereGeos, geoEase, normX, normY)
      easeGeometry(ringGeos, geoEase, normX, normY)
      easeGeometry(cubeGeos, geoEase, normX, normY)
      easeGeometry(orbitGeos, geoEase, normX, normY)
      easeGeometry(nodeGeos, geoEase, normX, normY)

      for (const g of sphereGeos) g.rotY += deltaMs * 0.00021
      for (const g of ringGeos) {
        g.rotY += deltaMs * 0.00017
        g.phase += deltaMs * 0.00055
      }
      for (const g of cubeGeos) {
        g.rotX += deltaMs * 0.00032
        g.rotY -= deltaMs * 0.00026
      }
      for (const g of orbitGeos) {
        g.rotY += deltaMs * 0.0001
        g.phase += deltaMs * 0.0005
      }
      for (const g of nodeGeos) g.rotY += deltaMs * 0.0005

      // Floating geometry (deepest visual layer).
      for (const g of sphereGeos) drawSphere(g, scaleK)
      for (const g of ringGeos) drawRing(g, scaleK)
      for (const g of orbitGeos) drawOrbit(g, scaleK)
      for (const g of cubeGeos) drawCube(g, scaleK)
      for (const g of nodeGeos) drawNodeGeo(g, scaleK)

      // Flowing data streams.
      drawMotes(deltaMs)

      // Neural nodes (drift + parallax + eased magnetic pull).
      const magEase = 1 - Math.pow(0.004, deltaMs / 1000)
      const positioned: PositionedNode[] = []

      for (const node of nodes) {
        const driftX =
          Math.sin(elapsed * 0.00028 * node.speed + node.phase) *
          15 *
          node.depth
        const driftY =
          Math.cos(elapsed * 0.00023 * node.speed + node.phase * 1.3) *
          13 *
          node.depth

        const baseX = node.nx * width + driftX + parallaxX * node.depth * 1.1
        const baseY = node.ny * height + driftY + parallaxY * node.depth * 1.1

        let targetRx = 0
        let targetRy = 0
        if (magneticRadius > 0 && pointer.active) {
          const dx = pointer.x - baseX
          const dy = pointer.y - baseY
          const dist = Math.hypot(dx, dy)

          if (dist > 1 && dist < magneticRadius) {
            const force = Math.pow(1 - dist / magneticRadius, 1.6) * 70
            targetRx = (dx / dist) * force
            targetRy = (dy / dist) * force
          }
        }

        node.rx += (targetRx - node.rx) * magEase
        node.ry += (targetRy - node.ry) * magEase

        positioned.push({ x: baseX + node.rx, y: baseY + node.ry, node })
      }

      // Neural connection lines — brighten near the cursor.
      for (let i = 0; i < positioned.length; i += 1) {
        const a = positioned[i]

        for (let j = i + 1; j < positioned.length; j += 1) {
          const b = positioned[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)

          if (dist < linkDistance) {
            let alpha =
              (1 - dist / linkDistance) * 0.24 +
              Math.sin(elapsed * 0.0012 + i * 0.9 + j * 1.3) * 0.04
            let weight = 1

            if (finePointer && pointer.active) {
              const midX = (a.x + b.x) / 2
              const midY = (a.y + b.y) / 2
              const d = Math.hypot(midX - pointer.x, midY - pointer.y)

              if (d < 320) {
                const closeness = 1 - d / 320
                alpha += closeness * 0.38
                weight = 1.2 + closeness * 1.1
              }
            }

            alpha = Math.max(alpha, 0.015)
            ctx.strokeStyle = `rgba(110, 205, 255, ${alpha})`
            ctx.lineWidth = weight
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Synapse lines from nodes toward the cursor.
      if (cursorLinkDistance > 0 && pointer.active) {
        for (const item of positioned) {
          const dist = Math.hypot(item.x - pointer.x, item.y - pointer.y)

          if (dist < cursorLinkDistance) {
            const alpha = (1 - dist / cursorLinkDistance) * 0.36
            const gradient = ctx.createLinearGradient(
              item.x,
              item.y,
              pointer.x,
              pointer.y,
            )
            gradient.addColorStop(0, `rgba(160, 145, 255, ${alpha})`)
            gradient.addColorStop(1, `rgba(69, 224, 255, ${alpha * 0.9})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.6
            ctx.beginPath()
            ctx.moveTo(item.x, item.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      // Light pulses travelling along active neural connections.
      if (!reducedMotion) {
        pulseClock += deltaMs
        if (pulseClock > 480 && pulses.length < 8 && positioned.length > 2) {
          pulseClock = 0
          for (let attempt = 0; attempt < 12; attempt += 1) {
            const ai = Math.floor(Math.random() * positioned.length)
            const bi = Math.floor(Math.random() * positioned.length)
            if (ai === bi) continue

            const pa = positioned[ai]
            const pb = positioned[bi]
            if (Math.hypot(pa.x - pb.x, pa.y - pb.y) < linkDistance) {
              pulses.push({
                a: ai,
                b: bi,
                t: 0,
                speed: 0.00032 + Math.random() * 0.00028,
                violet: Math.random() < 0.4,
              })
              break
            }
          }
        }
      }

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const pulse = pulses[i]
        pulse.t += pulse.speed * deltaMs
        if (pulse.t >= 1) {
          pulses.splice(i, 1)
          continue
        }

        const pa = positioned[pulse.a]
        const pb = positioned[pulse.b]
        if (!pa || !pb) continue

        const tailT = Math.max(0, pulse.t - 0.22)
        const x1 = pa.x + (pb.x - pa.x) * tailT
        const y1 = pa.y + (pb.y - pa.y) * tailT
        const x2 = pa.x + (pb.x - pa.x) * pulse.t
        const y2 = pa.y + (pb.y - pa.y) * pulse.t
        const fade = Math.sin(pulse.t * Math.PI)
        const colour = pulse.violet ? '160, 140, 255' : '110, 235, 255'

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, `rgba(${colour}, 0)`)
        gradient.addColorStop(1, `rgba(${colour}, ${0.62 * fade})`)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2.2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.lineCap = 'butt'

        const headSize = 16
        ctx.globalAlpha = 0.52 * fade
        ctx.drawImage(
          pulse.violet ? violetSprite : cyanSprite,
          x2 - headSize / 2,
          y2 - headSize / 2,
          headSize,
          headSize,
        )
        ctx.globalAlpha = 1
      }

      // Node glows + cores — brighten and swell near the cursor.
      for (const item of positioned) {
        const dCursor =
          finePointer && pointer.active
            ? Math.hypot(item.x - pointer.x, item.y - pointer.y)
            : 9999
        const near = dCursor < 300 ? 1 - dCursor / 300 : 0

        const glowSize = 38 * item.node.depth + near * 18
        const useCyan = item.node.phase % (Math.PI * 2) < Math.PI * 1.2
        const sprite = useCyan ? cyanSprite : violetSprite

        ctx.globalAlpha = Math.min(
          1,
          0.45 + item.node.depth * 0.3 + near * 0.38,
        )
        ctx.drawImage(
          sprite,
          item.x - glowSize / 2,
          item.y - glowSize / 2,
          glowSize,
          glowSize,
        )
        ctx.globalAlpha = 1

        const radius = 1.5 + item.node.depth * 1.8 + near * 1
        ctx.fillStyle = `rgba(214, 244, 255, ${0.58 + item.node.depth * 0.26})`
        ctx.beginPath()
        ctx.arc(item.x, item.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Data/star particles — drift, twinkle, parallax, cursor repulsion.
      starPts.length = 0
      const repelEase = 1 - Math.pow(0.006, deltaMs / 1000)

      for (const star of stars) {
        const driftX = Math.sin(elapsed * 0.00019 * star.depth + star.phase) * 13
        const driftY =
          Math.cos(elapsed * 0.00016 * star.depth + star.phase * 1.3) * 11

        const baseX = star.nx * width + driftX + parallaxX * star.depth
        const baseY = star.ny * height + driftY + parallaxY * star.depth

        let targetRx = 0
        let targetRy = 0
        if (repelRadius > 0 && pointer.active) {
          const dx = baseX - pointer.x
          const dy = baseY - pointer.y
          const dist = Math.hypot(dx, dy)

          if (dist > 1 && dist < repelRadius) {
            const force = Math.pow(1 - dist / repelRadius, 2) * 48
            targetRx = (dx / dist) * force
            targetRy = (dy / dist) * force
          }
        }

        star.rx += (targetRx - star.rx) * repelEase
        star.ry += (targetRy - star.ry) * repelEase

        const twinkle = 0.34 + 0.22 * Math.sin(elapsed * 0.0011 + star.phase)
        const sx = baseX + star.rx
        const sy = baseY + star.ry
        starPts.push({ x: sx, y: sy, d: star.depth })
        ctx.fillStyle = `rgba(216, 234, 255, ${twinkle * star.depth})`
        ctx.fillRect(sx, sy, star.size, star.size)

        // Depth halo so larger particles read as glowing data points.
        if (star.size > 2) {
          const halo = 16 * star.depth
          ctx.globalAlpha = twinkle * star.depth * 0.36
          ctx.drawImage(
            cyanSprite,
            sx - halo / 2 + star.size / 2,
            sy - halo / 2 + star.size / 2,
            halo,
            halo,
          )
          ctx.globalAlpha = 1
        }
      }

      // Occasional thin links between nearby data particles (AI-particle feel).
      if (!mobile) {
        for (let i = 0; i < starPts.length; i += 1) {
          const a = starPts[i]

          for (let j = i + 1; j < starPts.length; j += 1) {
            const b = starPts[j]
            const depthGap = a.d - b.d
            if (depthGap > 0.35 || depthGap < -0.35) continue

            const dx = a.x - b.x
            const dy = a.y - b.y
            const d2 = dx * dx + dy * dy
            if (d2 > 12100) continue // 110px

            const d = Math.sqrt(d2)
            const alpha = (1 - d / 110) * 0.11 * Math.min(a.d, b.d)
            if (alpha < 0.012) continue

            ctx.strokeStyle = `rgba(140, 195, 255, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Cursor light trail (front-most layer).
      if (finePointer && !reducedMotion) {
        const trailEase = Math.min(1, (deltaMs / 1000) * 26)
        trailPos.x += (pointer.x - trailPos.x) * trailEase
        trailPos.y += (pointer.y - trailPos.y) * trailEase

        if (pointer.active) {
          trail.push({ x: trailPos.x, y: trailPos.y, life: 1 })
          if (trail.length > 32) trail.shift()

          // Spawn an energy ripple when the cursor is actually travelling.
          rippleClock += deltaMs
          const glide = Math.hypot(
            pointer.x - glowPos.x,
            pointer.y - glowPos.y,
          )
          if (rippleClock > 420 && glide > 5) {
            rippleClock = 0
            ripples.push({ x: pointer.x, y: pointer.y, r: 16, life: 1 })
            if (ripples.length > 6) ripples.shift()
          }
        }
      }

      for (const point of trail) point.life -= deltaMs / 700
      while (trail.length > 0 && trail[0].life <= 0) trail.shift()

      if (trail.length > 1) {
        ctx.lineCap = 'round'

        for (let i = 1; i < trail.length; i += 1) {
          const a = trail[i - 1]
          const b = trail[i]
          const t = i / trail.length
          const life = Math.max(0, Math.min(1, b.life))
          const alpha = 0.44 * t * life
          if (alpha <= 0.005) continue

          const r = Math.round(69 + (139 - 69) * t)
          const g = Math.round(224 + (124 - 224) * t)
          ctx.strokeStyle = `rgba(${r}, ${g}, 255, ${alpha})`
          ctx.lineWidth = 0.8 + 2.8 * t
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }

        const head = trail[trail.length - 1]
        const headAlpha = Math.max(0, Math.min(1, head.life)) * 0.62
        const size = 40
        ctx.globalAlpha = headAlpha
        ctx.drawImage(
          cyanSprite,
          head.x - size / 2,
          head.y - size / 2,
          size,
          size,
        )
        ctx.globalAlpha = 1

        ctx.lineCap = 'butt'
      }

      // Energy ripples radiating from the cursor.
      if (finePointer && !reducedMotion) {
        for (let i = ripples.length - 1; i >= 0; i -= 1) {
          const ripple = ripples[i]
          ripple.r += deltaMs * 0.16
          ripple.life -= deltaMs / 900

          if (ripple.life <= 0) {
            ripples.splice(i, 1)
            continue
          }

          ctx.strokeStyle = `rgba(120, 220, 255, ${ripple.life * 0.3})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2)
          ctx.stroke()

          ctx.strokeStyle = `rgba(150, 130, 255, ${ripple.life * 0.16})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.r * 0.72, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    /* ---------------- lifecycle ---------------- */

    const loop = (now: number) => {
      const delta = Math.min(now - lastTime, 64)
      lastTime = now
      drawFrame(delta)
      rafId = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (rafId === 0) {
        lastTime = performance.now()
        rafId = window.requestAnimationFrame(loop)
      }
    }

    const stop = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const onResize = () => {
      resize()
      if (reducedMotion) drawFrame(16.7)
    }

    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    if (reducedMotion) {
      // Static composition — no animation, no pointer tracking.
      drawFrame(16.7)
    } else {
      start()
    }

    return () => {
      stop()
      root.classList.remove('has-pointer')
      root.style.removeProperty('--par-x')
      root.style.removeProperty('--par-y')
      root.style.removeProperty('--spot-x')
      root.style.removeProperty('--spot-y')
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener(
        'mouseleave',
        onPointerLeaveWindow,
      )
    }
  }, [])

  return (
    <div ref={rootRef} className="ai-background" aria-hidden="true">
      <div ref={gridRef} className="bg-layer bg-grid" />
      <div ref={glowCyanRef} className="bg-layer bg-glow bg-glow-cyan" />
      <div ref={glowVioletRef} className="bg-layer bg-glow bg-glow-violet" />
      <div className="bg-layer bg-glow bg-glow-center" />
      <div className="bg-layer bg-geo-stage">
        <div className="bg-geo bg-geo-tilt bg-geo-one">
          <span className="bg-geo-spin" />
        </div>
        <div className="bg-geo bg-geo-tilt bg-geo-two">
          <span className="bg-geo-spin" />
        </div>
        <div className="bg-geo bg-geo-tilt bg-geo-three">
          <span className="bg-geo-spin" />
        </div>
        <div className="bg-geo bg-geo-tilt bg-geo-halo">
          <span className="bg-geo-spin bg-geo-spin-halo" />
        </div>
      </div>
      <canvas ref={canvasRef} className="bg-canvas" />
      <div ref={cursorGlowRef} className="bg-layer bg-cursor-glow" />
      <div className="bg-layer bg-spotlight" />
      <div className="bg-layer bg-content-scrim" />
      <div className="bg-layer bg-noise" />
      <div className="bg-layer bg-vignette" />
    </div>
  )
}







