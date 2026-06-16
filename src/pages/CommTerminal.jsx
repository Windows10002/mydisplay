import { useState } from 'react'
import { profile } from '../data/content'
import { playBeep } from '../utils/sound'
import PixelButton from '../components/PixelButton'
import PixelNav from '../components/PixelNav'
import './CommTerminal.css'

export default function CommTerminal({ onNavigate }) {
  const [message, setMessage] = useState('')

  const send = () => {
    playBeep('click')
    window.location.href = `mailto:${profile.email}?body=${encodeURIComponent(message)}`
  }

  return (
    <div className="comm">
      <PixelNav current="comm" onNavigate={onNavigate} />

      <div className="comm__inner container">
        <header className="comm__header">
          <span className="section-label">通讯频道</span>
          <h1 className="section-title">远程通讯终端</h1>
          <p className="section-desc">建立与船员 {profile.name} 的远程通讯链路。</p>
        </header>

        <div className="comm__panel">
          <div className="comm__panel-top">
            <span className="comm__status comm__status--live">LINK ACTIVE</span>
            <span>CHANNEL · OPEN</span>
          </div>

          <dl className="comm__channels">
            <div>
              <dt>EMAIL</dt>
              <dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
            </div>
            <div>
              <dt>VOICE</dt>
              <dd><a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a></dd>
            </div>
            <div>
              <dt>LOCATION</dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>

          <div className="comm__form">
            <label className="comm__label" htmlFor="comm-msg">传输消息</label>
            <textarea
              id="comm-msg"
              className="comm__input"
              rows={4}
              placeholder="输入讯息，点击发送信号..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="comm__actions">
              <PixelButton variant="alert" onClick={send}>
                发送信号 →
              </PixelButton>
              <PixelButton variant="ghost" onClick={() => { playBeep('click'); onNavigate('crew') }}>
                查看船员档案
              </PixelButton>
            </div>
          </div>

          <div className="comm__qr" aria-hidden="true">
            <div className="comm__qr-frame">
              {Array.from({ length: 64 }, (_, i) => (
                <span
                  key={i}
                  className={`comm__qr-pixel ${(i * 7 + 13) % 3 === 0 ? 'comm__qr-pixel--on' : ''}`}
                />
              ))}
            </div>
            <span className="comm__qr-label">SCAN · CONTACT</span>
          </div>
        </div>

        <footer className="comm__footer">
          <PixelButton variant="ghost" onClick={() => { playBeep('click'); onNavigate('universe') }}>
            ← 返回宇宙
          </PixelButton>
        </footer>
      </div>
    </div>
  )
}
