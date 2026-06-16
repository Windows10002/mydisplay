import { useCallback, useEffect, useRef, useState } from 'react'
import { getPlanetArchive, getPlanetEnvironment } from '../../data/planetEnvironments'
import { bilibiliEmbedUrl, isBilibiliUrl } from '../../utils/bilibili'
import { renderPlanetEnvironment } from '../../utils/planetEnvironmentRenderer'
import { setupPixelCanvas } from '../../utils/pixelCanvas'
import { playBeep } from '../../utils/sound'
import { playPlanetEnvironmentEnter, playPlanetSelect } from '../../utils/solarAmbience'
import { PlanetFactsPanel, PlanetSurfaceData } from './PlanetDataPanels'
import Pixel3DButton from './Pixel3DButton'
import PixelDomeButton from './PixelDomeButton'
import './PlanetEnvironment.css'
import './PlanetDataPanels.css'
import './EarthProjectTrees.css'
import './MarsProjector.css'
import './MercuryResume.css'
import './JupiterCampusOrbit.css'
import './SaturnScholarship.css'
import './UranusInternshipDrift.css'
import './NeptuneBookshelf.css'
import './PixelLightbox.css'

export default function PlanetEnvironment({ planetId, onBack }) {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const embedRef = useRef(null)
  const env = getPlanetEnvironment(planetId)
  const archive = getPlanetArchive(planetId)
  const [showFacts, setShowFacts] = useState(false)
  const [mediaActive, setMediaActive] = useState(false)
  const hasVideo = Boolean(env?.video)
  const isBilibili = isBilibiliUrl(env?.video)

  useEffect(() => {
    playPlanetEnvironmentEnter()
    setShowFacts(false)
    setMediaActive(false)
  }, [planetId])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
    if (!isBilibili) {
      const v = videoRef.current
      if (v) {
        v.pause()
        v.muted = true
      }
    }
    setMediaActive(false)
  }, [isBilibili])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (document.fullscreenElement || mediaActive) {
        playBeep('panel')
        exitFullscreen()
        return
      }
      playBeep('panel')
      onBack()
    }
    const onFsChange = () => {
      if (!document.fullscreenElement && mediaActive) {
        if (!isBilibili) {
          const v = videoRef.current
          if (v) {
            v.pause()
            v.muted = true
          }
        }
        setMediaActive(false)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFsChange)
    }
  }, [mediaActive, onBack, exitFullscreen, isBilibili])

  useEffect(() => {
    if (!mediaActive || !isBilibili) return undefined
    const el = embedRef.current
    if (!el?.requestFullscreen) return undefined
    el.requestFullscreen().catch(() => {})
    return undefined
  }, [mediaActive, isBilibili])

  useEffect(() => {
    if (!env || hasVideo) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dims = { lw: 1, lh: 1 }
    let raf = 0

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (time) => {
      renderPlanetEnvironment(ctx, dims.lw, dims.lh, reduced ? 0 : time, env)
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [env, hasVideo])

  useEffect(() => {
    if (!env || !hasVideo || mediaActive) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dims = { lw: 1, lh: 1 }
    let raf = 0

    const resize = () => {
      dims = setupPixelCanvas(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (time) => {
      renderPlanetEnvironment(ctx, dims.lw, dims.lh, reduced ? 0 : time, env)
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [env, hasVideo, mediaActive])

  if (!env || !archive) return null

  const toggleFacts = () => {
    playBeep('panel')
    setShowFacts((v) => !v)
  }

  const engageVideo = async () => {
    playPlanetSelect()
    setMediaActive(true)
    if (isBilibili) return

    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.currentTime = 0
    try {
      await v.play()
      if (v.requestFullscreen) await v.requestFullscreen()
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
    } catch {
      /* keep overlay active even if autoplay blocked */
    }
  }

  return (
    <div className={`planet-env planet-env--${planetId} ${hasVideo ? 'planet-env--has-video' : ''} ${mediaActive ? 'planet-env--media-active' : ''}`} role="dialog" aria-label={`${env.label}环境`}>
      {hasVideo && isBilibili && (
        <div
          ref={embedRef}
          className={`planet-env__embed ${mediaActive ? 'planet-env__embed--active' : ''}`}
        >
          {mediaActive && (
            <iframe
              className="planet-env__embed-frame"
              src={bilibiliEmbedUrl(env.video, { autoplay: true })}
              title={`${env.label} · Bilibili`}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      )}
      {hasVideo && !isBilibili && (
        <video
          ref={videoRef}
          className={`planet-env__video ${mediaActive ? 'planet-env__video--active' : ''}`}
          src={env.video}
          playsInline
          preload="metadata"
        />
      )}
      {(!hasVideo || !mediaActive) && (
        <canvas ref={canvasRef} className="planet-env__canvas" aria-hidden="true" />
      )}
      <div className="planet-env__shade" aria-hidden="true" />

      {!mediaActive && (
        <header className="planet-env__hud">
          <button
            type="button"
            className={`planet-env__hud-info ${showFacts ? 'is-open' : ''}`}
            onClick={toggleFacts}
            aria-expanded={showFacts}
            aria-label={`${env.label} · ${showFacts ? '隐藏' : '查看'}环境特征`}
          >
            <span className="planet-env__category">{env.categoryLabel}</span>
            <h1 className="planet-env__title">{env.label}</h1>
            <p className="planet-env__tagline">{env.tagline}</p>
            <span className="planet-env__hud-hint">{showFacts ? '再次点击收起环境特征' : '点击查看环境特征'}</span>
          </button>
          <button type="button" className="planet-env__back" onClick={() => { playBeep('panel'); onBack() }}>
            返回轨道 (Esc)
          </button>
        </header>
      )}

      {mediaActive && (
        <div className="planet-env__fs-hud" aria-live="polite">
          <span>{env.label} · 沉浸式播放</span>
          <span>Esc 退出全屏</span>
        </div>
      )}

      {!mediaActive && showFacts && hasVideo && (
        <PlanetFactsPanel
          planetId={planetId}
          facts={env.facts}
          className="planet-env__facts-overlay"
        />
      )}

      {!mediaActive && !hasVideo && (
        <PlanetSurfaceData
          planetId={planetId}
          facts={env.facts}
          archive={archive}
          showFacts={showFacts}
        />
      )}

      {!mediaActive && hasVideo && planetId === 'sun' && (
        <PixelDomeButton
          className="pixel-dome--under-sun"
          label="播放"
          mark="AIGC"
          sublabel="全屏播放 AIGC 作品集"
          hint="Esc 退出全屏"
          armed
          onClick={engageVideo}
          onMouseEnter={() => playBeep('hover')}
        />
      )}

      {!mediaActive && hasVideo && planetId === 'venus' && (
        <Pixel3DButton
          className="px3d--planet px3d--planet-venus"
          variant="venus-portal"
          label="开启作品集"
          sublabel="全屏播放个人作品集"
          hint="点击磁带 · Esc 退出"
          mark="▶"
          armed
          onClick={engageVideo}
          onMouseEnter={() => playBeep('hover')}
        />
      )}

      {!mediaActive && hasVideo && planetId !== 'sun' && planetId !== 'venus' && (
        <Pixel3DButton
          className="px3d--planet px3d--planet-other"
          variant="green-cube"
          label="播放"
          sublabel={env.videoEngageSub ?? '全屏播放'}
          hint="Esc 退出全屏"
          armed
          onClick={engageVideo}
          onMouseEnter={() => playBeep('hover')}
        />
      )}

      {!mediaActive && (
        <footer className="planet-env__footer">
          <span>{env.label} · {hasVideo ? '等待启动播放' : archive.name}</span>
          <span>ENDURANCE · 行星表面探测</span>
        </footer>
      )}
    </div>
  )
}
