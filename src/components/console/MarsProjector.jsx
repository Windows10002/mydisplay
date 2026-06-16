import { useEffect, useRef, useState } from 'react'
import { AWARD_SLIDESHOW } from '../../data/planetAssets'
import { playBeep } from '../../utils/sound'
import PixelLightbox from './PixelLightbox'
import './MarsProjector.css'

const SCALE = 5
const SCENE_W = 160
const SCENE_H = 100

function drawProjectorScene(ctx, time, playing, img) {
  ctx.clearRect(0, 0, SCENE_W, SCENE_H)

  const monX = 50
  const monY = 8
  const monW = 100
  const monH = 62
  const projX = 8
  const projY = SCENE_H - 24

  ctx.fillStyle = '#2a2018'
  ctx.fillRect(projX, projY, 32, 14)
  ctx.fillRect(projX + 8, projY - 10, 18, 12)
  ctx.fillStyle = '#1a1410'
  ctx.fillRect(projX + 24, projY + 2, 10, 6)
  ctx.fillStyle = playing ? '#ffb84a' : '#6a5040'
  ctx.fillRect(projX + 10, projY + 4, 5, 4)

  if (playing) {
    const flicker = Math.sin(time * 0.008) * 0.15 + 0.85
    ctx.fillStyle = `rgba(255, 184, 74, ${0.14 * flicker})`
    ctx.beginPath()
    ctx.moveTo(projX + 28, projY + 2)
    ctx.lineTo(monX + 4, monY + monH - 4)
    ctx.lineTo(monX + monW - 4, monY + monH - 4)
    ctx.lineTo(projX + 30, projY + 8)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = '#1a1814'
  ctx.fillRect(monX - 4, monY + monH, monW + 8, 6)
  ctx.fillStyle = '#0a0808'
  ctx.fillRect(monX, monY, monW, monH)

  if (playing && img) {
    ctx.drawImage(img, monX + 3, monY + 3, monW - 6, monH - 6)
    const scan = Math.floor(time * 0.04) % (monH - 10)
    ctx.fillStyle = 'rgba(255, 120, 60, 0.06)'
    ctx.fillRect(monX + 3, monY + 3 + scan, monW - 6, 2)
  } else {
    ctx.fillStyle = '#141820'
    ctx.fillRect(monX + 3, monY + 3, monW - 6, monH - 6)
    ctx.fillStyle = '#ffb84a'
    ctx.fillRect(monX + monW / 2 - 6, monY + monH / 2 - 8, 4, 16)
    ctx.fillRect(monX + monW / 2 - 6, monY + monH / 2 - 8, 14, 4)
    ctx.fillRect(monX + monW / 2 + 2, monY + monH / 2 - 4, 4, 12)
    ctx.fillRect(monX + monW / 2 - 2, monY + monH / 2 + 4, 12, 4)
  }
}

export default function MarsProjector({ className = '' }) {
  const canvasRef = useRef(null)
  const timeRef = useRef(0)
  const imgRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const currentSrc = AWARD_SLIDESHOW[slideIdx]

  useEffect(() => {
    if (!playing) {
      imgRef.current = null
      setImgLoaded(false)
      return undefined
    }
    const img = new Image()
    img.src = currentSrc
    img.onload = () => {
      imgRef.current = img
      setImgLoaded(true)
    }
    return undefined
  }, [playing, currentSrc])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    canvas.width = SCENE_W
    canvas.height = SCENE_H
    canvas.style.width = `${SCENE_W * SCALE}px`
    canvas.style.height = `${SCENE_H * SCALE}px`
    ctx.imageSmoothingEnabled = false

    let raf = 0
    const loop = (now) => {
      timeRef.current = now
      drawProjectorScene(ctx, now, playing, imgRef.current)
      if (playing) raf = requestAnimationFrame(loop)
    }
    drawProjectorScene(ctx, timeRef.current, playing, imgRef.current)
    if (playing) raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, imgLoaded, slideIdx])

  const startPlay = () => {
    playBeep('click')
    setSlideIdx(0)
    setPlaying(true)
    setLightboxOpen(true)
  }

  const stopPlay = () => {
    playBeep('panel')
    setPlaying(false)
    setLightboxOpen(false)
  }

  const goPrev = () => {
    playBeep('click')
    setSlideIdx((i) => (i - 1 + AWARD_SLIDESHOW.length) % AWARD_SLIDESHOW.length)
  }

  const goNext = () => {
    playBeep('click')
    setSlideIdx((i) => (i + 1) % AWARD_SLIDESHOW.length)
  }

  return (
    <>
      <section className={`mars-projector ${className} ${playing ? 'is-playing' : ''}`.trim()} aria-label="舰长档案 · 竞赛荣誉">
        <div className="mars-projector__stage">
          {!playing ? (
            <button type="button" className="mars-projector__hit" onClick={startPlay} aria-label="点击投影仪播放奖状">
              <canvas ref={canvasRef} className="mars-projector__scene" aria-hidden="true" />
              <span className="mars-projector__hint">点击投影仪 · 开始放映奖状</span>
              <span className="mars-projector__subhint">放映后使用「上一张 / 下一张」手动换页</span>
            </button>
          ) : (
            <>
              <canvas ref={canvasRef} className="mars-projector__scene" aria-hidden="true" />
              <div className="mars-projector__controls">
                <button type="button" onClick={goPrev} aria-label="上一张">‹ 上一张</button>
                <span>{slideIdx + 1} / {AWARD_SLIDESHOW.length}</span>
                <button type="button" onClick={goNext} aria-label="下一张">下一张 ›</button>
              </div>
              <button type="button" className="mars-projector__stop" onClick={stopPlay}>停止放映</button>
            </>
          )}
        </div>
      </section>

      <PixelLightbox
        open={lightboxOpen}
        src={currentSrc}
        alt={`竞赛奖状 ${slideIdx + 1}`}
        index={slideIdx}
        total={AWARD_SLIDESHOW.length}
        onClose={stopPlay}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  )
}
