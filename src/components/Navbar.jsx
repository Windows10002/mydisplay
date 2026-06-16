import { useState, useEffect } from 'react'
import { navLinks } from '../data/content'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="#" className="navbar__logo" aria-label="首页">
          <span className="navbar__logo-mark">KX</span>
          <span className="navbar__logo-text">ENDURANCE</span>
        </a>

        <nav className="navbar__nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="navbar__cta">
          CONTACT
        </a>
      </div>
    </header>
  )
}
