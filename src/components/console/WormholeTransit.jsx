import { useEffect, useRef, useState } from 'react'
import { playBeep, playWormholeTick } from '../../utils/sound'

const DURATION_MS = 2800

export default function WormholeTransit({ label, onComplete }) {
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    doneRef.current = false
    setProgress(0)
    playBeep('alert')
    playBeep('wormhole')

    const start = performance.now()
    let raf = 0
    let lastTickBand = -1

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      setProgress(100)
      playBeep('ready')
      window.setTimeout(() => onCompleteRef.current?.(), 350)
    }

    const tick = (now) => {
      const p = Math.min(100, ((now - start) / DURATION_MS) * 100)
      setProgress(p)
      const band = Math.floor(p / 12)
      if (band !== lastTickBand) {
        lastTickBand = band
        playWormholeTick(p / 100)
      }
      if (p >= 100) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }

    // setInterval 备份，避免 rAF 被浏览器节流时卡住
    const backup = window.setInterval(() => {
      const p = Math.min(100, ((performance.now() - start) / DURATION_MS) * 100)
      setProgress(p)
      if (p >= 100) {
        window.clearInterval(backup)
        finish()
      }
    }, 80)

    const hardStop = window.setTimeout(() => {
      window.clearInterval(backup)
      finish()
    }, DURATION_MS + 500)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(backup)
      window.clearTimeout(hardStop)
    }
  }, [])

  return (
    <div className="console-transit" aria-live="polite">
      <div className="console-transit__flash" />
      <div className="console-transit__core">
        <p className="console-transit__warn">⚠ WORMHOLE TRANSIT INITIATED</p>
        <p className="console-transit__label">{label}</p>
        <div className="console-transit__bar">
          <span className="console-transit__fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="console-transit__pct">TRANSIT PROGRESS · {Math.floor(progress)}%</p>
      </div>
    </div>
  )
}
