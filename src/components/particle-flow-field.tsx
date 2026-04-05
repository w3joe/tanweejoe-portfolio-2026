import { useEffect, useRef } from 'react'

// ─── Simplex noise 2D (self-contained, no deps) ─────────────────────
const _perm = new Uint8Array(512)
let _permReady = false

function _initPerm() {
  if (_permReady) return
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    const tmp = p[i]!
    p[i] = p[j]!
    p[j] = tmp
  }
  for (let i = 0; i < 512; i++) _perm[i] = p[i & 255]!
  _permReady = true
}

// Flat grad table: [gx0,gy0, gx1,gy1, ...] — 12 2D gradients
const _GX = [1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0]
const _GY = [1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1]

function noise2(xin: number, yin: number): number {
  const F2 = 0.5 * (Math.sqrt(3) - 1)
  const G2 = (3 - Math.sqrt(3)) / 6
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const t = (i + j) * G2
  const x0 = xin - i + t
  const y0 = yin - j + t
  const i1 = x0 > y0 ? 1 : 0
  const j1 = 1 - i1
  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2
  const ii = i & 255
  const jj = j & 255
  const gi0 = _perm[ii + _perm[jj]!]! % 12
  const gi1 = _perm[ii + i1 + _perm[jj + j1]!]! % 12
  const gi2 = _perm[ii + 1 + _perm[jj + 1]!]! % 12
  let n = 0
  let tt = 0.5 - x0 * x0 - y0 * y0
  if (tt >= 0) {
    tt *= tt
    n += tt * tt * (_GX[gi0]! * x0 + _GY[gi0]! * y0)
  }
  tt = 0.5 - x1 * x1 - y1 * y1
  if (tt >= 0) {
    tt *= tt
    n += tt * tt * (_GX[gi1]! * x1 + _GY[gi1]! * y1)
  }
  tt = 0.5 - x2 * x2 - y2 * y2
  if (tt >= 0) {
    tt *= tt
    n += tt * tt * (_GX[gi2]! * x2 + _GY[gi2]! * y2)
  }
  return 70 * n
}
// ────────────────────────────────────────────────────────────────────

// Tuning constants
const FLOW_SCALE = 0.003 // spatial frequency of noise field
const FLOW_SPEED = 0.00045 // how fast field evolves
const FLOW_STR = 0.022 // force along flow vector
const SPRING_STR = 0.0008 // pull to rest position
const DAMPING = 0.92 // velocity decay per frame
const MOUSE_R = 120 // repulsion radius (px)
const MOUSE_STR = 1.5 // repulsion strength
const CONN_DIST = 100 // max distance for line (px)
const CONN_DIST_SQ = CONN_DIST * CONN_DIST
const LINE_ALPHA = 0.8 // max line alpha
const DOT_ALPHA = 0.6
const DOT_R = 6
const BUCKETS = 4 // alpha batches for line rendering

interface P {
  x: number
  y: number
  vx: number
  vy: number
  rx: number
  ry: number
}

export default function ParticleFlowField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const g = canvas.getContext('2d', { alpha: true })
    if (!g) return

    _initPerm()

    let particles: P[] = []
    let w = 0,
      h = 0
    let raf = 0,
      stopped = false
    const mouse = { x: -9999, y: -9999, active: false }
    // Pre-allocate line batches (reused every frame to avoid GC)
    const batches: number[][] = Array.from({ length: BUCKETS }, () => [])

    const getCount = () => (window.innerWidth < 768 ? 80 : 160)

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = wrap.clientWidth
      h = wrap.clientHeight
      if (w < 2 || h < 2) return

      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      g.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = getCount()
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * w
        const y = Math.random() * h
        return { x, y, vx: 0, vy: 0, rx: x, ry: y }
      })
    }

    const drawStatic = () => {
      const fg = getComputedStyle(wrap).color
      g.fillStyle = fg
      g.globalAlpha = DOT_ALPHA
      g.beginPath()
      for (const p of particles) {
        g.moveTo(p.x + DOT_R, p.y)
        g.arc(p.x, p.y, DOT_R, 0, Math.PI * 2)
      }
      g.fill()
      g.globalAlpha = 1
    }

    const tick = (time: number) => {
      if (stopped) return
      g.clearRect(0, 0, w, h)

      const fg = getComputedStyle(wrap).color
      const t = time * FLOW_SPEED
      const n = particles.length

      // ── update ──────────────────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const p = particles[i]!
        // Two noise octaves → flow angle
        const angle =
          (noise2(p.x * FLOW_SCALE + t, p.y * FLOW_SCALE) +
            noise2(p.x * FLOW_SCALE, p.y * FLOW_SCALE + t + 31.4)) *
          Math.PI
        p.vx += Math.cos(angle) * FLOW_STR
        p.vy += Math.sin(angle) * FLOW_STR

        // Spring to rest position
        p.vx += (p.rx - p.x) * SPRING_STR
        p.vy += (p.ry - p.y) * SPRING_STR

        // Mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < MOUSE_R * MOUSE_R && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (1 - d / MOUSE_R) * MOUSE_STR
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }

        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx
        p.y += p.vy
      }

      // ── draw lines (batched by alpha to minimise stroke() calls) ─
      for (let b = 0; b < BUCKETS; b++) batches[b]!.length = 0

      for (let i = 0; i < n; i++) {
        const a = particles[i]!
        for (let j = i + 1; j < n; j++) {
          const b = particles[j]!
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < CONN_DIST_SQ) {
            const alpha = (1 - Math.sqrt(d2) / CONN_DIST) * LINE_ALPHA
            const bucket = Math.min(
              BUCKETS - 1,
              ((alpha / LINE_ALPHA) * BUCKETS) | 0,
            )
            const batch = batches[bucket]!
            batch.push(a.x, a.y, b.x, b.y)
          }
        }
      }

      g.strokeStyle = fg
      g.lineWidth = 0.5
      for (let b = 0; b < BUCKETS; b++) {
        const batch = batches[b]!
        if (!batch.length) continue
        g.globalAlpha = ((b + 0.5) / BUCKETS) * LINE_ALPHA
        g.beginPath()
        for (let k = 0; k < batch.length; k += 4) {
          g.moveTo(batch[k]!, batch[k + 1]!)
          g.lineTo(batch[k + 2]!, batch[k + 3]!)
        }
        g.stroke()
      }

      // ── draw dots (single batched fill) ─────────────────────────
      g.fillStyle = fg
      g.globalAlpha = DOT_ALPHA
      g.beginPath()
      for (let i = 0; i < n; i++) {
        const p = particles[i]!
        g.moveTo(p.x + DOT_R, p.y)
        g.arc(p.x, p.y, DOT_R, 0, Math.PI * 2)
      }
      g.fill()

      g.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    // ── mouse tracking via document (wrap.parentElement is astro-island, not section) ─
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      mouse.x = x
      mouse.y = y
      mouse.active = x >= 0 && x <= r.width && y >= 0 && y <= r.height
    }
    document.addEventListener('mousemove', onMove, { passive: true })

    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(wrap)

    const cleanup = () => {
      stopped = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('mousemove', onMove)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawStatic()
      return cleanup
    }

    raf = requestAnimationFrame(tick)
    return cleanup
  }, [])

  return (
    <div
      ref={wrapRef}
      className="text-muted-foreground pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
