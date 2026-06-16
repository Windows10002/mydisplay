import { useEffect, useRef } from 'react'
import { ORBIT_TILT, PLANETS, SUN_CENTER } from '../data/solarSystemData'
import {
  drawOrbitEllipse,
  fillCircle,
  setupPixelCanvas,
  strokeCircle,
  px,
} from '../utils/pixelCanvas'
import './SolarSystemBackground.css'

const PALETTE = {
  bg: '#050812',
  star: '#d8e8ff',
  starDim: '#4a5a78',
  orbit: '#1a2848',
  orbitGlow: '#2a4068',
  sunCore: '#fff8e0',
  sunMid: '#ffb84a',
  sunOuter: '#FF7A2F',
  nebula: '#80E8FF',
  gargantua: '#cc5520',
}

function createStars(count, lw, lh) {
  return Array.from({ length: count }, () => ({
    x: Math.floor(Math.random() * lw),
    y: Math.floor(Math.random() * lh),
    bright: Math.random() > 0.82,
    twinkle: Math.random() * Math.PI * 2,
    size: Math.random() > 0.92 ? 2 : 1,
  }))
}

function drawNebula(ctx, lw, lh, time) {
  const reduced = time === 0
  for (let i = 0; i < 48; i++) {
    const bx = (lw * 0.72 + Math.sin(i * 0.9) * 30) | 0
    const by = (lh * 0.22 + Math.cos(i * 0.7) * 18) | 0
    if (!reduced && i % 3 === 0) {
      px(ctx, bx + Math.sin(time * 0.0004 + i) * 2, by, PALETTE.nebula)
    } else {
      px(ctx, bx, by, '#1a3858')
    }
  }
}

function drawGargantuaHint(ctx, lw, lh, time) {
  const cx = Math.floor(lw * 0.88)
  const cy = Math.floor(lh * 0.14)
  for (let a = 0; a < Math.PI * 2; a += 0.1) {
    const wobble = Math.sin(a * 5 + time * 0.001) * 1.2
    px(ctx, cx + Math.cos(a) * (14 + wobble), cy + Math.sin(a) * (5 + wobble * 0.3), PALETTE.gargantua)
  }
  fillCircle(ctx, cx, cy, 3, '#000')
}

function drawPixelSun(ctx, cx, cy, time) {
  const pulse = Math.sin(time * 0.002) > 0.3 ? 1 : 0
  fillCircle(ctx, cx, cy, 8 + pulse, '#3a2010')
  fillCircle(ctx, cx, cy, 6 + pulse, PALETTE.sunOuter)
  fillCircle(ctx, cx, cy, 4.5, PALETTE.sunMid)
  fillCircle(ctx, cx, cy, 2.8, PALETTE.sunCore)
  px(ctx, cx - 1, cy, '#ffffff')
  px(ctx, cx, cy - 1, '#ffffff')
  px(ctx, cx + 1, cy + 1, '#ffe878')
}

function drawPixelPlanet(ctx, planet, cx, cy, scale, time) {
  const angle = planet.phase + time * planet.orbitSpeed
  const px0 = Math.floor(cx + Math.cos(angle) * planet.orbit * scale)
  const py0 = Math.floor(cy + Math.sin(angle) * planet.orbit * scale * ORBIT_TILT)
  const r = Math.max(2, Math.round(planet.radius * scale * 0.42))
  const spin = Math.floor(time * planet.spinSpeed * 0.02) % 4

  if (planet.ring) {
    for (let dx = -r * 3; dx <= r * 3; dx++) {
      if (Math.abs(dx) > r) {
        px(ctx, px0 + dx, py0, '#9a8a68')
        px(ctx, px0 + dx, py0 + 1, '#7a6a48')
      }
    }
  }

  fillCircle(ctx, px0, py0, r, planet.color)
  if (planet.highlight) {
    px(ctx, px0 - 1 + (spin % 2), py0 - 1, planet.highlight)
  }

  if (planet.bands) {
    for (let i = -1; i <= 1; i++) {
      px(ctx, px0 + spin - 1, py0 + i, '#8a6030')
    }
  }
}

export default function SolarSystemBackground() {
  const canvasRef = useRef(null)
  const starsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dims = { lw: 1, lh: 1, scale: 4 }

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
      const scale = Math.min(dims.lw, dims.lh) / 175
      starsRef.current = createStars(220, dims.lw, dims.lh)
      canvas._scale = scale
    }
    resize()
    window.addEventListener('resize', resize)

    let rafId = 0
    const draw = (time) => {
      const { lw, lh } = dims
      const scale = canvas._scale || 1
      const cx = lw * SUN_CENTER.xRatio
      const cy = lh * SUN_CENTER.yRatio
      const t = reduced ? 0 : time

      ctx.fillStyle = PALETTE.bg
      ctx.fillRect(0, 0, lw, lh)

      starsRef.current.forEach((s) => {
        const on = s.bright || (!reduced && Math.sin(t * 0.003 + s.twinkle) > 0.45)
        if (!on) return
        const col = s.bright ? PALETTE.star : PALETTE.starDim
        if (s.size > 1) {
          fillCircle(ctx, s.x, s.y, 1, col)
        } else {
          px(ctx, s.x, s.y, col)
        }
      })

      drawNebula(ctx, lw, lh, t)
      if (!reduced) drawGargantuaHint(ctx, lw, lh, t)

      const orbits = [...new Set(PLANETS.map((p) => p.orbit))]
      orbits.forEach((orbit, i) => {
        drawOrbitEllipse(
          ctx,
          cx,
          cy,
          orbit * scale,
          orbit * scale * ORBIT_TILT,
          i % 2 === 0 ? PALETTE.orbit : PALETTE.orbitGlow,
          0.1,
        )
      })

      drawPixelSun(ctx, cx, cy, t)
      PLANETS.forEach((p) => drawPixelPlanet(ctx, p, cx, cy, scale, t))

      const shadeSteps = 10
      for (let i = 0; i < shadeSteps; i++) {
        const a = (i / shadeSteps) * 0.14
        ctx.fillStyle = `rgba(0,0,0,${a})`
        ctx.fillRect(i, i, lw - i * 2, lh - i * 2)
      }

      if (!reduced) rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className="solar-bg solar-bg--pixel" aria-hidden="true" />
}
