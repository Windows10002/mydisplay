import { useEffect, useRef, useState } from 'react'
import { playBeep } from '../../utils/sound'
import { LEVER_PIXEL_SCALE, renderDualThrottle, setupLeverCanvas } from '../../utils/pixelLeverRenderer'
import './PixelPushLever.css'

const CANVAS_W = 88
const CANVAS_H = 96

/**
 * 双油门推杆 · 前推到底触发 onEngage
 */
export default function PixelPushLever({
  label = '推动',
  sublabel,
  hint,
  engageLabel = '确认',
  disabled = false,
  armed = true,
  size = 'md',
  className = '',
  onEngage,
  onMouseEnter,
}) {
  const canvasRef = useRef(null)
  const [pushed, setPushed] = useState(false)
  const [engaging, setEngaging] = useState(false)
  const stateRef = useRef({ pushed, armed, disabled })
  stateRef.current = { pushed, armed, disabled }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    setupLeverCanvas(canvas, ctx, CANVAS_W, CANVAS_H)

    let raf = 0
    const draw = (time) => {
      const { pushed: p, armed: a, disabled: d } = stateRef.current
      renderDualThrottle(ctx, CANVAS_W, CANVAS_H, { pushed: p, armed: a && !d, time })
      if (!d) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [disabled, armed, pushed])

  const handleClick = () => {
    if (disabled || engaging) return
    setEngaging(true)
    setPushed(true)
    playBeep('toggle')
    playBeep('launch')
    window.setTimeout(() => {
      onEngage?.()
      window.setTimeout(() => {
        setPushed(false)
        setEngaging(false)
      }, 480)
    }, 420)
  }

  const scale = size === 'lg' ? 1.15 : 1
  const w = CANVAS_W * LEVER_PIXEL_SCALE * scale
  const h = CANVAS_H * LEVER_PIXEL_SCALE * scale

  return (
    <div className={`pixel-lever pixel-lever--${size} ${armed ? 'pixel-lever--armed' : ''} ${disabled ? 'pixel-lever--disabled' : ''} ${className}`.trim()}>
      <button
        type="button"
        className={`pixel-lever__control ${pushed ? 'is-pushed' : ''}`}
        disabled={disabled || engaging}
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
        aria-label={label}
      >
        <span className="pixel-lever__sprite" style={{ width: w, height: h }}>
          <canvas ref={canvasRef} className="pixel-lever__canvas" style={{ width: w, height: h }} />
        </span>
        <span className="pixel-lever__label">{label}</span>
        {engageLabel && <span className="pixel-lever__engage-tag">{engageLabel}</span>}
      </button>
      {sublabel && <span className="pixel-lever__sub">{sublabel}</span>}
      {hint && <span className="pixel-lever__hint">{hint}</span>}
    </div>
  )
}
