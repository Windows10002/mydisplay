import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MOTIVATION_OPTIONS,
  activeComm,
  activeGlitch,
  activeTitle,
  getAutoScene,
} from '../data/introStory'
import {
  ensureAudio,
  isAudioSuspended,
  playCinematicSfx,
} from '../utils/cinematicAudio'
import { startIntroEngine } from '../utils/introEngine'
import './BoardingCinematic.css'

const FINALE_MS = 5500
const VIEWPORT_AT = 33000

function formatTime(ms) {
  return `0:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`
}

function CommLine({ lines }) {
  if (!lines.length) return null
  const line = lines[lines.length - 1]
  return (
    <p
      key={`${line.tag}-${line.text}`}
      className={`intro__comm ${line.ghost ? 'intro__comm--ghost' : ''} intro__comm--pop`}
    >
      <span className="intro__comm-tag">{line.tag}</span>
      {line.text}
      <span className="intro__cursor">▌</span>
    </p>
  )
}

export default function BoardingCinematic({ onComplete }) {
  const engineRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const lastGlitchKeyRef = useRef('')
  const lastCommKeyRef = useRef('')
  const lastTitleKeyRef = useRef('')

  const [ui, setUi] = useState({
    phase: 'auto',
    elapsed: 0,
    postMs: 0,
    motivation: null,
    exiting: false,
  })
  const [needsAudioUnlock, setNeedsAudioUnlock] = useState(() => isAudioSuspended())
  const [pickedId, setPickedId] = useState(null)
  const [scenePulse, setScenePulse] = useState('')

  onCompleteRef.current = onComplete

  const sceneId = ui.phase === 'auto'
    ? (ui.elapsed >= VIEWPORT_AT ? 'viewport' : getAutoScene(ui.elapsed)?.id ?? 'prologue')
    : ui.phase

  const localMs = ui.phase === 'auto'
    ? ui.elapsed - (getAutoScene(Math.min(ui.elapsed, VIEWPORT_AT - 1))?.start ?? 0)
    : ui.postMs

  const title = activeTitle(sceneId, localMs)
  const comms = activeComm(sceneId, localMs)
  const glitch = activeGlitch(sceneId, localMs)

  const totalMs = ui.phase === 'auto'
    ? ui.elapsed
    : VIEWPORT_AT + ui.postMs + (ui.phase === 'finale' ? FINALE_MS : 0)

  const unlockAudio = useCallback(async () => {
    const ok = await ensureAudio()
    if (ok) setNeedsAudioUnlock(false)
  }, [])

  const finishIntro = useCallback(() => {
    markIntroDone()
    setUi((u) => ({ ...u, exiting: true }))
    window.setTimeout(() => onCompleteRef.current(), 900)
  }, [])

  const skip = useCallback(() => {
    engineRef.current?.stop()
    markIntroDone()
    onCompleteRef.current()
  }, [])

  const pickMotivation = useCallback((opt) => {
    unlockAudio()
    setPickedId(opt.id)
    try { sessionStorage.setItem('endurance-intro-route', opt.id) } catch { /* ignore */ }
    engineRef.current?.pickMotivation(opt)
  }, [unlockAudio])

  const bindCanvas = useCallback((canvas) => {
    engineRef.current?.stop()
    engineRef.current = null
    if (!canvas) return

    engineRef.current = startIntroEngine(canvas, {
      onTick: (state) => setUi((prev) => {
        if (
          prev.phase === state.phase
          && prev.elapsed === state.elapsed
          && prev.postMs === state.postMs
          && prev.motivation === state.motivation
          && prev.exiting === state.exiting
        ) return prev
        return state
      }),
      onFinish: finishIntro,
      onSkip: () => {},
    })
  }, [finishIntro])

  useEffect(() => () => {
    engineRef.current?.stop()
    engineRef.current = null
  }, [])

  useEffect(() => {
    if (glitch) {
      const key = `${sceneId}:${glitch.at}`
      if (lastGlitchKeyRef.current !== key) {
        lastGlitchKeyRef.current = key
        playCinematicSfx('glitch')
        setScenePulse('intro--pulse')
        const t = window.setTimeout(() => setScenePulse(''), 400)
        return () => window.clearTimeout(t)
      }
    }
  }, [glitch?.at, sceneId])

  useEffect(() => {
    if (!comms.length) return
    const line = comms[comms.length - 1]
    const key = `${sceneId}:${line.tag}:${line.text}`
    if (lastCommKeyRef.current !== key) {
      lastCommKeyRef.current = key
      playCinematicSfx('comm')
    }
  }, [comms, sceneId])

  useEffect(() => {
    if (!title) return
    const key = `${sceneId}:${title.line ?? title.lines?.join('|') ?? ''}`
    if (lastTitleKeyRef.current !== key) {
      lastTitleKeyRef.current = key
      playCinematicSfx('title')
    }
  }, [title, sceneId])

  return (
    <div
      className={`intro ${ui.exiting ? 'intro--exit' : ''} ${scenePulse}`}
      onPointerDown={unlockAudio}
    >
      <canvas ref={bindCanvas} className="intro__canvas" />
      <div className="intro__vignette" />
      <div className="intro__scanlines" />

      {needsAudioUnlock && (
        <button type="button" className="intro__audio-hint" onClick={unlockAudio}>
          点击启用音效与氛围音乐
        </button>
      )}

      <div className="intro__hud">
        <div className="intro__hud-top">
          {title && (
            <div className="intro__title">
              {title.lines?.map((l) => <p key={l} className="intro__title-line">{l}</p>)}
              {title.line && <p className="intro__title-line">{title.line}</p>}
            </div>
          )}
          <CommLine lines={comms} />

          {ui.motivation && ui.phase === 'viewport' && (
            <p className="intro__comm intro__comm--pop"><span className="intro__comm-tag">记录</span>{ui.motivation.log}</p>
          )}
        </div>

        {ui.phase === 'finale' && ui.postMs > 3200 && (
          <div className="intro__finale">
            <p>永恒号指挥舱已激活</p>
            <p>李可欣：欢迎登舰，地球访客</p>
          </div>
        )}
      </div>

      {ui.phase === 'viewport' && ui.motivation && (
        <div className="intro__choice-confirm intro__choice-confirm--in">
          <p className="intro__choice-confirm-text">{ui.motivation.log}</p>
          <p className="intro__choice-confirm-hint">正在载入永恒号主控台…</p>
        </div>
      )}

      {ui.phase === 'viewport' && !ui.motivation && ui.postMs > 600 && (
        <div className="intro__choices-wrap intro__choices-wrap--in">
          <div className="intro__choices">
            <p className="intro__choices-host">你好，地球人。我是来自开普勒星球的李可欣。</p>
            <p className="intro__choices-prompt">永恒号舷窗外是深空。你想先从哪里开始参观？</p>
            {MOTIVATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`intro__choice ${pickedId === opt.id ? 'intro__choice--picked' : ''}`}
                onMouseEnter={() => playCinematicSfx('hover')}
                onFocus={() => playCinematicSfx('hover')}
                onClick={() => pickMotivation(opt)}
              >
                <span className="intro__choice-label">{opt.label}</span>
                <span className="intro__choice-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className="intro__skip" onClick={skip}>跳过 ››</button>
      <div className="intro__progress" style={{
        width: `${Math.min(100, ((ui.phase === 'viewport' && !ui.motivation
          ? VIEWPORT_AT
          : totalMs) / 42000) * 100)}%`,
      }} />
      <span className="intro__time">{formatTime(totalMs)}</span>
    </div>
  )
}

export function shouldSkipCinematic() {
  try { return sessionStorage.getItem('endurance-intro-done') === '1' } catch { return false }
}

export function markIntroDone() {
  try { sessionStorage.setItem('endurance-intro-done', '1') } catch { /* ignore */ }
}

export function markCinematicDone() { markIntroDone() }
