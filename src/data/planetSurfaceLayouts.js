/**
 * 各行星表面资料展示方案
 */

export const PLANET_SURFACE_LAYOUT = {
  sun: { facts: 'flare', archive: null },
  mercury: { facts: 'telemetry', archive: 'resume' },
  venus: { facts: 'corrupted', archive: null },
  earth: { facts: 'orbit-grid', archive: 'trees' },
  mars: { facts: 'rover-log', archive: 'projector' },
  jupiter: { facts: 'bands', archive: 'campus-orbit' },
  saturn: { facts: 'ring-segments', archive: 'scholarship' },
  uranus: { facts: 'tilt-panel', archive: 'internship-drift' },
  neptune: { facts: 'data-stream', archive: 'bookshelf' },
}

export function getPlanetSurfaceLayout(planetId) {
  return PLANET_SURFACE_LAYOUT[planetId] ?? { facts: 'default', archive: 'default' }
}
