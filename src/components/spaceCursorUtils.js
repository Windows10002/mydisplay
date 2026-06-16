import { getMiniPlanets, getOrbitRadii } from '../data/solarSystemData'

export { getMiniPlanets as MINI_PLANETS_FN, getOrbitRadii }

/** @deprecated use getMiniPlanets() for synced speeds */
export const MINI_PLANETS = getMiniPlanets()

export const GRAVITY_PARTICLES = 22
export const TRAIL_MAX = 32

/** 获取 input/textarea 光标屏幕坐标 */
export function getCaretClientRect(input) {
  if (!input || input.selectionStart == null) return null

  const { selectionStart } = input
  const style = window.getComputedStyle(input)
  const mirror = document.createElement('div')
  const properties = [
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
    'textTransform', 'wordSpacing', 'textIndent', 'whiteSpace', 'lineHeight',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'boxSizing',
  ]

  mirror.style.position = 'absolute'
  mirror.style.visibility = 'hidden'
  mirror.style.whiteSpace = style.whiteSpace === 'normal' ? 'pre-wrap' : style.whiteSpace
  mirror.style.wordWrap = 'break-word'
  properties.forEach((key) => {
    mirror.style[key] = style[key]
  })
  mirror.style.width = `${input.clientWidth}px`
  mirror.style.top = '0'
  mirror.style.left = '-9999px'

  const before = input.value.slice(0, selectionStart)
  const after = input.value.slice(selectionStart) || '.'
  mirror.textContent = before
  const marker = document.createElement('span')
  marker.textContent = after[0] === '\n' ? ' ' : after[0]
  mirror.appendChild(marker)

  document.body.appendChild(mirror)
  const inputRect = input.getBoundingClientRect()
  const markerRect = marker.getBoundingClientRect()
  const mirrorRect = mirror.getBoundingClientRect()
  const top = markerRect.top - mirrorRect.top + inputRect.top - input.scrollTop
  const left = markerRect.left - mirrorRect.left + inputRect.left - input.scrollLeft
  document.body.removeChild(mirror)

  return { top, left, height: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2 || 18 }
}

export function isTextField(el) {
  if (!el) return false
  if (el.tagName === 'TEXTAREA') return true
  if (el.tagName !== 'INPUT') return false
  const type = (el.getAttribute('type') || 'text').toLowerCase()
  return !['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'hidden', 'range', 'color'].includes(type)
}

export function isInteractive(el) {
  if (!el) return false
  if (isTextField(el)) return false
  return !!el.closest(
    'a, button, [role="button"], select, input, textarea, .hero__cta, .navbar__link, .navbar__cta, .project-card, .ship-push, .ship-toggle, .pixel-lever, .pixel-dome, .px3d, .earth-tree, .earth-tree__trigger, .earth-tree__link, .earth-tree__visit, .mars-projector__hit, .jupiter-moon, .saturn-scholar__medal, .uranus-drift__head, .neptune-signal, .neptune-comms__launch, .nav-map__dot, .nav-map__egg, .console__viewport-btn, .console__morse, .solar-explorer__hotspot, .solar-explorer__close, .intro__choice, .intro__skip, .intro__guide-btn, .crt-mission__btn, .universe-hotspot, .pixel-btn, .planet-env__hud-info, .planet-env__back, .pixel-lightbox__close, .pixel-lightbox__nav button',
  )
}
