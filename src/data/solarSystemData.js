/** 八大行星共享数据：背景公转速度与光标迷你太阳系联动 */
export const ORBIT_TILT = 0.34
export const SUN_CENTER = { xRatio: 0.42, yRatio: 0.52 }

export const PLANETS = [
  {
    name: 'Mercury',
    orbit: 44,
    radius: 3.2,
    color: '#8a8a8a',
    highlight: '#b8b8b8',
    orbitSpeed: 0.00115,
    spinSpeed: 0.045,
    phase: 0,
    cursorSize: 0.55,
  },
  {
    name: 'Venus',
    orbit: 72,
    radius: 4.2,
    color: '#c4a06a',
    highlight: '#e8d4a8',
    orbitSpeed: 0.00095,
    spinSpeed: 0.018,
    phase: 0.785,
    cursorSize: 0.65,
  },
  {
    name: 'Earth',
    orbit: 104,
    radius: 4.4,
    color: '#2f6ea8',
    highlight: '#8ec8e8',
    orbitSpeed: 0.00082,
    spinSpeed: 0.05,
    phase: 1.57,
    cursorSize: 0.72,
  },
  {
    name: 'Mars',
    orbit: 138,
    radius: 3.4,
    color: '#b84a28',
    highlight: '#d87850',
    orbitSpeed: 0.0007,
    spinSpeed: 0.048,
    phase: 2.36,
    cursorSize: 0.58,
  },
  {
    name: 'Jupiter',
    orbit: 182,
    radius: 13,
    color: '#b8895a',
    highlight: '#dcc8a0',
    orbitSpeed: 0.00042,
    spinSpeed: 0.065,
    phase: 3.14,
    cursorSize: 1.05,
    bands: true,
  },
  {
    name: 'Saturn',
    orbit: 224,
    radius: 11,
    color: '#d8c898',
    highlight: '#f0e8c8',
    orbitSpeed: 0.00032,
    spinSpeed: 0.04,
    phase: 3.93,
    cursorSize: 0.88,
    ring: true,
  },
  {
    name: 'Uranus',
    orbit: 262,
    radius: 6.5,
    color: '#7ec8dc',
    highlight: '#b0e8f0',
    orbitSpeed: 0.00024,
    spinSpeed: 0.038,
    phase: 4.71,
    cursorSize: 0.7,
  },
  {
    name: 'Neptune',
    orbit: 298,
    radius: 6.2,
    color: '#3a52c4',
    highlight: '#6888e0',
    orbitSpeed: 0.00018,
    spinSpeed: 0.036,
    phase: 5.5,
    cursorSize: 0.68,
  },
]

export const CURSOR_SPEED_SCALE = 22

export function getMiniPlanets() {
  return PLANETS.map((p, i) => ({
    r: 4.1 + i * 0.88,
    size: p.cursorSize,
    color: p.color,
    speed: p.orbitSpeed * CURSOR_SPEED_SCALE,
    spin: p.spinSpeed * 1.4,
    phase: p.phase,
    ring: p.ring,
  }))
}

export function getOrbitRadii() {
  const unique = [...new Set(PLANETS.map((p) => p.orbit))]
  return unique.sort((a, b) => a - b)
}
