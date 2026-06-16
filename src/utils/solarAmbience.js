/** 太阳系 · 星际穿越风格环境音（柔和管风琴感，非惊悚） */

let ac = null
let padNodes = null
let arpTimer = null

const ORGAN = [130.81, 164.81, 196, 261.63]

function getAc() {
  if (!ac) {
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (ac.state === 'suspended') ac.resume()
  return ac
}

function softTone({ freq, dur, vol = 0.012, delay = 0, type = 'sine' }) {
  const ctx = getAc()
  if (!ctx) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.08)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export function startSolarAmbience() {
  stopSolarAmbience()
  const ctx = getAc()
  if (!ctx) return

  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const pads = ORGAN.map((freq) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.value = 0.018 / ORGAN.length
    osc.connect(g)
    g.connect(master)
    osc.start()
    return { osc, g }
  })

  const t = ctx.currentTime
  master.gain.setValueAtTime(0, t)
  master.gain.linearRampToValueAtTime(1, t + 2.5)

  let step = 0
  arpTimer = setInterval(() => {
    const note = ORGAN[step % ORGAN.length] * 2
    softTone({ freq: note, dur: 1.2, vol: 0.004, type: 'triangle' })
    step += 1
  }, 4200)

  padNodes = { ctx, master, pads }
}

export function stopSolarAmbience() {
  if (arpTimer) {
    clearInterval(arpTimer)
    arpTimer = null
  }
  if (!padNodes) return
  const { ctx, master, pads } = padNodes
  const t = ctx.currentTime
  try {
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(master.gain.value, t)
    master.gain.linearRampToValueAtTime(0, t + 1.2)
    pads.forEach(({ osc }) => osc.stop(t + 1.3))
  } catch { /* noop */ }
  padNodes = null
}

/** 进入太阳系 */
export function playSolarEnter() {
  ;[0, 0.35, 0.7, 1.05].forEach((d, i) => {
    softTone({ freq: ORGAN[i] ?? 196, dur: 1.8, vol: 0.01, delay: d, type: 'sine' })
  })
  startSolarAmbience()
}

/** 悬停天体 */
export function playPlanetScan() {
  softTone({ freq: 392, dur: 0.15, vol: 0.005, type: 'sine' })
  softTone({ freq: 523.25, dur: 0.2, vol: 0.004, delay: 0.08, type: 'triangle' })
}

/** 选中 · 降落 */
export function playPlanetSelect() {
  ;[523.25, 440, 349.23, 261.63].forEach((f, i) => {
    softTone({ freq: f, dur: 0.55, vol: 0.007, delay: i * 0.14, type: 'sine' })
  })
}

/** 进入行星环境 */
export function playPlanetEnvironmentEnter() {
  softTone({ freq: 98, dur: 2, vol: 0.008, type: 'sine' })
  softTone({ freq: 196, dur: 1.6, vol: 0.006, delay: 0.3, type: 'triangle' })
  softTone({ freq: 293.66, dur: 1.2, vol: 0.005, delay: 0.55, type: 'sine' })
}

/** 退出太阳系 */
export function playSolarExit() {
  stopSolarAmbience()
  ;[261.63, 196, 130.81].forEach((f, i) => {
    softTone({ freq: f, dur: 0.7, vol: 0.008, delay: i * 0.15, type: 'sine' })
  })
}
