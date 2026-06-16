import { useState } from 'react'
import { SCHOLARSHIP_IMAGE } from '../../data/planetAssets'
import { playBeep } from '../../utils/sound'
import PixelLightbox from './PixelLightbox'
import './SaturnScholarship.css'

export default function SaturnScholarship({ className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className={`saturn-scholar ${className}`.trim()} aria-label="舰长档案 · 国家奖学金">
        <button
          type="button"
          className="saturn-scholar__medal"
          onClick={() => {
            playBeep('click')
            setOpen(true)
          }}
        >
          <span className="saturn-scholar__year">2025</span>
          <strong className="saturn-scholar__title">国家奖学金</strong>
          <span className="saturn-scholar__meta">专业前 1%</span>
          <span className="saturn-scholar__hint">点击查看证书</span>
        </button>
      </section>

      <PixelLightbox
        open={open}
        src={SCHOLARSHIP_IMAGE}
        alt="2025 国家奖学金荣誉证书"
        onClose={() => setOpen(false)}
      />
    </>
  )
}
