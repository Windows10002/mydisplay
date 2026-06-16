import { flightLogs } from '../data/content'
import { playBeep } from '../utils/sound'
import PixelButton from '../components/PixelButton'
import PixelNav from '../components/PixelNav'
import './FlightLog.css'

export default function FlightLog({ onNavigate }) {
  return (
    <div className="flight-log">
      <PixelNav onNavigate={onNavigate} />

      <div className="flight-log__inner container">
        <header className="flight-log__header">
          <span className="section-label">航行日志</span>
          <h1 className="section-title">MISSION LOG · 任务记录</h1>
          <p className="section-desc">调取历史航行记录，按时间序列排列。</p>
        </header>

        <div className="flight-log__terminal">
          <div className="flight-log__terminal-bar">
            <span>ENDURANCE LOG VIEWER</span>
            <span className="flight-log__blink">REC</span>
          </div>
          <div className="flight-log__entries">
            {flightLogs.map((entry, i) => (
              <article key={entry.code} className="flight-log__entry" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flight-log__entry-head">
                  <span className="flight-log__date">{entry.date}</span>
                  <span className="flight-log__code">{entry.code}</span>
                </div>
                <h2 className="flight-log__title">{entry.title}</h2>
                <p className="flight-log__body">&gt; {entry.body}</p>
              </article>
            ))}
          </div>
        </div>

        <footer className="flight-log__footer">
          <PixelButton variant="ghost" onClick={() => { playBeep('click'); onNavigate('console') }}>
            ← 返回控制台
          </PixelButton>
          <PixelButton variant="primary" onClick={() => { playBeep('click'); onNavigate('universe') }}>
            进入宇宙全景 →
          </PixelButton>
        </footer>
      </div>
    </div>
  )
}
