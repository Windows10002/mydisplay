import { useEffect, useState } from 'react'
import { BOOT_CHECKS } from '../../data/consoleCommands'
import { playBeep } from '../../utils/sound'

export default function ConsoleBoot({ onComplete }) {
  const [lineIdx, setLineIdx] = useState(-1)
  const [lineOk, setLineOk] = useState(false)
  const [leds, setLeds] = useState(() => BOOT_CHECKS.map(() => 'off'))

  useEffect(() => {
    if (lineIdx >= BOOT_CHECKS.length) {
      const t = setTimeout(() => {
        playBeep('ready')
        onComplete()
      }, 600)
      return () => clearTimeout(t)
    }

    if (lineIdx < 0) {
      const t = setTimeout(() => setLineIdx(0), 400)
      return () => clearTimeout(t)
    }

    setLineOk(false)
    setLeds((prev) => prev.map((_, i) => (i === lineIdx ? 'cal' : i < lineIdx ? 'nom' : 'off')))
    playBeep('panel')

    const failT = setTimeout(() => {
      setLineOk(true)
      playBeep('click')
      setLeds((prev) => prev.map((_, i) => (i <= lineIdx ? 'nom' : 'off')))
    }, 520)

    const nextT = setTimeout(() => setLineIdx((i) => i + 1), 900)

    return () => {
      clearTimeout(failT)
      clearTimeout(nextT)
    }
  }, [lineIdx, onComplete])

  return (
    <div className="console-boot">
      <div className="console-boot__screen">
        <p className="console-boot__title">ENDURANCE · PRE-FLIGHT CHECK</p>
        <ul className="console-boot__list">
          {BOOT_CHECKS.map((item, i) => (
            <li
              key={item.id}
              className={`console-boot__line ${i < lineIdx ? 'is-ok' : ''} ${i === lineIdx && !lineOk ? 'is-cal' : ''} ${i === lineIdx && lineOk ? 'is-ok' : ''}`}
            >
              <span className="console-boot__tag">{item.text}</span>
              <span className="console-boot__state">
                {i < lineIdx || (i === lineIdx && lineOk) ? 'NOMINAL' : i === lineIdx ? 'CALIBRATING...' : '···'}
              </span>
            </li>
          ))}
        </ul>
        <div className="console-boot__leds">
          {BOOT_CHECKS.map((item, i) => (
            <span key={item.id} className={`console-boot__led console-boot__led--${leds[i]}`}>
              {item.id.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
