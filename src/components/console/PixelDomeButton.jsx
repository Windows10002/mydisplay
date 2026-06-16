import { useEffect, useRef, useState } from 'react'
import { playBeep } from '../../utils/sound'
import {
  BUTTON_PIXEL_SCALE,
  renderFlatPressButton,
  setupButtonCanvas,
} from '../../utils/pixelButtonRenderer'
import './PixelDomeButton.css'

const CANVAS_W = 44
const CANVAS_H = 18

/** 平面像素按钮 · 槽内按下 */
export default function PixelDomeButton({
  label = '播放',
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
  const stateRef = useRef({ pressed, armed, disabled })
  stateRef.current = { pressed, armed, disabled }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    setupButtonCanvas(canvas, ctx, CANVAS_W, CANVAS_H)

    let raf = 0
    const draw = (time) => {
      const { pressed: p, armed: a, disabled: d } = stateRef.current
      renderFlatPressButton(ctx, CANVAS_W, CANVAS_H, { pressed: p, armed: a && !d, time })
      if (!d && a) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [disabled, armed, pressed])

  const fire = () => {
    if (disabled || pressed) return
    setPressed(true)
    playBeep('click')
    playBeep('toggle')
    window.setTimeout(() => {
      onClick?.()
      window.setTimeout(() => setPressed(false), 200)
    }, 140)
  }

  return (
    <div className={`pixel-dome ${armed ? 'pixel-dome--armed' : ''} ${disabled ? 'pixel-dome--disabled' : ''} ${className}`.trim()}>
      <button
        type="button"
        className={`pixel-dome__btn ${pressed ? 'is-pressed' : ''}`}
        disabled={disabled}
        onMouseEnter={onMouseEnter}
        onClick={fire}
        aria-label={label}
      >
        <span
          className="pixel-dome__sprite"
          style={{ width: CANVAS_W * BUTTON_PIXEL_SCALE, height: CANVAS_H * BUTTON_PIXEL_SCALE }}
        >
          <canvas ref={canvasRef} className="pixel-dome__canvas" />
          <span className="pixel-dome__face">
            <span className="pixel-dome__label">{label}</span>
            {mark && <span className="pixel-dome__mark">{mark}</span>}
          </span>
        </span>
      </button>
      {sublabel && <span className="pixel-dome__sub">{sublabel}</span>}
      {hint && <span className="pixel-dome__hint">{hint}</span>}
    </div>
  )
}
