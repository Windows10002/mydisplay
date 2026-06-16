import { profile, stats } from '../data/content'
import './Experience.css'

export default function Experience() {
  return (
    <section id="about" className="experience">
      <div className="container">
        <div className="experience__header">
          <span className="section-label">About</span>
          <h2 className="section-title">个人经历</h2>
        </div>

        <div className="experience__grid">
          <div className="experience__profile">
            <span className="experience__monogram">LK</span>

            <div className="experience__info">
              <h3 className="experience__name">{profile.name}</h3>
              <p className="experience__name-en">{profile.nameEn}</p>
              <p className="experience__edu">{profile.education}</p>
              <p className="experience__location">{profile.location}</p>
            </div>
          </div>

          <div className="experience__content">
            <p className="experience__intro">{profile.intro}</p>

            <div className="experience__contact">
              <a href={`mailto:${profile.email}`} className="experience__contact-item">
                <span className="experience__contact-icon">✉</span>
                {profile.email}
              </a>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="experience__contact-item">
                <span className="experience__contact-icon">☎</span>
                {profile.phone}
              </a>
            </div>
          </div>

          <div className="experience__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="experience__stat">
                <span className="experience__stat-value">{stat.value}</span>
                <span className="experience__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
