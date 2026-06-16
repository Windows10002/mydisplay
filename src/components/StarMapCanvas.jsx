import { useEffect, useRef } from 'react'
import { fillCircle, px, setupPixelCanvas, strokeCircle } from '../utils/pixelCanvas'

const PAL = {
  bg: '#050812',
  wormhole: '#80E8FF',
  wormholeInner: '#26FF98',
  star: '#B0BEC5',
  planet: '#FF7A2F',
}

export default function StarMapCanvas({ active }) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let dims = { lw: 1, lh: 1 }
    let raf = 0

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
      starsRef.current = Array.from({ length: 40 }, () => ({
        x: Math.floor(Math.random() * dims.lw),
        y: Math.floor(Math.random() * dims.lh),
        phase: Math.random() * Math.PI * 2,
      }))
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    const draw = (time) => {
      const { lw, lh } = dims
      ctx.fillStyle = PAL.bg
      ctx.fillRect(0, 0, lw, lh)

      starsRef.current.forEach((s) => {
        const on = Math.sin(time * 0.003 + s.phase) > 0.2
        if (on) px(ctx, s.x, s.y, PAL.star)
      })

      const cx = lw / 2
      const cy = lh / 2
      const pulse = Math.sin(time * 0.004) * 0.5 + 0.5
      const r = 8 + Math.floor(pulse * 2)

      for (let a = 0; a < Math.PI * 2; a += 0.12) {
        const ring = r + 3 + Math.floor(Math.sin(a * 3 + time * 0.005) * 1.5)
        px(ctx, cx + Math.cos(a) * ring, cy + Math.sin(a) * ring, PAL.wormhole)
      }
      strokeCircle(ctx, cx, cy, r, PAL.wormhole)
      strokeCircle(ctx, cx, cy, r - 2, PAL.wormholeInner)
      fillCircle(ctx, cx, cy, 2, '#050812')

      if (active) {
        const drift = time * 0.0008
        px(ctx, cx + 18 + Math.sin(drift) * 4, cy - 12, PAL.planet)
        px(ctx, cx - 20 + Math.cos(drift) * 3, cy + 14, '#80E8FF')
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [active])

  return <canvas ref={canvasRef} className="star-map-canvas" aria-hidden="true" />
}
