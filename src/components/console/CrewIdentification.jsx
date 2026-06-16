import { useEffect, useState } from 'react'
import { hostIntroLines, profile } from '../../data/content'
import { guestCallsign, saveCrewSession } from '../../data/consoleCommands'
import { playBeep } from '../../utils/sound'

function useTypewriter(lines, active, speed = 32) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    setLineIdx(0)
    setCharIdx(0)
    setDone(false)
  }, [active, lines])

  useEffect(() => {
    if (!active || done || !lines.length) return
    const line = lines[lineIdx]
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setCharIdx((c) => c + 1)
        if (charIdx % 6 === 0) playBeep('hover')
      }, speed)
      return () => clearTimeout(t)
    }
    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((i) => i + 1)
        setCharIdx(0)
      }, 480)
      return () => clearTimeout(t)
    }
    setDone(true)
  }, [active, lineIdx, charIdx, lines, done, speed])

  const visible = lines.slice(0, lineIdx + 1).map((l, i) =>
    i < lineIdx ? l : l.slice(0, charIdx),
  )

  return { visible, done }
}

export default function CrewIdentification({ onComplete }) {
  const [phase, setPhase] = useState('intro')
  const [name, setName] = useState('')
  const call = guestCallsign()
  const { visible, done } = useTypewriter(hostIntroLines, phase === 'intro')

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setPhase('welcome'), 700)
      return () => clearTimeout(t)
    }
    return undefined
  }, [done])

  const submit = (e) => {
    e?.preventDefault()
    const trimmed = name.trim() || '地球访客'
    saveCrewSession(trimmed, call)
    playBeep('ready')
    onComplete({ name: trimmed, callsign: call })
  }

  return (
    <div className="console-crew-id" role="dialog" aria-labelledby="crew-id-title">
      <div className="console-crew-id__panel console-crew-id__panel--wide">
        {phase === 'intro' && (
          <>
            <p className="console-crew-id__tag">永恒号 · 通讯接入</p>
            <div className="console-crew-id__terminal">
              {visible.map((line) => (
                <p key={line} className="console-crew-id__line">{line}</p>
              ))}
              {!done && <span className="console-crew-id__cursor">█</span>}
            </div>
            <p className="console-crew-id__host">— {profile.name} · {profile.origin}</p>
          </>
        )}

        {phase === 'welcome' && (
          <form onSubmit={submit}>
            <p className="console-crew-id__tag">访客登记</p>
            <h2 id="crew-id-title" className="console-crew-id__title">欢迎登舰，地球人</h2>
            <p className="console-crew-id__hint">
              我是{profile.name}，请留下你的称呼，方便在控制台记录本次参观。
            </p>
            <input
              className="console-crew-id__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的称呼（可跳过）"
              maxLength={24}
              autoFocus
            />
            <p className="console-crew-id__call">访客编号 · {call}</p>
            <button type="submit" className="console-crew-id__btn">进入控制台</button>
          </form>
        )}
      </div>
    </div>
  )
}
