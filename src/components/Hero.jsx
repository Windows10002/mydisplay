import { profile, stats } from '../data/content'
import './Hero.css'

export default function Hero() {
  const [statMain] = stats

  return (
    <section className="hero">
      <div className="hero__letterbox hero__letterbox--top" />
      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__meta reveal">
          <span className="hero__meta-dot" />
          <span className="hero__meta-text">ENDURANCE · 航行日志</span>
        </div>

        <h1 className="hero__title reveal" style={{ animationDelay: '0.12s' }}>
          <span className="hero__title-cn">{profile.name}</span>
          <span className="hero__title-en">KEXIN</span>
        </h1>

        <p className="hero__tagline reveal" style={{ animationDelay: '0.22s' }}>
          {profile.tagline}
        </p>
      </div>

      <div className="hero__dock hero__dock--left reveal" style={{ animationDelay: '0.3s' }}>
        <div className="hero__dock-stat">
          <span className="hero__dock-value">{statMain.value}</span>
          <span className="hero__dock-label">{statMain.label}</span>
        </div>
        <div className="hero__dock-line" />
        <p className="hero__dock-note">{profile.education}</p>
      </div>

      <div className="hero__dock hero__dock--right reveal" style={{ animationDelay: '0.35s' }}>
        <a href="#projects" className="hero__cta">查看档案 →</a>
        <a href="#contact" className="hero__cta-secondary">建立联系</a>
      </div>

      <div className="hero__telemetry container" aria-hidden="true">
        <span>SHIP · ENDURANCE</span>
        <span>VELOCITY · 0.01 C</span>
        <span>SECTOR · ORION ARM</span>
        <span>T+ 00:14:32</span>
      </div>

      <div className="hero__letterbox hero__letterbox--bottom" />
    </section>
  )
}
