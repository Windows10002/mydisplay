/** 本地 Planets/ · 构建复制到 dist/Planets；Git 不追踪，Vercel 部署仍包含 */
export const PLANETS_BASE = (import.meta.env.VITE_PLANETS_BASE ?? '/Planets').replace(/\/$/, '')

/** Git 追踪的行星静态图（奖状、奖学金等） */
export const PLANET_STATIC_BASE = (import.meta.env.VITE_PLANET_STATIC_BASE ?? '/planet-media').replace(/\/$/, '')

export function planetMedia(relativePath) {
  const clean = relativePath.replace(/^\/+/, '')
  return `${PLANETS_BASE}/${clean}`
}

export function planetStatic(relativePath) {
  const clean = relativePath.replace(/^\/+/, '')
  return `${PLANET_STATIC_BASE}/${clean}`
}
