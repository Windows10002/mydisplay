import { internships } from '../../data/content'
import { useArchiveToggle } from '../../hooks/useArchiveToggle'
import { playBeep } from '../../utils/sound'
import './UranusInternshipDrift.css'

export default function UranusInternshipDrift({ className = '' }) {
  const [activeIdx, selectCard] = useArchiveToggle()

  return (
    <section className={`uranus-drift ${className}`.trim()} aria-label="舰长档案 · 实习经历">
      <div className="uranus-drift__axis" aria-hidden="true">
        <span className="uranus-drift__globe" />
      </div>

      {internships.map((item, i) => {
        const active = activeIdx === i
        return (
          <article
            key={item.company}
            className={`uranus-drift__card uranus-drift__card--${i + 1} ${active ? 'is-open' : ''}`}
          >
            <button
              type="button"
              className="uranus-drift__head"
              onClick={() => {
                playBeep('click')
                selectCard(i)
              }}
              aria-expanded={active}
            >
              <span className="uranus-drift__period">{item.period}</span>
              <strong>{item.role}</strong>
              <span className="uranus-drift__company">{item.company}</span>
            </button>
            {active && (
              <div className="uranus-drift__body">
                <p className="uranus-drift__detail">{item.detail}</p>
                {item.highlights?.length > 0 && (
                  <ul className="uranus-drift__tags">
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
