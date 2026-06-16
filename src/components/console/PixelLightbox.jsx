import { useEffect } from 'react'
import { playBeep } from '../../utils/sound'
import './PixelLightbox.css'

export default function PixelLightbox({
  open,
  src,
  alt = '',
  index = 0,
  total = 1,
  onClose,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onPrev, onNext])

  if (!open || !src) return null

  return (
    <div className="pixel-lightbox" role="dialog" aria-modal="true" aria-label={alt || '图片预览'}>
      <button type="button" className="pixel-lightbox__backdrop" onClick={() => { playBeep('panel'); onClose?.() }} aria-label="关闭" />
      <div className="pixel-lightbox__frame">
        <img src={src} alt={alt} className="pixel-lightbox__img" />
        {total > 1 && (
          <div className="pixel-lightbox__nav">
            <button type="button" onClick={() => { playBeep('click'); onPrev?.() }} aria-label="上一张">‹</button>
            <span>{index + 1} / {total}</span>
            <button type="button" onClick={() => { playBeep('click'); onNext?.() }} aria-label="下一张">›</button>
          </div>
        )}
        <button type="button" className="pixel-lightbox__close" onClick={() => { playBeep('panel'); onClose?.() }}>
          关闭 (Esc)
        </button>
      </div>
    </div>
  )
}
