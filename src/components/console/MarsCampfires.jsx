import { useEffect, useRef, useState } from 'react'
import { honors } from '../../data/content'
import { playBeep } from '../../utils/sound'
import './MarsCampfires.css'

const DISPLAY_HONORS = honors.slice(0, 4)
const SCALE = 4
const W = 24
const H = 28

function drawCampfire(ctx, burst) {
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#3a2818'
  ctx.fillRect(6, H - 6, 4, 3)
  ctx.fillRect(14, H - 6, 4, 3)
  ctx.fillRect(10, H - 5, 4, 2)

  const flicker = Math.sin(burst * 0.02) * 0.5 + 0.5
  ctx.fillStyle = '#ff7a2f'
  for (let y = H - 12; y < H - 6; y++) {
    const w = 3 + Math.floor(flicker * 2)
    ctx.fillRect(Math.floor(W / 2 - w + (y % 2)), y, w * 2, 1)
  }
  ctx.fillStyle = '#ffb84a'
  ctx.fillRect(Math.floor(W / 2 - 1), H - 11, 3, 2)
  ctx.fillRect(Math.floor(W / 2 - 2), H - 13, 5, 2)
}

function FireCanvas({ honor, active, onToggle }) {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])
  const burstRef = useRef(0)
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    if (!active) {
      sparksRef.current = []
      burstRef.current = 0
      setBurst(0)
      return undefined
    }
    playBeep('toggle')
    burstRef.current = performance.now()
    sparksRef.current = Array.from({ length: 18 }, (_, i) => ({
      x: W / 2 + (Math.random() - 0.5) * 4,
      y: H - 14,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -0.8 - Math.random() * 1.5,
      life: 20 + Math.floor(Math.random() * 16),
      max: 36,
    }))
    let raf = 0
    const loop = (now) => {
      setBurst(now)
      sparksRef.current = sparksRef.current
        .map((s) => ({ ...s, x: s.x + s.vx, y: s.y + s.vy, vy: s.vy + 0.06, life: s.life - 1 }))
        .filter((s) => s.life > 0)
      if (sparksRef.current.length || now - burstRef.current < 800) {
        raf = requestAnimationFrame(loop)
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = W
    canvas.height = H
    canvas.style.width = `${W * SCALE}px`
    canvas.style.height = `${H * SCALE}px`
    ctx.imageSmoothingEnabled = false
    drawCampfire(ctx, burst)
    sparksRef.current.forEach((s) => {
      const a = s.life / s.max
      ctx.fillStyle = a > 0.5 ? '#ffb84a' : '#ff7a2f'
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1)
      if (a > 0.3) {
        ctx.fillStyle = '#ffe8a0'
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y - 1), 1, 1)
      }
    })
  }, [burst])

  const label = honor.title.length > 10 ? `${honor.title.slice(0, 9)}…` : honor.title

  return (
    <button
      type="button"
      className={`mars-fire ${active ? 'is-burst' : ''}`}
      onClick={() => {
        playBeep('click')
        onToggle()
      }}
    >
      <canvas ref={canvasRef} className="mars-fire__canvas" aria-hidden="true" />
      <span className="mars-fire__name">{label}</span>
      {active && (
        <div className="mars-fire__info">
          <strong>{honor.title}</strong>
          <span className="mars-fire__year">{honor.year}</span>
          <p>{honor.detail}</p>
        </div>
      )}
    </button>
  )
}

export default function MarsCampfires({ className = '' }) {
  const [activeIdx, setActiveIdx] = useState(null)

  return (
    <section className={`mars-campfires ${className}`.trim()} aria-label="舰长档案 · 竞赛荣誉">
      {DISPLAY_HONORS.map((h, i) => (
        <FireCanvas
          key={h.title}
          honor={h}
          active={activeIdx === i}
          onToggle={() => setActiveIdx((idx) => (idx === i ? null : i))}
        />
      ))}
    </section>
  )
}
