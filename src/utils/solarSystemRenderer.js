import { ORBIT_TILT, PLANETS, SUN_CENTER } from '../data/solarSystemData'
import { drawEnduranceIcon } from './pixelEndurance'
import { drawOrbitEllipse, fillCircle, px, strokeCircle } from './pixelCanvas'

export const PALETTE = {
  bg: '#050812',
  star: '#d8e8ff',
  starDim: '#4a5a78',
  orbit: '#1a2848',
  orbitGlow: '#2a4068',
  sunCore: '#fff8e0',
  sunMid: '#ffb84a',
  sunOuter: '#FF7A2F',
  nebula: '#80E8FF',
  gargantua: '#cc5520',
  wormhole: '#c9a84c',
  wormholeRing: '#8a7a50',
}

export function createStars(count, lw, lh) {
  return Array.from({ length: count }, () => ({
    x: Math.floor(Math.random() * lw),
    y: Math.floor(Math.random() * lh),
    bright: Math.random() > 0.82,
    twinkle: Math.random() * Math.PI * 2,
    size: Math.random() > 0.92 ? 2 : 1,
  }))
}

function drawNebula(ctx, lw, lh, time, density = 48) {
  for (let i = 0; i < density; i++) {
    const bx = (lw * 0.72 + Math.sin(i * 0.9) * 30) | 0
    const by = (lh * 0.22 + Math.cos(i * 0.7) * 18) | 0
    if (time > 0 && i % 3 === 0) {
      px(ctx, bx + Math.sin(time * 0.0004 + i) * 2, by, PALETTE.nebula)
    } else {
      px(ctx, bx, by, '#1a3858')
    }
  }
}

function drawGargantua(ctx, lw, lh, time, scale = 1) {
  const cx = Math.floor(lw * 0.88)
  const cy = Math.floor(lh * 0.14)
  const r = 14 * scale
  for (let a = 0; a < Math.PI * 2; a += 0.1) {
    const wobble = Math.sin(a * 5 + time * 0.001) * 1.2
    px(ctx, cx + Math.cos(a) * (r + wobble), cy + Math.sin(a) * ((r + wobble) * 0.35), PALETTE.gargantua)
  }
  fillCircle(ctx, cx, cy, Math.max(2, 3 * scale), '#000')
}

function drawWormhole(ctx, cx, cy, time, radius = 10) {
  const pulse = Math.sin(time * 0.004) * 0.5 + 0.5
  const r = radius + Math.floor(pulse * 2)
  for (let a = 0; a < Math.PI * 2; a += 0.14) {
    const ring = r + 2 + Math.floor(Math.sin(a * 3 + time * 0.005) * 1.5)
    px(ctx, cx + Math.cos(a) * ring, cy + Math.sin(a) * ring, PALETTE.wormholeRing)
  }
  strokeCircle(ctx, cx, cy, r, PALETTE.wormhole)
  strokeCircle(ctx, cx, cy, Math.max(1, r - 2), '#ffffff')
  fillCircle(ctx, cx, cy, 2, PALETTE.bg)
}

function drawEndurance(ctx, x, y, time) {
  drawEnduranceIcon(ctx, x, y, time)
}

function drawPixelSun(ctx, cx, cy, time, scale = 1) {
  const pulse = Math.sin(time * 0.002) > 0.3 ? 1 : 0
  fillCircle(ctx, cx, cy, (8 + pulse) * scale, '#3a2010')
  fillCircle(ctx, cx, cy, (6 + pulse) * scale, PALETTE.sunOuter)
  fillCircle(ctx, cx, cy, 4.5 * scale, PALETTE.sunMid)
  fillCircle(ctx, cx, cy, 2.8 * scale, PALETTE.sunCore)
  px(ctx, cx - 1, cy, '#ffffff')
  px(ctx, cx, cy - 1, '#ffffff')
}

function drawPixelPlanet(ctx, planet, cx, cy, scale, time, sizeBoost = 1, orbitScale = 1, orbitTilt = ORBIT_TILT) {
  const angle = planet.phase + time * planet.orbitSpeed
  const px0 = Math.floor(cx + Math.cos(angle) * planet.orbit * scale * orbitScale)
  const py0 = Math.floor(cy + Math.sin(angle) * planet.orbit * scale * orbitScale * orbitTilt)
  const r = Math.max(3, Math.round(planet.radius * scale * 0.42 * sizeBoost))
  const spin = Math.floor(time * planet.spinSpeed * 0.02) % 4

  if (planet.ring) {
    for (let dx = -r * 3; dx <= r * 3; dx++) {
      if (Math.abs(dx) > r) {
        px(ctx, px0 + dx, py0, '#9a8a68')
        px(ctx, px0 + dx, py0 + 1, '#7a6a48')
      }
    }
  }

  fillCircle(ctx, px0, py0, r, planet.color)
  if (planet.highlight) px(ctx, px0 - 1 + (spin % 2), py0 - 1, planet.highlight)
  if (planet.bands) {
    for (let i = -1; i <= 1; i++) px(ctx, px0 + spin - 1, py0 + i, '#8a6030')
  }
}

/** 探索页 · 固定时刻快照，热点与行星对齐 */
export const EXPLORER_SNAPSHOT_TIME = 12000

/** 探索页轨道缩放 · 保证外行星留在视口内 */
export const EXPLORER_ORBIT_SCALE = 0.74

/** 探索页公转/自转倍率（越小越慢，便于点击） */
export const EXPLORER_MOTION_SCALE = 0.28

const EXPLORER_ORBIT = { dim: '#3d5a8a', bright: '#5a7ab8' }

