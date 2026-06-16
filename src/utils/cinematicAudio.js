let ac = null
let ambienceNodes = null
let musicNodes = null
let arpTimer = null

const SCENE_MOOD = {
  prologue: { hum: 0.028, music: 0.07, filter: 380 },
  dock: { hum: 0.042, music: 0.1, filter: 620 },
  hatch: { hum: 0.048, music: 0.09, filter: 520 },
  seal: { hum: 0.04, music: 0.085, filter: 480 },
  corridor: { hum: 0.044, music: 0.115, filter: 780 },
  viewport: { hum: 0.022, music: 0.15, filter: 950 },
  finale: { hum: 0.05, music: 0.13, filter: 1100 },
}

const ARP_NOTES = [146.83, 174.61, 220, 261.63, 220, 174.61]

function getAc() {
  if (!ac) {
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  return ac
}

export function isAudioSuspended() {
  const ctx = getAc()
  return !ctx || ctx.state === 'suspended'
}

export async function ensureAudio() {
  const ctx = resume()
  if (!ctx) return false
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      return false
    }
  }
  return ctx.state === 'running'
}

function resume() {
  const ctx = getAc()
  if (ctx?.state === 'suspended') ctx.resume()
  return ctx
}

function stopArpeggio() {
  if (arpTimer) {
    clearInterval(arpTimer)
    arpTimer = null
  }
}

function stopMusicPad() {
  stopArpeggio()
  if (!musicNodes) return
  const { ctx, pads, master, lfo, lfoGain } = musicNodes
  const t = ctx.currentTime
  try {
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(master.gain.value, t)
    master.gain.linearRampToValueAtTime(0, t + 0.8)
    pads.forEach(({ osc }) => {
      osc.stop(t + 0.85)
    })
    lfo.stop(t + 0.85)
  } catch { /* already stopped */ }
  musicNodes = null
}

/** 低频船体嗡鸣（持续） */
export function startHum(volume = 0.035) {
  stopAmbience()
  const ctx = resume()
  if (!ctx) return

  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc1.type = 'sine'
  osc1.frequency.value = 52
  osc2.type = 'sine'
  osc2.frequency.value = 78
  filter.type = 'lowpass'
  filter.frequency.value = 120

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.value = 0
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2.5)

  osc1.start()
  osc2.start()
  ambienceNodes = { osc1, osc2, gain, filter, ctx }
}

export function setHumVolume(vol) {
  if (ambienceNodes?.gain) {
    ambienceNodes.gain.gain.setTargetAtTime(vol, ambienceNodes.ctx.currentTime, 0.6)
  }
}

export function stopAmbience() {
  if (!ambienceNodes) return
  try {
    ambienceNodes.osc1.stop()
    ambienceNodes.osc2.stop()
  } catch { /* already stopped */ }
  ambienceNodes = null
}

/** 深空氛围 pad + 慢速琶音 */
export function startIntroMusic() {
  stopMusicPad()
  const ctx = resume()
  if (!ctx) return

  const master = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 420
  filter.Q.value = 0.6
  master.gain.value = 0
  master.gain.linearRampToValueAtTime(0.075, ctx.currentTime + 4)
  filter.connect(master)
  master.connect(ctx.destination)

  const padFreqs = [73.42, 110, 146.83, 220]
  const pads = padFreqs.map((freq, i) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = i === 3 ? 'triangle' : 'sine'
    osc.frequency.value = freq
    g.gain.value = i === 0 ? 0.22 : i === 3 ? 0.06 : 0.1
    osc.connect(g)
    g.connect(filter)
    osc.start()
    return { osc, g }
  })

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.06
  lfoGain.gain.value = 18
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  let arpIdx = 0
  arpTimer = setInterval(() => {
    if (!musicNodes) return
    playTone({
      freq: ARP_NOTES[arpIdx % ARP_NOTES.length],
      dur: 2.2,
      type: 'sine',
      vol: 0.014,
    })
    arpIdx += 1
  }, 2400)

  musicNodes = { ctx, pads, master, filter, lfo, lfoGain }
}

export function setIntroMood(sceneId) {
  const mood = SCENE_MOOD[sceneId] ?? SCENE_MOOD.prologue
  setHumVolume(mood.hum)
  if (musicNodes?.master && musicNodes.filter) {
    const t = musicNodes.ctx.currentTime
    musicNodes.master.gain.setTargetAtTime(mood.music, t, 1.2)
    musicNodes.filter.frequency.setTargetAtTime(mood.filter, t, 1.5)
  }
}

/** 序章 + 音乐一起启动 */
export function startIntroAudio() {
  startHum(0.028)
  startIntroMusic()
}

