import { useEffect, useMemo, useState } from 'react'
import { profile } from '../../data/content'
import { playBeep } from '../../utils/sound'
import './IntroBlackoutTerminal.css'

function useTypewriter(lines, active, speed = 28) {
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
        if (charIdx % 5 === 0) playBeep('hover')
      }, speed)
      return () => clearTimeout(t)
    }
    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((i) => i + 1)
        setCharIdx(0)
      }, 350)
      return () => clearTimeout(t)
    }
    setDone(true)
  }, [active, lineIdx, charIdx, lines, done, speed])

  const visible = lines.slice(0, lineIdx + 1).map((l, i) =>
    i < lineIdx ? l : l.slice(0, charIdx),
  )

  return { visible, done }
}

export default function IntroBlackoutTerminal({ crew, onComplete }) {
  const [phase, setPhase] = useState('flash')

  const lines = useMemo(() => {
    const name = crew?.name ?? profile.name
    return [
      '> 船员身份终端',
      '> 正在同步档案…',
      `> 你好，地球人。我是${profile.name}。`,
      `> 来自${profile.origin}，现就读于${profile.education}。`,
      `> ${profile.intro.slice(0, 80)}…`,
      '> 读取完成，已同步至右侧屏幕',
    ]
  }, [crew])

  const { visible, done } = useTypewriter(lines, phase === 'terminal')

  useEffect(() => {
    const t = setTimeout(() => setPhase('terminal'), 420)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => onComplete?.(), 600)
    return () => clearTimeout(t)
  }, [done, onComplete])

  return (
    <div className={`intro-blackout intro-blackout--${phase}`} role="dialog" aria-label="自我介绍终端">
      {phase === 'terminal' && (
        <div className="intro-blackout__panel">
          <div className="intro-blackout__header">
            <span>自我介绍终端</span>
            <span className="intro-blackout__blink">录制中</span>
          </div>
          <div className="intro-blackout__screen">
            {visible.map((line) => (
              <p key={line} className="intro-blackout__line">{line}</p>
            ))}
            {!done && <span className="intro-blackout__cursor">█</span>}
          </div>
        </div>
      )}
    </div>
  )
}
