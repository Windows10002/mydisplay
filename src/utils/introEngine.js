import {
  activeComm,
  activeGlitch,
  activeTitle,
  getAutoScene,
  sceneT,
} from '../data/introStory'
import { setupPixelCanvas } from './pixelCanvas'
import {
  playCinematicSfx,
  setIntroMood,
  startIntroAudio,
  stopCinematicAudio,
  tickIntroAudio,
} from './cinematicAudio'
import {
  drawCorridor,
  drawDock,
  drawFinale,
  drawGlitch,
  drawHatch,
  drawPrologue,
  drawSeal,
  drawViewport,
  initStars,
} from './introRenderer'

const VIEWPORT_AT = 33000
const FINALE_MS = 5500
/** 舷窗选择后停留，便于阅读字幕 */
const VIEWPORT_CHOICE_HOLD_MS = 4500

/**
 * Canvas 动画引擎（不依赖 React effect 生命周期）
 */
export function startIntroEngine(canvas, hooks) {
  let stopped = false
  let rafId = 0
  let tickId = 0
  let startAt = performance.now()
  let lastNow = startAt
  let postMs = 0
  let phase = 'auto'
  let motivation = null
  let exiting = false
  let finalePending = null
  let finaleTimer = 0
  let prevSceneId = ''
  const sfxFired = new Set()

  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) {
    console.error('[intro] 2d context unavailable')
    return { stop() {} }
  }

  let dims = { lw: 1, lh: 1 }
  let stars = []

  const resize = () => {
    dims = setupPixelCanvas(canvas, ctx)
    stars = initStars(200, dims.lw, dims.lh)
  }
  resize()

  startIntroAudio()
  setIntroMood('prologue')
  playCinematicSfx('breath')

  const snapshot = () => ({
    phase,
    elapsed: Math.max(0, performance.now() - startAt),
    postMs,
    motivation,
    exiting,
  })

  const emit = () => {
    hooks.onTick?.(snapshot())
  }

  const beginFinale = (opt) => {
    if (motivation || finalePending) return
    playCinematicSfx('confirm')
    motivation = opt
    emit()
    finalePending = opt
    finaleTimer = window.setTimeout(() => {
      finalePending = null
      phase = 'finale'
      postMs = 0
      playCinematicSfx('boot')
      emit()
    }, VIEWPORT_CHOICE_HOLD_MS)
  }

  const finish = () => {
    if (exiting) return
    exiting = true
    stopped = true
    stopCinematicAudio()
    hooks.onFinish?.()
    emit()
  }

  const frame = (now) => {
    if (stopped) return

    try {
      const dt = Math.min(50, Math.max(0, now - lastNow))
      lastNow = now
      const elapsed = now - startAt

      if (phase === 'auto') {
        if (elapsed >= VIEWPORT_AT) {
          phase = 'viewport'
          postMs = 0
        }
      } else {
        postMs += dt
      }

      const sid = phase === 'auto'
        ? (elapsed >= VIEWPORT_AT ? 'viewport' : getAutoScene(elapsed)?.id ?? 'prologue')
        : phase

      const autoScene = getAutoScene(elapsed)
      const local = phase === 'auto'
        ? elapsed - (autoScene?.start ?? 0)
        : postMs

      tickIntroAudio(sid, local, prevSceneId, sfxFired)
      prevSceneId = sid

      if (phase === 'finale' && postMs >= FINALE_MS) {
        finish()
        return
      }

      const { lw, lh } = dims
      const sidDraw = sid
      const t = phase === 'auto'
        ? sceneT(elapsed, autoScene)
        : Math.min(1, postMs / FINALE_MS)

      ctx.fillStyle = '#030508'
      ctx.fillRect(0, 0, lw, lh)

      switch (sidDraw) {
        case 'prologue': drawPrologue(ctx, lw, lh, now, t, stars); break
        case 'dock': drawDock(ctx, lw, lh, now, t, stars); break
        case 'hatch': drawHatch(ctx, lw, lh, now, t); break
        case 'seal': drawSeal(ctx, lw, lh, now, t); break
        case 'corridor': drawCorridor(ctx, lw, lh, now, t); break
        case 'viewport': drawViewport(ctx, lw, lh, now, Math.min(1, postMs / 2200), stars); break
        case 'finale': drawFinale(ctx, lw, lh, now, t, motivation?.sub); break
        default: drawPrologue(ctx, lw, lh, now, 0.5, stars)
      }

      if (sidDraw && activeGlitch(sidDraw, local)) drawGlitch(ctx, lw, lh, now, 42)
    } catch (err) {
      console.error('[intro] frame error', err)
    }

    rafId = requestAnimationFrame(frame)
  }

  const onResize = () => resize()
  const onVisible = () => {
    if (document.visibilityState === 'visible') lastNow = performance.now()
  }

  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisible)
  tickId = window.setInterval(emit, 100)
  rafId = requestAnimationFrame(frame)
  emit()

  return {
    pickMotivation: beginFinale,
    skip: () => {
      stopped = true
      stopCinematicAudio()
      hooks.onSkip?.()
    },
    stop() {
      stopped = true
      window.clearTimeout(finaleTimer)
      window.clearInterval(tickId)
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisible)
      stopCinematicAudio()
    },
  }
}