function playTone({ freq = 440, dur = 0.1, type = 'square', vol = 0.04, ramp, delay = 0 }) {
  const ctx = resume()
  if (!ctx) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (ramp) osc.frequency.exponentialRampToValueAtTime(ramp, t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function playNoise(dur = 0.08, vol = 0.025, freq = 800) {
  const ctx = resume()
  if (!ctx) return
  const bufferSize = ctx.sampleRate * dur
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5
  const src = ctx.createBufferSource()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  src.buffer = buffer
  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
  src.start()
}

function playChime(notes, gap = 0.12, vol = 0.028) {
  notes.forEach((freq, i) => {
    playTone({ freq, dur: 0.55, type: 'sine', vol, delay: i * gap })
  })
}

/** 场景音效 */
export function playCinematicSfx(type) {
  switch (type) {
    case 'breath':
      playNoise(0.35, 0.018, 600)
      break
    case 'head':
      playTone({ freq: 90, dur: 0.15, type: 'sine', vol: 0.03 })
      break
    case 'footstep':
      playTone({ freq: 120, dur: 0.05, type: 'square', vol: 0.022 })
      playNoise(0.04, 0.01, 900)
      break
    case 'current':
      playNoise(0.06, 0.012, 1200)
      break
    case 'glitch':
      playTone({ freq: 880, dur: 0.04, type: 'square', vol: 0.02 })
      playTone({ freq: 220, dur: 0.06, type: 'sawtooth', vol: 0.015 })
      playNoise(0.05, 0.012, 2000)
      break
    case 'engine_start':
      playTone({ freq: 60, dur: 1.2, type: 'sawtooth', vol: 0.05, ramp: 180 })
      break
    case 'engine_stop':
      playTone({ freq: 180, dur: 0.3, type: 'sawtooth', vol: 0.04, ramp: 30 })
      break
    case 'gasp':
      playNoise(0.5, 0.03, 500)
      break
    case 'nav':
      playTone({ freq: 660, dur: 0.08, type: 'square', vol: 0.03 })
      break
    case 'door':
      playTone({ freq: 200, dur: 0.5, type: 'sawtooth', vol: 0.035, ramp: 80 })
      playNoise(0.3, 0.02, 700)
      break
    case 'touch':
      playTone({ freq: 1200, dur: 0.06, type: 'square', vol: 0.03 })
      break
    case 'boot':
      playChime([440, 554, 659], 0.1, 0.022)
      playNoise(0.15, 0.008, 1500)
      break
    case 'ready':
      playChime([523, 659, 784, 988], 0.14, 0.032)
      break
    case 'click':
      playTone({ freq: 880, dur: 0.07, type: 'square', vol: 0.022 })
      playTone({ freq: 1320, dur: 0.05, type: 'sine', vol: 0.012, delay: 0.04 })
      break
    case 'hover':
      playTone({ freq: 660, dur: 0.04, type: 'sine', vol: 0.012 })
      break
    case 'comm':
      playTone({ freq: 520, dur: 0.08, type: 'sine', vol: 0.016 })
      playTone({ freq: 780, dur: 0.12, type: 'sine', vol: 0.01, delay: 0.05 })
      break
    case 'dock':
      playTone({ freq: 140, dur: 0.35, type: 'sawtooth', vol: 0.028, ramp: 90 })
      playNoise(0.2, 0.015, 400)
      break
    case 'dock_lock':
      playChime([392, 523], 0.08, 0.024)
      playNoise(0.12, 0.01, 600)
      break
    case 'hatch':
      playTone({ freq: 180, dur: 0.4, type: 'sawtooth', vol: 0.03, ramp: 260 })
      playNoise(0.25, 0.018, 500)
      break
    case 'seal':
      playTone({ freq: 240, dur: 0.25, type: 'square', vol: 0.022, ramp: 120 })
      break
    case 'viewport':
      playChime([220, 277, 330, 440], 0.18, 0.02)
      playNoise(0.8, 0.006, 300)
      break
    case 'confirm':
      playChime([440, 554, 659, 880], 0.12, 0.026)
      break
    case 'title':
      playTone({ freq: 330, dur: 0.2, type: 'sine', vol: 0.018 })
      playTone({ freq: 440, dur: 0.35, type: 'sine', vol: 0.014, delay: 0.08 })
      break
    default:
      break
  }
}

/** 序章场景音效调度 */
export function tickIntroAudio(sceneId, localMs, prevSceneId, fired) {
  const mark = (key) => {
    if (fired.has(key)) return false
    fired.add(key)
    return true
  }

  if (sceneId !== prevSceneId) {
    setIntroMood(sceneId)
    if (mark(`enter-${sceneId}`)) {
      switch (sceneId) {
        case 'dock': playCinematicSfx('dock'); break
        case 'hatch': playCinematicSfx('hatch'); break
        case 'seal': playCinematicSfx('seal'); break
        case 'viewport': playCinematicSfx('viewport'); break
        case 'finale': break
        default: break
      }
    }
  }

  if (sceneId === 'dock' && localMs > 3200 && mark('dock-lock')) {
    playCinematicSfx('dock_lock')
  }

  if (sceneId === 'corridor') {
    const step = Math.floor(localMs / 420)
    if (step > 0 && mark(`step-${step}`)) playCinematicSfx('footstep')
    if (Math.floor(localMs / 2800) > 0 && mark(`cur-${Math.floor(localMs / 2800)}`)) {
      playCinematicSfx('current')
    }
  }

  if (sceneId === 'finale' && localMs > 3200 && mark('finale-ready')) {
    playCinematicSfx('ready')
  }
}

export function stopCinematicAudio() {
  stopAmbience()
  stopMusicPad()
}

/** @deprecated */
export function tickSceneAudio(sceneId, elapsed, localT, prevSceneId, sfxFiredRef) {
  tickIntroAudio(sceneId, localT * 10000, prevSceneId, sfxFiredRef.current)
}
