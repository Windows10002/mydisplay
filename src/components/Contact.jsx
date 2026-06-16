import { profile } from '../data/content'
import './Contact.css'

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact__horizon" aria-hidden="true" />
      <div className="contact__vignette" aria-hidden="true" />

      <div className="contact__content container">
        <span className="section-label">Contact</span>
        <h2 className="contact__title">
          OPEN
          <br />
          <span className="contact__title-accent">CHANNEL</span>
        </h2>
        <p className="contact__desc">
          项目合作、实习机会，或一次简单的交流——信号穿越距离，始终可达。
        </p>

        <div className="contact__actions">
          <a href={`mailto:${profile.email}`} className="contact__btn contact__btn--primary">
            发送信号 →
          </a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact__btn contact__btn--ghost">
            {profile.phone}
          </a>
        </div>

        <div className="contact__info">
          <span>{profile.email}</span>
          <span className="contact__divider">·</span>
          <span>{profile.location}</span>
        </div>

        <footer className="contact__footer">
          <p>© 2026 {profile.name}</p>
        </footer>
      </div>
    </section>
  )
}
