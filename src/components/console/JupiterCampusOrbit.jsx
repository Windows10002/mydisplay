import { useEffect, useRef } from 'react'
import { campusExperience } from '../../data/content'
import { useArchiveToggle } from '../../hooks/useArchiveToggle'
import { playBeep } from '../../utils/sound'
import './JupiterCampusOrbit.css'

const MOON_COUNT = campusExperience.length
const MOON_W = 14
const MOON_H = 14
const ORBIT_RADIUS = 200
const ORBIT_RADIUS_MOBILE = 140

function drawPixelMoon(ctx, accent = '#dcc8a0') {
  ctx.clearRect(0, 0, MOON_W, MOON_H)
  ctx.fillStyle = accent
  ctx.fillRect(4, 2, 6, 6)
  ctx.fillRect(3, 4, 8, 6)
  ctx.fillRect(4, 10, 6, 2)
  ctx.fillStyle = '#f0e8c8'
  ctx.fillRect(5, 3, 2, 2)
  ctx.fillStyle = '#8a6030'
  ctx.fillRect(7, 6, 2, 2)
}

function PixelMoon({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = MOON_W
    canvas.height = MOON_H
    ctx.imageSmoothingEnabled = false
    drawPixelMoon(ctx, active ? '#ffb84a' : '#dcc8a0')
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="jupiter-moon__pixel"
      width={MOON_W}
      height={MOON_H}
      aria-hidden="true"
    />
  )
}

export default function JupiterCampusOrbit({ className = '' }) {
  const [activeId, selectMoon] = useArchiveToggle()
  const active = campusExperience.find((c) => c.org === activeId)
  const radius = typeof window !== 'undefined' && window.innerWidth <= 640
    ? ORBIT_RADIUS_MOBILE
    : ORBIT_RADIUS

  return (
    <section className={`jupiter-orbit ${className}`.trim()} aria-label="舰长档案 · 校园经历">
      <div className="jupiter-orbit__hub">
        <div
          className="jupiter-orbit__track"
          style={{
            '--orbit-r': `${radius}px`,
          }}
          aria-hidden="true"
        />
        <div className="jupiter-orbit__ring">
          {campusExperience.map((item, i) => (
            <button
              key={item.org}
              type="button"
              className={`jupiter-moon ${activeId === item.org ? 'is-active' : ''}`}
              style={{
                '--angle': `${(360 / MOON_COUNT) * i}deg`,
                '--orbit-r': `${radius}px`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                playBeep('click')
                selectMoon(item.org)
              }}
              aria-expanded={activeId === item.org}
              aria-label={item.org}
            >
              <span className="jupiter-moon__inner">
                <PixelMoon active={activeId === item.org} />
                <span className="jupiter-moon__label">{item.org}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <aside className="jupiter-orbit__story" aria-live="polite">
          <span className="jupiter-orbit__story-period">{active.period}</span>
          <h3 className="jupiter-orbit__story-org">{active.org}</h3>
          <p className="jupiter-orbit__story-role">{active.role}</p>
          <p className="jupiter-orbit__story-detail">{active.detail}</p>
          {active.highlights?.length > 0 && (
            <ul className="jupiter-orbit__story-tags">
              {active.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </section>
  )
}
