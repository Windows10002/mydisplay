import { useEffect, useRef, useState } from 'react'
import { setupPixelCanvas } from '../utils/pixelCanvas'
import { PALETTE, renderSolarFrame, createStars } from '../utils/solarSystemRenderer'
import { playBeep } from '../utils/sound'
import './WormholeTransition.css'

export default function WormholeTransition({
  onComplete,
  title = '虫洞通道开启中',
  subtitle = 'ENGAGE MAIN ENGINE',
  overlay = false,
}) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    playBeep('wormhole')
    playBeep('launch')
    const t1 = setTimeout(() => setPhase(1), 500)
    const t2 = setTimeout(() => setPhase(2), 1400)
    const t3 = setTimeout(() => onComplete(), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let dims = { lw: 1, lh: 1 }
    let raf = 0

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
      starsRef.current = createStars(160, dims.lw, dims.lh)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (time) => {
      const { lw, lh } = dims
      const cx = lw / 2
      const cy = lh / 2
      const shrink = phase >= 1 ? Math.min(1, ((time % 3000) / 1000) * 0.5) : 0

      if (phase < 2) {
        ctx.fillStyle = PALETTE.bg
        ctx.fillRect(0, 0, lw, lh)

        starsRef.current.forEach((s) => {
          if (Math.sin(time * 0.003 + s.twinkle) > 0.2) {
            ctx.fillStyle = s.bright ? PALETTE.star : PALETTE.starDim
            ctx.fillRect(s.x, s.y, 1, 1)
          }
        })

        const maxR = Math.min(lw, lh) * (0.42 - shrink * 0.35)
        for (let a = 0; a < Math.PI * 2; a += 0.07) {
          const wobble = Math.sin(a * 4 + time * 0.008) * 2
          const r = maxR + wobble
          ctx.fillStyle = a % 0.6 > 0.3 ? PALETTE.wormholeRing : PALETTE.wormhole
          ctx.fillRect(
            Math.floor(cx + Math.cos(a) * r),
            Math.floor(cy + Math.sin(a) * r),
            1, 1,
          )
        }

        ctx.fillStyle = '#000'
        const holeR = Math.max(2, maxR * 0.2)
        for (let y = -holeR; y <= holeR; y++) {
          for (let x = -holeR; x <= holeR; x++) {
            if (x * x + y * y <= holeR * holeR) {
              ctx.fillRect(cx + x, cy + y, 1, 1)
            }
          }
        }

        if (phase >= 1) {
          ctx.fillStyle = `rgba(5,8,18,${0.15 + shrink * 0.5})`
          ctx.fillRect(0, 0, lw, lh)
        }
      } else {
        renderSolarFrame(ctx, lw, lh, time, starsRef.current, { mode: 'universe' })
        ctx.fillStyle = `rgba(5,8,18,${Math.max(0, 0.7 - (time % 800) / 800)})`
        ctx.fillRect(0, 0, lw, lh)
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [phase])

  return (
    <div className={`wormhole wormhole--p${phase} ${overlay ? 'wormhole--overlay' : ''}`}>
      <canvas ref={canvasRef} className="wormhole__canvas" aria-hidden="true" />
      <div className="wormhole__hud">
        <p className="wormhole__text">{title}</p>
        <p className="wormhole__text wormhole__text--sub">{subtitle}</p>
        <div className="wormhole__bars" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="wormhole__bar" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
