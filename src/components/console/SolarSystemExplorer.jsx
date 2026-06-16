import { useEffect, useRef, useState } from 'react'
import { SOLAR_BODY_META } from '../../data/solarSystemBodies'
import { PIXEL_SIZE } from '../../utils/pixelCanvas'
import { getSolarBodyPositions } from '../../utils/solarSystemRenderer'
import {
  playPlanetScan,
  playPlanetSelect,
  playSolarEnter,
  playSolarExit,
  stopSolarAmbience,
} from '../../utils/solarAmbience'
import PixelSolarCanvas from '../PixelSolarCanvas'
import PlanetEnvironment from './PlanetEnvironment'
import './SolarSystemExplorer.css'

function useExplorerPositions() {
  const [positions, setPositions] = useState({})

  useEffect(() => {
    let raf = 0

    const sync = (t) => {
      const lw = Math.max(1, Math.floor(window.innerWidth / PIXEL_SIZE))
      const lh = Math.max(1, Math.floor(window.innerHeight / PIXEL_SIZE))
      setPositions(getSolarBodyPositions(lw, lh, t, 'explorer'))
    }

    const tick = (t) => {
      sync(t)
      raf = requestAnimationFrame(tick)
    }

    sync(performance.now())
    raf = requestAnimationFrame(tick)

    const onResize = () => sync(performance.now())
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return positions
}

export default function SolarSystemExplorer({ onClose }) {
  const [hovered, setHovered] = useState(null)
  const [envPlanet, setEnvPlanet] = useState(null)
  const positions = useExplorerPositions()
  const lastScanRef = useRef(0)
  const lastHoverRef = useRef(null)

  useEffect(() => {
    playSolarEnter()
    return () => stopSolarAmbience()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (envPlanet) {
        setEnvPlanet(null)
        return
      }
      playSolarExit()
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, envPlanet])

  const pick = (body) => {
    playPlanetSelect()
    setEnvPlanet(body.id)
  }

  const handleHover = (bodyId) => {
    if (lastHoverRef.current === bodyId) return
    lastHoverRef.current = bodyId
    const now = performance.now()
    if (now - lastScanRef.current < 180) return
    lastScanRef.current = now
    playPlanetScan()
  }

  const handleClose = () => {
    playSolarExit()
    onClose()
  }

  if (envPlanet) {
    return (
      <PlanetEnvironment
        planetId={envPlanet}
        onBack={() => setEnvPlanet(null)}
      />
    )
  }

  return (
    <div className="solar-explorer" role="dialog" aria-label="探索太阳系">
      <PixelSolarCanvas mode="explorer" />
      <div className="solar-explorer__shade" aria-hidden="true" />

      <header className="solar-explorer__hud">
        <div>
          <span className="solar-explorer__hud-title">探索太阳系</span>
          <span className="solar-explorer__hud-sub">点击星球 · 进入行星特征环境</span>
        </div>
        <button type="button" className="solar-explorer__close" onClick={handleClose}>
          返回控制台 (Esc)
        </button>
      </header>

      <div className="solar-explorer__bodies">
        {SOLAR_BODY_META.map((body) => {
          const pos = positions[body.id]
          if (!pos) return null
          return (
            <button
              key={body.id}
              type="button"
              className={`solar-explorer__hotspot solar-explorer__hotspot--${body.kind} ${hovered === body.id ? 'is-hover' : ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                '--planet-color': body.color,
              }}
              onMouseEnter={() => { setHovered(body.id); handleHover(body.id) }}
              onMouseLeave={() => { setHovered(null); lastHoverRef.current = null }}
              onClick={() => pick(body)}
            >
              <span className="solar-explorer__hotspot-ring" aria-hidden="true" />
              <span className="solar-explorer__hotspot-label">{body.label} · {body.name}</span>
            </button>
          )
        })}
      </div>

      <aside className="solar-explorer__hint" aria-live="polite">
        <p>找到轨道上的彩色像素星球</p>
        <p>点击进入对应行星环境 · 查看特征与档案</p>
      </aside>

      <footer className="solar-explorer__footer">
        <span>等待选择天体</span>
        <span>8 行星轨道 · 像素导航</span>
      </footer>
    </div>
  )
}
