import { useEffect, useRef, useState } from 'react'
import { playBeep } from '../../utils/sound'
import {
  BUTTON_PIXEL_SCALE,
  renderAmberKeyButton,
  renderGreenKeyButton,
  renderVenusDeckButton,
  setupButtonCanvas,
} from '../../utils/pixelButtonRenderer'
import './Pixel3DButton.css'

const SIZES = {
  'green-cube': { w: 48, h: 42 },
  'amber-cube': { w: 56, h: 46 },
  'venus-portal': { w: 64, h: 50 },
}

/**
 * Canvas 像素立体键 · 与太阳系同套逐像素渲染
 * @param {'green-cube'|'venus-portal'|'amber-cube'} variant
 */
export default function Pixel3DButton({
  variant = 'green-cube',
  label,
  sublabel,
  hint,
  mark,
  disabled = false,
  armed = true,
  className = '',
  onClick,
  onMouseEnter,
}) {
  const canvasRef = useRef(null)
  const [pressed, setPressed] = useState(false)
  const stateRef = useRef({ pressed: false, armed, disabled, variant })
  stateRef.current = { pressed, armed, disabled, variant }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    const { w, h } = SIZES[variant] ?? SIZES['green-cube']
    setupButtonCanvas(canvas, ctx, w, h)

    let raf = 0
    const draw = (time) => {
      const { pressed: p, armed: a, variant: v } = stateRef.current
      ctx.clearRect(0, 0, w, h)

      if (v === 'venus-portal') {
        renderVenusDeckButton(ctx, w, h, { pressed: p, armed: a && !disabled, time })
      } else if (v === 'amber-cube') {
        renderAmberKeyButton(ctx, w, h, { pressed: p, armed: a && !disabled, time })
      } else {
        renderGreenKeyButton(ctx, w, h, { pressed: p, armed: a && !disabled, time })
      }

      if (!disabled && a) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [variant, disabled, armed, pressed])

  const fire = () => {
    if (disabled || pressed) return
    setPressed(true)
    playBeep('click')
    playBeep('toggle')
    window.setTimeout(() => {
      onClick?.()
      window.setTimeout(() => setPressed(false), 200)
    }, 130)
  }

  const isKey = variant !== 'venus-portal'
  const { w, h } = SIZES[variant] ?? SIZES['green-cube']

  return (
    <div className={`px3d px3d--${variant} ${armed ? 'px3d--armed' : ''} ${disabled ? 'px3d--disabled' : ''} ${className}`.trim()}>
      <button
        type="button"
        className={`px3d__btn ${pressed ? 'is-pressed' : ''}`}
        disabled={disabled}
        onMouseEnter={onMouseEnter}
        onClick={fire}
        aria-label={label}
      >
        <span
          className="px3d__sprite"
          style={{ width: w * BUTTON_PIXEL_SCALE, height: h * BUTTON_PIXEL_SCALE }}
        >
          <canvas ref={canvasRef} className="px3d__canvas" />
          {isKey && label && (
            <span className={`px3d__face-text px3d__face-text--${variant === 'amber-cube' ? 'amber' : 'green'}`}>
              <span className="px3d__face-label">{label}</span>
              {mark && <span className="px3d__face-mark">{mark}</span>}
            </span>
          )}
        </span>
        {variant === 'venus-portal' && label && (
          <span className="px3d__venus-caption">{label}</span>
        )}
      </button>
      {sublabel && <span className="px3d__sub">{sublabel}</span>}
      {hint && <span className="px3d__hint">{hint}</span>}
    </div>
  )
}
