import { useRef, useState } from 'react'
import { STAR_EASTER_EGGS, STAR_TARGETS } from '../../data/consoleCommands'
import { playBeep } from '../../utils/sound'
import PixelSolarCanvas from '../PixelSolarCanvas'
import RangerHud from './RangerHud'

export default function InteractiveNavMap({
  selectedModule,
  onSelectTarget,
  onEasterEgg,
  idle,
}) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoverId, setHoverId] = useState(null)
  const dragRef = useRef(null)

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const onPointerMove = (e) => {
    if (!dragRef.current) return
    setPan({
      x: e.clientX - dragRef.current.x,
      y: e.clientY - dragRef.current.y,
    })
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const target = STAR_TARGETS.find((t) => t.id === hoverId)

  return (
    <div
      className={`nav-map ${idle ? 'nav-map--idle' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        className="nav-map__layer"
        style={{ transform: `translate(${pan.x * 0.15}px, ${pan.y * 0.15}px)` }}
      >
        <div className="console__viewport">
          <PixelSolarCanvas mode="console" />
          <RangerHud />
        </div>

        <div className="nav-map__targets">
          {STAR_TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`nav-map__dot nav-map__dot--${t.kind} ${selectedModule === t.module && hoverId === t.id ? 'is-locked' : ''}`}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              onMouseEnter={() => {
                setHoverId(t.id)
                playBeep('hover')
              }}
              onMouseLeave={() => setHoverId(null)}
              onClick={(e) => {
                e.stopPropagation()
                playBeep('lock')
                onSelectTarget(t.module, t)
              }}
            >
              <span className="nav-map__dot-core" />
            </button>
          ))}

          {STAR_EASTER_EGGS.map((egg) => (
            <button
              key={egg.id}
              type="button"
              className="nav-map__egg"
              style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
              title={egg.label}
              onClick={(e) => {
                e.stopPropagation()
                playBeep('ready')
                onEasterEgg(egg)
              }}
            >
              {egg.label}
            </button>
          ))}

          {target && (
            <>
              <svg className="nav-map__guide" aria-hidden="true">
                <line x1="50%" y1="50%" x2={`${target.x}%`} y2={`${target.y}%`} />
              </svg>
              <div
                className="nav-map__tooltip"
                style={{ left: `${target.x}%`, top: `${target.y - 8}%` }}
              >
                <strong>{target.label}</strong>
                <span>{target.sub}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <span className="console__viewport-cta">
        <span className="console__viewport-cta-tag">NAV</span>
        拖动星图 · 点击目标锁定模块
      </span>
    </div>
  )
}
