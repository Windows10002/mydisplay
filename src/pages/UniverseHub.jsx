import { useState } from 'react'
import { categories } from '../data/categories'
import { playBeep } from '../utils/sound'
import PixelNav from '../components/PixelNav'
import PixelSolarCanvas from '../components/PixelSolarCanvas'
import './UniverseHub.css'

export default function UniverseHub({ onNavigate }) {
  const [hovered, setHovered] = useState(null)
  const [preview, setPreview] = useState(null)

  const enter = (id) => {
    playBeep('click')
    if (id === 'crew') {
      onNavigate('crew')
      return
    }
    onNavigate(`category-${id}`)
  }

  return (
    <div className="universe">
      <PixelSolarCanvas mode="universe" />
      <div className="universe__shade" aria-hidden="true" />

      <PixelNav current="universe" onNavigate={onNavigate} />

      <div className="universe__bodies">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`universe-hotspot universe-hotspot--${cat.type} ${hovered === cat.id ? 'is-hover' : ''}`}
            style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
            onMouseEnter={() => { setHovered(cat.id); setPreview(cat) }}
            onMouseLeave={() => { setHovered(null); setPreview(null) }}
            onFocus={() => setPreview(cat)}
            onBlur={() => setPreview(null)}
            onClick={() => enter(cat.id)}
          >
            <span className="universe-hotspot__ring" aria-hidden="true" />
            <span className="universe-hotspot__core" aria-hidden="true" />
            <span className="universe-hotspot__label">{cat.name}</span>
            <span className="universe-hotspot__code">{cat.label}</span>
          </button>
        ))}
      </div>

      {preview && (
        <aside className="universe__preview" aria-live="polite">
          <span className="universe__preview-code">{preview.label}</span>
          <strong>{preview.name}</strong>
          <p>{preview.description}</p>
          <span className="universe__preview-hint">点击进入 ›</span>
        </aside>
      )}

      <footer className="universe__hud">
        <span>当前航线：创作星域</span>
        <span>8 行星轨道稳定</span>
        <span className="universe__hud-blink">点击天体查看详细档案</span>
      </footer>
    </div>
  )
}
