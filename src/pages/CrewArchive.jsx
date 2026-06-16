import { profile, skills, stats, strengths } from '../data/content'
import { playBeep } from '../utils/sound'
import PixelButton from '../components/PixelButton'
import PixelNav from '../components/PixelNav'
import './CrewArchive.css'

export default function CrewArchive({ onNavigate }) {
  return (
    <div className="crew">
      <div className="crew__window" aria-hidden="true">
        <UniverseWindow />
      </div>
      <PixelNav onNavigate={onNavigate} />

      <div className="crew__inner container">
        <header className="crew__header">
          <span className="section-label">船员档案</span>
          <h1 className="section-title">基础信息 · CREW FILE</h1>
        </header>

        <div className="crew__grid">
          <div className="crew__portrait">
            <div className="crew__pixel-face" aria-hidden="true">
              <span className="crew__pixel-hair" />
              <span className="crew__pixel-eye crew__pixel-eye--l" />
              <span className="crew__pixel-eye crew__pixel-eye--r" />
              <span className="crew__pixel-mouth" />
            </div>
            <p className="crew__callsign">{profile.callsign}</p>
          </div>

          <div className="crew__file">
            <table className="crew__table">
              <tbody>
                <tr><th>姓名</th><td>{profile.name}</td></tr>
                <tr><th>英文名</th><td>{profile.nameEn}</td></tr>
                <tr><th>任务方向</th><td>{profile.role}</td></tr>
                <tr><th>教育</th><td>{profile.education}</td></tr>
                <tr><th>驻地</th><td>{profile.location}</td></tr>
                <tr><th>座右铭</th><td>{profile.tagline}</td></tr>
              </tbody>
            </table>
            <p className="crew__intro">{profile.intro}</p>
          </div>

          <div className="crew__systems">
            <h2 className="crew__systems-title">系统能力 · ENERGY</h2>
            {strengths.slice(0, 4).map((s) => (
              <div key={s.icon} className="crew__system">
                <span className="crew__system-label">{s.title}</span>
                <div className="crew__system-bar">
                  <div className="crew__system-fill" style={{ width: `${s.level}%` }} />
                </div>
                <span className="crew__system-val">{s.level}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crew__stats">
          {stats.map((s) => (
            <div key={s.label} className="crew__stat">
              <span>{s.value}</span>
              <small>{s.label}</small>
            </div>
          ))}
        </div>

        <div className="crew__skills">
          <h2 className="crew__skills-title">搭载模块</h2>
          <div className="crew__skill-tags">
            {skills.map((sk) => (
              <span key={sk} className="crew__skill-tag">{sk}</span>
            ))}
          </div>
        </div>

        <footer className="crew__footer">
          <PixelButton variant="ghost" onClick={() => { playBeep('click'); onNavigate('universe') }}>
            ← 返回宇宙
          </PixelButton>
          <PixelButton variant="primary" onClick={() => { playBeep('click'); onNavigate('comm') }}>
            打开通讯终端 →
          </PixelButton>
        </footer>
      </div>
    </div>
  )
}

function UniverseWindow() {
  return (
    <div className="crew-window-stars">
      {Array.from({ length: 24 }, (_, i) => (
        <span key={i} className="crew-window-star" style={{
          left: `${(i * 17) % 100}%`,
          top: `${(i * 23) % 100}%`,
          animationDelay: `${i * 0.15}s`,
        }}
        />
      ))}
    </div>
  )
}
