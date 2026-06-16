import { useEffect, useState } from 'react'
import { profile } from '../../data/content'
import './MercuryResume.css'

const RESUME_ROWS = [
  { label: '姓名', value: profile.name },
  { label: '代号', value: profile.callsign },
  { label: '院校', value: profile.education },
  { label: '在读', value: profile.educationPeriod },
  { label: '籍贯', value: profile.hometown },
  { label: '坐标', value: profile.location },
  { label: '爱好', value: '阅读、打羽毛球、游泳' },
  { label: '排名', value: '专业前 1%' },
  { label: '荣誉', value: '2025 国家奖学金' },
]

export default function MercuryResume({ className = '' }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className={`mercury-resume ${className}`.trim()} aria-label="舰长档案 · 基础档案">
      <article className={`mercury-resume__paper ${entered ? 'is-entered' : ''}`}>
        <div className="mercury-resume__scan" aria-hidden="true" />
        <div className="mercury-resume__corner mercury-resume__corner--tl" aria-hidden="true" />
        <div className="mercury-resume__corner mercury-resume__corner--br" aria-hidden="true" />
        <div className="mercury-resume__fold" aria-hidden="true" />

        <header className="mercury-resume__head">
          <div className="mercury-resume__badge" aria-hidden="true">☿</div>
          <div>
            <span className="mercury-resume__stamp">CREW FILE</span>
            <h2 className="mercury-resume__title">基础档案</h2>
            <p className="mercury-resume__sub">MERCURY · PERSONNEL RECORD</p>
          </div>
        </header>

        <div className="mercury-resume__divider" aria-hidden="true" />

        <dl className="mercury-resume__body">
          {RESUME_ROWS.map(({ label, value }, i) => (
            <div
              key={label}
              className="mercury-resume__row"
              style={{ '--row-i': i }}
            >
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <footer className="mercury-resume__foot">
          <p className="mercury-resume__tagline">{profile.tagline}</p>
          <p className="mercury-resume__intro">{profile.intro}</p>
        </footer>
      </article>
    </section>
  )
}
