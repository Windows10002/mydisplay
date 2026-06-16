import { useEffect, useRef } from 'react'
import { setupPixelCanvas } from '../utils/pixelCanvas'
import { createStars, getStarCount, renderSolarFrame } from '../utils/solarSystemRenderer'
import './PixelSolarCanvas.css'

/**
 * @param {'universe'|'console'|'explorer'} mode
 * @param {string} className
 */
export default function PixelSolarCanvas({ mode = 'universe', className = '' }) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dims = { lw: 1, lh: 1 }
    let raf = 0

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
      starsRef.current = createStars(getStarCount(mode), dims.lw, dims.lh)
    }
    resize()

    const parent = canvas.parentElement
    const ro = parent ? new ResizeObserver(resize) : null
    if (ro && parent) ro.observe(parent)
    else window.addEventListener('resize', resize)

    const draw = (time) => {
      const frameTime = reduced ? 0 : time
      renderSolarFrame(ctx, dims.lw, dims.lh, frameTime, starsRef.current, { mode })
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [mode])

  return (
    <canvas
      ref={canvasRef}
      className={`pixel-solar-canvas pixel-solar-canvas--${mode} ${className}`.trim()}
      aria-hidden="true"
    />
  )
}
