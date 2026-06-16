import { useEffect, useRef } from 'react'
import { setupPixelCanvas } from '../utils/pixelCanvas'
import {
  drawClickRipples,
  drawConsoleCursor,
  drawConsoleTextCaret,
  drawCursorReticle,
  drawEngineExhaust,
  drawShipSparkles,
  drawSpaceship,
  drawTargetLock,
  drawTextCaretShip,
  movementToShipAngle,
} from '../utils/pixelSpaceship'
import {
  getCaretClientRect,
  GRAVITY_PARTICLES,
  isInteractive,
  isTextField,
  TRAIL_MAX,
} from './spaceCursorUtils'
import './SpaceCursor.css'

const PIXEL = 4

function getCursorVariant() {
  if (document.body.classList.contains('cursor-solar-explorer')) return 'solar'
  if (document.body.classList.contains('console-page')) return 'console'
  return 'default'
}

function initSparkles() {
  return Array.from({ length: GRAVITY_PARTICLES }, (_, i) => ({
    angle: (i / GRAVITY_PARTICLES) * Math.PI * 2,
    dist: 5 + (i % 5),
    speed: 0.04 + (i % 5) * 0.008,
    bright: i % 3 === 0,
  }))
}

export default function SpaceCursor() {
  const canvasRef = useRef(null)

  const mouseRef = useRef({ x: -9999, y: -9999, active: false, lastX: -9999, lastY: -9999 })
  const speedRef = useRef(0)
  const trailRef = useRef([])
  const ripplesRef = useRef([])
  const sparklesRef = useRef(initSparkles())
  const modeRef = useRef('default')
  const shipAngleRef = useRef(-Math.PI / 2)
  const focusedInputRef = useRef(null)
  const caretRef = useRef(null)
  const blinkRef = useRef(true)
  const clickFlashRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return undefined

    document.body.classList.add('space-cursor-active')

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    const resize = () => setupPixelCanvas(canvas, ctx)
    resize()
    window.addEventListener('resize', resize)

    const toLogical = (screen) => screen / PIXEL

    const updateCaret = () => {
      const input = focusedInputRef.current
      if (!input) {
        caretRef.current = null
        return
      }
      caretRef.current = getCaretClientRect(input)
    }

    const setMode = (next) => {
      modeRef.current = next
    }

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e
      const prev = mouseRef.current
      const vx = x - prev.lastX
      const vy = y - prev.lastY
      const moved = Math.hypot(vx, vy)

      speedRef.current = speedRef.current * 0.72 + moved * 0.28

      const nextAngle = movementToShipAngle(vx, vy)
      if (nextAngle != null) shipAngleRef.current = nextAngle

      mouseRef.current = { x, y, active: true, lastX: x, lastY: y }

      if (modeRef.current === 'text') return

      if (moved > 1.5 && modeRef.current !== 'click') {
        trailRef.current.push({
          x: toLogical(x),
          y: toLogical(y),
          life: 1,
          size: 1.2 + Math.min(2, moved * 0.08),
        })
        if (trailRef.current.length > TRAIL_MAX) trailRef.current.shift()
      }

      if (isInteractive(e.target)) setMode('hover')
      else if (modeRef.current === 'hover') setMode('default')
    }

    const onDown = (e) => {
      const lx = toLogical(e.clientX)
      const ly = toLogical(e.clientY)
      ripplesRef.current.push({ x: lx, y: ly, radius: 2, life: 1 })
      if (ripplesRef.current.length > 6) ripplesRef.current.shift()
      clickFlashRef.current = 1
      if (modeRef.current !== 'text') setMode('click')
    }

    const onUp = () => {
      if (modeRef.current === 'click') {
        setMode(isInteractive(document.elementFromPoint(mouseRef.current.x, mouseRef.current.y)) ? 'hover' : 'default')
      }
    }

    const onFocusIn = (e) => {
      if (isTextField(e.target)) {
        focusedInputRef.current = e.target
        if (document.body.classList.contains('console-crew-id')) {
          setMode('default')
        } else {
          setMode('text')
          updateCaret()
        }
      }
    }

    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (isTextField(document.activeElement)) {
          focusedInputRef.current = document.activeElement
          setMode('text')
          updateCaret()
        } else {
          focusedInputRef.current = null
          caretRef.current = null
          setMode('default')
        }
      })
    }

    const onInput = (e) => {
      if (e.target === focusedInputRef.current) updateCaret()
    }

    const onLeave = () => {
      mouseRef.current.active = false
      speedRef.current = 0
      setMode(focusedInputRef.current ? 'text' : 'default')
    }

    let rafId = 0
    let lastBlink = 0

    const draw = (time) => {
      const { width: lw, height: lh } = canvas
      ctx.clearRect(0, 0, lw, lh)

      if (time - lastBlink > 520) {
        blinkRef.current = !blinkRef.current
        lastBlink = time
      }

      clickFlashRef.current = Math.max(0, clickFlashRef.current - 0.08)

      const { x: mx, y: my, active } = mouseRef.current
      const mode = modeRef.current
      const variant = getCursorVariant()
      const lx = toLogical(mx)
      const ly = toLogical(my)
      const angle = shipAngleRef.current
      const speed = speedRef.current
      const boost = Math.min(1, speed / 16) + clickFlashRef.current * 0.5

      ripplesRef.current = ripplesRef.current
        .map((r) => ({ ...r, radius: r.radius + 0.6, life: r.life - 0.045 }))
        .filter((r) => r.life > 0)

      if (mode === 'text' && !document.body.classList.contains('console-crew-id')) {
        updateCaret()
        const caret = caretRef.current
        if (caret) {
          const cx = toLogical(caret.left)
          const cy = toLogical(caret.top + caret.height / 2)
          if (variant === 'console') {
            drawConsoleTextCaret(ctx, cx, cy, blinkRef.current)
          } else {
            drawTextCaretShip(ctx, cx, cy, blinkRef.current)
          }
        }
      } else if (active) {
        drawClickRipples(ctx, ripplesRef.current)

        if (variant === 'console') {
          drawConsoleCursor(ctx, lx, ly, time, mode === 'click' ? 'click' : mode)
        } else {
          if (mode === 'default' || mode === 'click') {
            drawCursorReticle(ctx, lx, ly, time, speed)
          }

          if (mode !== 'hover') {
            drawEngineExhaust(ctx, lx, ly, angle, trailRef.current, speed)
            drawShipSparkles(ctx, lx, ly, sparklesRef.current, speed)
            trailRef.current = trailRef.current
              .map((t) => ({ ...t, life: t.life - (0.06 + boost * 0.02) }))
              .filter((t) => t.life > 0)
          }

          if (mode === 'hover') {
            drawTargetLock(ctx, lx, ly, time * 0.004)
          }

          const scale = mode === 'hover' ? 1.2 : 1 + boost * 0.08
          drawSpaceship(ctx, lx, ly, angle, scale, boost)
        }
      }

      speedRef.current *= 0.92

      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    document.addEventListener('input', onInput)
    document.addEventListener('keyup', onInput)
    document.addEventListener('click', onInput)

    return () => {
      document.body.classList.remove('space-cursor-active')
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('input', onInput)
      document.removeEventListener('keyup', onInput)
      document.removeEventListener('click', onInput)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="space-cursor__canvas space-cursor__canvas--pixel"
      aria-hidden="true"
    />
  )
}
