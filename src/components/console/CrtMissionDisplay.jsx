import { useCallback, useEffect, useMemo, useState } from 'react'
import { honors, profile, projects, strengths } from '../../data/content'
import { MISSION_COMMANDS } from '../../data/consoleCommands'
import { playBeep, playTypeKey, playTypeLine } from '../../utils/sound'

function useTypewriter(lines, speed = 22, instant = false, typingSound = false) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(instant)

  useEffect(() => {
    if (instant) {
      setDone(true)
      return
    }
    setLineIdx(0)
    setCharIdx(0)
    setDone(false)
  }, [lines, instant])

  useEffect(() => {
    if (instant || done || !lines.length) return
    const line = lines[lineIdx]
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setCharIdx((c) => c + 1)
        if (typingSound) playTypeKey()
        else if (charIdx % 4 === 0) playBeep('hover')
      }, speed)
      return () => clearTimeout(t)
    }
    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((i) => i + 1)
        setCharIdx(0)
        if (typingSound) playTypeLine()
      }, 400)
      return () => clearTimeout(t)
    }
    setDone(true)
  }, [instant, lineIdx, charIdx, lines, done, speed, typingSound])

  const visible = instant
    ? lines
    : lines.slice(0, lineIdx + 1).map((l, i) =>
      i < lineIdx ? l : l.slice(0, charIdx),
    )

  const skip = useCallback(() => {
    setLineIdx(lines.length - 1)
    setCharIdx(lines[lines.length - 1]?.length ?? 0)
    setDone(true)
  }, [lines])

  return { visible, done, skip }
}

function buildLines(moduleId, crew) {
  const visitor = crew?.name
  switch (moduleId) {
    case 'intro':
      return [
        '【舰长档案】',
        `${profile.name} · ${profile.origin}`,
        profile.education,
        profile.intro,
        ...strengths.slice(0, 4).map((s) => `${s.title} · ${s.level}%`),
        visitor ? `当前访客：${visitor}` : '',
      ].filter(Boolean)
    case 'projects':
      return [
        '【项目数据包 · 跃迁接收】',
        ...projects.map((p) => `M${p.missionNo} · ${p.title}`),
        `共 ${projects.length} 项任务档案`,
      ]
    case 'awards':
      return [
        '【荣誉档案 · 即时检索】',
        ...honors.map((h) => `${h.year} · ${h.title}`),
      ]
    default:
      return ['暂无数据']
  }
}

export default function CrtMissionDisplay({ moduleId, crew, onReturn, onOpenFull, showActions = true }) {
  const cmd = MISSION_COMMANDS[moduleId]
  const lines = useMemo(() => buildLines(moduleId, crew), [moduleId, crew])
  const typeSpeed = moduleId === 'awards' ? 16 : moduleId === 'intro' ? 20 : 22
  const { visible, done, skip } = useTypewriter(lines, typeSpeed, false, moduleId === 'intro')

  return (
    <div className={`crt-mission crt-mission--${moduleId}`}>
      <div className="crt-mission__header">
        <span>{cmd?.completeMsg ?? '任务数据'}</span>
        {!done && (
          <button type="button" className="crt-mission__skip" onClick={skip}>
            跳过
          </button>
        )}
      </div>
      <div className="crt-mission__screen">
        {visible.map((line) => (
          <p key={line} className="crt-mission__line">&gt; {line}</p>
        ))}
        {!done && <span className="crt-terminal__cursor">█</span>}
      </div>

      {moduleId === 'intro' && done && (
        <div className="crt-mission__scan" aria-hidden="true">
          <div className="crt-mission__silhouette" />
          <p>{profile.name} · {profile.role}</p>
          <p className="crt-mission__scan-sub">{profile.tagline}</p>
        </div>
      )}

      {moduleId === 'projects' && done && (
        <ul className="crt-mission__cards">
          {projects.map((p) => (
            <li key={p.id} className="crt-mission__card">
              <strong>M{p.missionNo}</strong> {p.title}
              <span className="crt-mission__card-role">{p.role}</span>
              <p>{p.description.slice(0, 72)}…</p>
            </li>
          ))}
        </ul>
      )}

      {moduleId === 'awards' && done && (
        <ul className="crt-mission__cards crt-mission__cards--honors">
          {honors.map((h) => (
            <li key={h.title} className="crt-mission__card crt-mission__card--honor">
              <strong>{h.year}</strong> {h.title}
              <p>{h.detail}</p>
            </li>
          ))}
        </ul>
      )}

      {showActions && (
      <div className="crt-mission__actions">
        <button type="button" className="crt-mission__btn crt-mission__btn--ghost" onClick={onReturn}>
          ◀ 返回
        </button>
        <button type="button" className="crt-mission__btn" onClick={onOpenFull}>
          打开完整页面 ›
        </button>
      </div>
      )}
    </div>
  )
}
