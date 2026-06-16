import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from '../../data/content'
import { useMultiArchiveToggle } from '../../hooks/useMultiArchiveToggle'
import { playBeep } from '../../utils/sound'
import './EarthProjectTrees.css'

const SCALE = 7
const W = 36
const H = 48

function drawTree(ctx, growth, accent) {
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const g = Math.min(1, Math.max(0, growth))

  ctx.fillStyle = '#4a3828'
  ctx.fillRect(Math.floor(cx - 2), H - 18, 6, 16)
  ctx.fillStyle = '#5a4838'
  ctx.fillRect(Math.floor(cx - 1), H - 18, 4, 16)

  const canopyR = 10 + g * 5
  ctx.fillStyle = '#1a5038'
  for (let y = -canopyR; y <= 2; y++) {
    for (let x = -canopyR; x <= canopyR; x++) {
      if (x * x + y * y <= canopyR * canopyR) {
        ctx.fillRect(Math.floor(cx + x), Math.floor(H - 20 + y), 1, 1)
      }
    }
  }

  if (g > 0.15) {
    ctx.fillStyle = '#2a6848'
    const br = 7 + g * 4
    const lx = cx - 9 - g * 2
    const ly = H - 24 - g * 4
    for (let y = -br; y <= br; y++) {
      for (let x = -br; x <= br; x++) {
        if (x * x + y * y <= br * br) ctx.fillRect(Math.floor(lx + x), Math.floor(ly + y), 1, 1)
      }
    }
  }

  if (g > 0.45) {
    ctx.fillStyle = '#2a6848'
    const br = 7 + g * 3
    const rx = cx + 9 + g * 2
    const ry = H - 26 - g * 3
    for (let y = -br; y <= br; y++) {
      for (let x = -br; x <= br; x++) {
        if (x * x + y * y <= br * br) ctx.fillRect(Math.floor(rx + x), Math.floor(ry + y), 1, 1)
      }
    }
  }

  if (g > 0.7) {
    ctx.fillStyle = accent
    const tr = 6 + g * 2
    const ty = H - 34 - g * 6
    for (let y = -tr; y <= tr; y++) {
      for (let x = -tr; x <= tr; x++) {
        if (x * x + y * y <= tr * tr) ctx.fillRect(Math.floor(cx + x), Math.floor(ty + y), 1, 1)
      }
    }
  }
}

function TreeCanvas({ project, active, onToggle }) {
  const canvasRef = useRef(null)
  const [growth, setGrowth] = useState(0)

  useEffect(() => {
    if (!active) {
      setGrowth(0)
      return undefined
    }
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 700)
      setGrowth(t)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
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
    drawTree(ctx, growth, project.accent)
  }, [growth, project.accent])

  const openProject = (e) => {
    e.stopPropagation()
    if (!project.url) return
    playBeep('click')
    window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  const handleToggle = useCallback((e) => {
    e.stopPropagation()
    playBeep('click')
    onToggle(project.id)
  }, [onToggle, project.id])

  return (
    <div className={`earth-tree ${active ? 'is-grown' : ''}`}>
      <button
        type="button"
        className="earth-tree__trigger"
        onClick={handleToggle}
        aria-label={`${project.title} · ${active ? '再次点击关闭' : '查看介绍'}`}
        aria-expanded={active}
      >
        <canvas ref={canvasRef} className="earth-tree__canvas" aria-hidden="true" />
        <span className="earth-tree__link">{project.title}</span>
      </button>

      {active && (
        <div className="earth-tree__info">
          <span className="earth-tree__role">{project.role} · {project.period}</span>
          <p className="earth-tree__desc">{project.description}</p>
          {project.url && (
            <button type="button" className="earth-tree__visit" onClick={openProject}>
              访问项目 →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function EarthProjectTrees({ className = '' }) {
  const [, toggleTree, isTreeOpen] = useMultiArchiveToggle()

  return (
    <section className={`earth-trees ${className}`.trim()} aria-label="舰长档案 · 个人项目">
      {projects.map((p) => (
        <TreeCanvas
          key={p.id}
          project={p}
          active={isTreeOpen(p.id)}
          onToggle={toggleTree}
        />
      ))}
    </section>
  )
}
