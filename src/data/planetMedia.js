/** 本地 Planets/ · 构建复制到 dist/Planets；Git 不追踪，Vercel 部署仍包含 */
export const PLANETS_BASE = (import.meta.env.VITE_PLANETS_BASE ?? '/Planets').replace(/\/$/, '')

export function planetMedia(relativePath) {
  const clean = relativePath.replace(/^\/+/, '')
  return `${PLANETS_BASE}/${clean}`
}