function getMotionTime(time, mode) {
  return mode === 'explorer' ? time * EXPLORER_MOTION_SCALE : time
}

/**
 * @param {'universe'|'console'|'explorer'} mode
 */
export function renderSolarFrame(ctx, lw, lh, time, stars, opts = {}) {
  const mode = opts.mode ?? 'universe'
  const isExplorer = mode === 'explorer'
  const layout = getSolarLayout(mode)
  const {
    sunCenter = layout.sunCenter,
    scaleDivisor = layout.scaleDivisor,
    showGargantua = mode === 'universe',
    showShips = mode === 'universe',
    showWormhole = mode === 'console',
    vignetteSteps = mode === 'console' ? 4 : isExplorer ? 0 : 10,
  } = opts

  const scale = Math.min(lw, lh) / scaleDivisor
  const cx = lw * sunCenter.xRatio
  const cy = lh * sunCenter.yRatio
  const motionTime = getMotionTime(time, mode)
  const orbitScale = isExplorer ? EXPLORER_ORBIT_SCALE : 1
  const orbitTilt = isExplorer ? 0.28 : ORBIT_TILT

  ctx.fillStyle = PALETTE.bg
  ctx.fillRect(0, 0, lw, lh)

  stars.forEach((s) => {
    const on = s.bright || (time > 0 && Math.sin(time * 0.003 + s.twinkle) > (isExplorer ? 0.25 : 0.45))
    if (!on) return
    const col = s.bright ? PALETTE.star : PALETTE.starDim
    if (s.size > 1) fillCircle(ctx, s.x, s.y, 1, col)
    else px(ctx, s.x, s.y, col)
  })

  if (mode === 'universe' || isExplorer) drawNebula(ctx, lw, lh, motionTime, isExplorer ? 32 : 48)
  if (showGargantua) drawGargantua(ctx, lw, lh, time, mode === 'console' ? 0.55 : 1)
  if (showWormhole) drawWormhole(ctx, Math.floor(lw * 0.5), Math.floor(lh * 0.28), time, 7)

  const orbits = [...new Set(PLANETS.map((p) => p.orbit))]
  const orbitStep = isExplorer ? 0.05 : 0.1
  orbits.forEach((orbit, i) => {
    drawOrbitEllipse(
      ctx, cx, cy, orbit * scale * orbitScale, orbit * scale * orbitScale * orbitTilt,
      isExplorer
        ? (i % 2 === 0 ? EXPLORER_ORBIT.dim : EXPLORER_ORBIT.bright)
        : (i % 2 === 0 ? PALETTE.orbit : PALETTE.orbitGlow),
      orbitStep,
    )
  })

  drawPixelSun(ctx, cx, cy, motionTime, mode === 'console' ? 0.85 : 1)
  PLANETS.forEach((p) => drawPixelPlanet(ctx, p, cx, cy, scale, motionTime, 1, orbitScale, orbitTilt))

  if (showShips && time > 0) {
    drawEndurance(ctx, Math.floor(lw * 0.1 + Math.sin(time * 0.0008) * 6), Math.floor(lh * 0.3), time)
    drawEndurance(ctx, Math.floor(lw * 0.62 + Math.cos(time * 0.0006) * 10), Math.floor(lh * 0.75), time + 500)
  }

  for (let i = 0; i < vignetteSteps; i++) {
    const a = (i / vignetteSteps) * (mode === 'console' ? 0.08 : 0.14)
    ctx.fillStyle = `rgba(0,0,0,${a})`
    ctx.fillRect(i, i, lw - i * 2, lh - i * 2)
  }
}

export function getSolarLayout(mode = 'explorer') {
  if (mode === 'console') {
    return { sunCenter: { xRatio: 0.5, yRatio: 0.58 }, scaleDivisor: 105 }
  }
  if (mode === 'explorer') {
    return { sunCenter: { xRatio: 0.5, yRatio: 0.5 }, scaleDivisor: 212 }
  }
  return { sunCenter: SUN_CENTER, scaleDivisor: 175 }
}

/** 计算太阳与行星在屏幕上的百分比坐标（与 canvas 逻辑坐标一致） */
export function getSolarBodyPositions(lw, lh, time = EXPLORER_SNAPSHOT_TIME, mode = 'explorer') {
  const { sunCenter, scaleDivisor } = getSolarLayout(mode)
  const scale = Math.min(lw, lh) / scaleDivisor
  const cx = lw * sunCenter.xRatio
  const cy = lh * sunCenter.yRatio
  const motionTime = getMotionTime(time, mode)
  const orbitScale = mode === 'explorer' ? EXPLORER_ORBIT_SCALE : 1
  const orbitTilt = mode === 'explorer' ? 0.28 : ORBIT_TILT

  const toPct = (x, y) => ({
    x: (x / lw) * 100,
    y: (y / lh) * 100,
  })

  const positions = { sun: toPct(cx, cy) }

  const idByName = {
    Mercury: 'mercury',
    Venus: 'venus',
    Earth: 'earth',
    Mars: 'mars',
    Jupiter: 'jupiter',
    Saturn: 'saturn',
    Uranus: 'uranus',
    Neptune: 'neptune',
  }

  PLANETS.forEach((p) => {
    const angle = p.phase + motionTime * p.orbitSpeed
    const px0 = cx + Math.cos(angle) * p.orbit * scale * orbitScale
    const py0 = cy + Math.sin(angle) * p.orbit * scale * orbitScale * orbitTilt
    const key = idByName[p.name]
    if (key) positions[key] = toPct(px0, py0)
  })

  return positions
}

export function getStarCount(mode) {
  if (mode === 'console') return 90
  if (mode === 'explorer') return 160
  return 220
}
