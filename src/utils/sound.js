let ctx = null

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  return ctx
}

function tone({ freq = 440, dur = 0.1, type = 'square', vol = 0.04, delay = 0, ramp }) {
  const ac = getCtx()
  if (!ac) return
  if (ac.state === 'suspended') ac.resume()
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (ramp) osc.frequency.exponentialRampToValueAtTime(ramp, t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

/** 复古电子按键音 */
export function playBeep(type = 'click') {
  const presets = {
    click: { freq: 880, dur: 0.06, type: 'square', vol: 0.04 },
    hover: { freq: 620, dur: 0.035, type: 'sine', vol: 0.018 },
    launch: { freq: 220, dur: 0.35, type: 'sawtooth', vol: 0.06 },
    wormhole: { freq: 110, dur: 0.8, type: 'sine', vol: 0.05, ramp: 40 },
    alert: { freq: 160, dur: 0.12, type: 'sawtooth', vol: 0.05 },
    toggle: { freq: 340, dur: 0.08, type: 'square', vol: 0.028 },
    panel: { freq: 520, dur: 0.12, type: 'sine', vol: 0.022 },
    lock: { freq: 440, dur: 0.1, type: 'sine', vol: 0.025 },
    alarm: { freq: 180, dur: 0.25, type: 'sawtooth', vol: 0.045 },
    ready: { freq: 659, dur: 0.45, type: 'sine', vol: 0.032 },
  }
  const p = presets[type] ?? presets.click
  tone({ ...p, ramp: p.ramp })
}

/** 指挥台启动 · 面板依次上电 */
export function playConsoleBoot(fromIntro = false) {
  tone({ freq: 90, dur: 0.5, type: 'sawtooth', vol: fromIntro ? 0.035 : 0.02, ramp: 180 })
  ;[0.12, 0.28, 0.44].forEach((d, i) => {
    tone({ freq: 280 + i * 80, dur: 0.1, type: 'square', vol: 0.018, delay: d })
  })
  tone({ freq: 440, dur: 0.2, type: 'sine', vol: 0.02, delay: 0.55 })
  tone({ freq: 554, dur: 0.25, type: 'sine', vol: 0.018, delay: 0.68 })
  tone({ freq: 659, dur: 0.55, type: 'sine', vol: fromIntro ? 0.03 : 0.022, delay: 0.82 })
  if (fromIntro) {
    tone({ freq: 784, dur: 0.7, type: 'sine', vol: 0.024, delay: 1.05 })
  }
}

/** 开关拨动 · 更明显反馈 */
export function playSwitch(wasOn) {
  playBeep('toggle')
  tone({
    freq: wasOn ? 260 : 520,
    dur: 0.12,
    type: 'square',
    vol: 0.045,
    delay: 0.05,
  })
  tone({
    freq: wasOn ? 180 : 660,
    dur: 0.08,
    type: 'sine',
    vol: 0.028,
    delay: 0.1,
  })
}

/** 引导关闭 */
export function playGuideDismiss() {
  tone({ freq: 523, dur: 0.15, type: 'sine', vol: 0.022 })
  tone({ freq: 784, dur: 0.2, type: 'sine', vol: 0.018, delay: 0.1 })
}

let typeKeySeed = 0

/** CRT 打字 · 轻柔键音（每 3 字一次） */
export function playTypeKey() {
  typeKeySeed += 1
  if (typeKeySeed % 3 !== 0) return
  tone({ freq: 720, dur: 0.014, type: 'sine', vol: 0.004 })
}

/** CRT 打字 · 换行 */
export function playTypeLine() {
  tone({ freq: 440, dur: 0.05, type: 'sine', vol: 0.006 })
}

/** 虫洞跃迁 · 进度音效 */
export function playWormholeTick(progress) {
  if (progress < 0.05) return
  const band = Math.floor(progress * 10)
  tone({
    freq: 90 + band * 28,
    dur: 0.06,
    type: 'sawtooth',
    vol: 0.012 + band * 0.002,
  })
}

/** 出发 · 引擎点火 */
export function playDepartLaunch() {
  playBeep('launch')
  tone({ freq: 120, dur: 0.6, type: 'sawtooth', vol: 0.05, ramp: 55 })
  tone({ freq: 440, dur: 0.15, type: 'square', vol: 0.03, delay: 0.15 })
  tone({ freq: 880, dur: 0.2, type: 'sine', vol: 0.022, delay: 0.28 })
  playBeep('wormhole')
}
