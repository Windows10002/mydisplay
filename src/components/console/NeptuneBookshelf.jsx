import { useEffect, useState } from 'react'
import { profile } from '../../data/content'
import { useArchiveToggle } from '../../hooks/useArchiveToggle'
import { playBeep } from '../../utils/sound'
import './NeptuneBookshelf.css'

const SIGNALS = [
  { id: 'email', label: 'FREQ · MAIL', value: profile.email, delay: 0 },
  { id: 'phone', label: 'FREQ · VOICE', value: profile.phone, delay: 0.4 },
  { id: 'loc', label: 'FREQ · GEO', value: profile.location, delay: 0.8 },
  { id: 'name', label: 'FREQ · ID', value: `${profile.name} · ${profile.callsign}`, delay: 1.2 },
]

export default function NeptuneBookshelf({ className = '' }) {
  const [activeSignal, selectSignal] = useArchiveToggle()
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)
  const [typed, setTyped] = useState('')

  const active = SIGNALS.find((s) => s.id === activeSignal)

  useEffect(() => {
    if (!active) {
      setTyped('')
      return undefined
    }
    setTyped('')
    let i = 0
    const text = active.value
    const timer = setInterval(() => {
      i += 1
      setTyped(text.slice(0, i))
      if (i >= text.length) clearInterval(timer)
    }, 28)
    return () => clearInterval(timer)
  }, [active])

  const handleSend = (e) => {
    e.preventDefault()
    playBeep('click')
    const lines = [
      body.trim(),
      '',
      '——',
      sender.trim() ? `来自：${sender.trim()}` : '来自：访客',
      '通过 ENDURANCE 海王星深空通讯站发送',
    ]
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject.trim() || '来自个人站点的联络')}&body=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className={`neptune-comms ${className}`.trim()} aria-label="舰长档案 · 联系方式">
      <form className="neptune-comms__capsule" onSubmit={handleSend} aria-label="海王星深空通讯胶囊">
        <h3 className="neptune-comms__title">深空信号 · 联络频段</h3>

        <div className="neptune-comms__signals">
          <div className="neptune-comms__bubbles">
            {SIGNALS.map((sig) => (
              <button
                key={sig.id}
                type="button"
                className={`neptune-signal ${activeSignal === sig.id ? 'is-live' : ''}`}
                style={{ animationDelay: `${sig.delay}s` }}
                onClick={() => {
                  playBeep('toggle')
                  selectSignal(sig.id)
                }}
              >
                <span className="neptune-signal__label">{sig.label}</span>
                <span className="neptune-signal__dot" aria-hidden="true" />
              </button>
            ))}
          </div>
          {active && (
            <div className="neptune-comms__readout" aria-live="polite">
              <span className="neptune-comms__cursor">&gt;</span>
              <span>{typed}<i className="neptune-comms__blink">_</i></span>
            </div>
          )}
        </div>

        <div className="neptune-comms__divider" aria-hidden="true" />

        <div className="neptune-comms__capsule-head">
          <span>信号胶囊 · 发往 {profile.email}</span>
        </div>
        <label className="neptune-comms__field">
          <span>称呼</span>
          <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="您的姓名" autoComplete="name" />
        </label>
        <label className="neptune-comms__field">
          <span>主题</span>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="项目合作 / 实习机会" />
        </label>
        <label className="neptune-comms__field">
          <span>正文</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="写下你想说的话…" rows={3} required />
        </label>
        <button type="submit" className="neptune-comms__launch">
          {sent ? '已唤起邮件客户端' : '发射邮件 →'}
        </button>
      </form>
    </section>
  )
}
