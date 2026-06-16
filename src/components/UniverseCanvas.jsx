import { useEffect, useRef } from 'react'
import { drawEnduranceIcon } from '../utils/pixelEndurance'
import { fillCircle, px, setupPixelCanvas, strokeCircle } from '../utils/pixelCanvas'

const PAL = {
  bg: '#050812',
  star: '#B0BEC5',
  starDim: '#3a4560',
  nebula: '#80E8FF',
  gargantua: '#FF7A2F',
  gargantuaRing: '#cc5520',
  ship: '#26FF98',
}

function createStars(count, lw, lh) {
  return Array.from({ length: count }, () => ({
    x: Math.floor(Math.random() * lw),
    y: Math.floor(Math.random() * lh),
    phase: Math.random() * Math.PI * 2,
    size: Math.random() > 0.85 ? 2 : 1,
  }))
}

function drawGargantua(ctx, cx, cy, time) {
  const r = 22
  for (let a = 0; a < Math.PI * 2; a += 0.06) {
    const wobble = Math.sin(a * 6 + time * 0.001) * 1.5
    px(ctx, cx + Math.cos(a) * (r + wobble), cy + Math.sin(a) * (r + wobble) * 0.35, PAL.gargantua)
    px(ctx, cx + Math.cos(a) * (r + 4 + wobble), cy + Math.sin(a) * (r + 4 + wobble) * 0.35, PAL.gargantuaRing)
  }
  fillCircle(ctx, cx, cy, 6, '#000')
  strokeCircle(ctx, cx, cy, 8, PAL.gargantua)
}

function drawEndurance(ctx, x, y, time) {
  drawEnduranceIcon(ctx, x, y, time)
}

export default function UniverseCanvas() {
  const canvasRef = useRef(null)
  const starsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let dims = { lw: 1, lh: 1 }
    let raf = 0

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
      starsRef.current = createStars(Math.floor((dims.lw * dims.lh) / 120), dims.lw, dims.lh)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (time) => {
      const { lw, lh } = dims
      ctx.fillStyle = PAL.bg
      ctx.fillRect(0, 0, lw, lh)

      starsRef.current.forEach((s) => {
        const on = Math.sin(time * 0.002 + s.phase) > -0.2
        if (!on) return
        const col = s.size > 1 ? PAL.star : PAL.starDim
        px(ctx, s.x, s.y, col)
      })

      for (let i = 0; i < 30; i++) {
        const nx = lw * 0.75 + Math.sin(i + time * 0.0005) * 20
        const ny = lh * 0.2 + Math.cos(i * 0.7) * 8
        px(ctx, nx, ny, PAL.nebula)
      }

      drawGargantua(ctx, Math.floor(lw * 0.88), Math.floor(lh * 0.18), time)
      drawEndurance(ctx, Math.floor(lw * 0.12 + Math.sin(time * 0.0008) * 8), Math.floor(lh * 0.35), time)
      drawEndurance(ctx, Math.floor(lw * 0.55 + Math.cos(time * 0.0006) * 12), Math.floor(lh * 0.72), time + 1000)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="universe-canvas" aria-hidden="true" />
}
