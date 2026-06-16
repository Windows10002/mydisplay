/**
 * 永恒号登舰序章 · 统一像素渲染
 * 风格：深空暗底 + 荧光绿 HUD + 冰蓝点缀（星际穿越配色）
 */
import { px } from './pixelCanvas'
import { drawEnduranceRingShip, getEnduranceScale } from './pixelEndurance'
import { createStars } from './solarSystemRenderer'
import { randomGlitch } from '../data/introStory'

export const PAL = {
  void: '#030508',
  panel: '#101A33',
  wall: '#141e2e',
  wallHi: '#1e2d42',
  metal: '#2e3d52',
  green: '#26FF98',
  greenDim: '#1a5c42',
  greenGlow: '#4dffb8',
  cyan: '#80E8FF',
  cyanDim: '#3a7a90',
  orange: '#FF7A2F',
  red: '#e85050',
  star: '#d8e8ff',
  starDim: '#4a5a78',
  nebula: '#5a4a9a',
  nebulaHi: '#8a7acc',
  visor: '#1a3048',
  suit: '#d8dce8',
}

export function initStars(n, lw, lh) {
  return createStars(n, lw, lh)
}

function fillVoid(ctx, lw, lh) {
  ctx.fillStyle = PAL.void
  ctx.fillRect(0, 0, lw, lh)
}

function drawStars(ctx, stars, time, density = 1) {
  stars.forEach((s) => {
    if (Math.sin(time * 0.003 + s.twinkle) > 0.12 * density) {
      ctx.fillStyle = s.bright ? PAL.star : PAL.starDim
      ctx.fillRect(s.x, s.y, s.size || 1, s.size || 1)
    }
  })
}

/** 序幕：深空星野（不重复画永恒号，留给对接幕） */
export function drawPrologue(ctx, lw, lh, time, t, stars) {
  fillVoid(ctx, lw, lh)
  const fade = Math.min(1, t * 2.2)
  ctx.globalAlpha = fade
  drawStars(ctx, stars, time, 1 + t * 0.5)
  ctx.globalAlpha = 1

  if (t > 0.5) {
    const pulse = Math.sin(time * 0.02) > 0
    ctx.fillStyle = pulse ? PAL.red : PAL.orange
    ctx.fillRect(Math.floor(lw * 0.08), Math.floor(lh * 0.72), 3, 3)
    ctx.fillStyle = PAL.red
    ctx.font = `${Math.max(5, lh * 0.022)}px monospace`
    if (pulse) ctx.fillText('SIGNAL LOST', lw * 0.1, lh * 0.7)
  }

  ctx.fillStyle = `rgba(3, 5, 8, ${Math.max(0, 1 - t * 1.8)})`
  ctx.fillRect(0, 0, lw, lh)
}

/** 深空对接 — 对接船持续飞入，带进度 HUD */
export function drawDock(ctx, lw, lh, time, t, stars) {
  fillVoid(ctx, lw, lh)

  const parallax = 0.6 + t * 1.8
  stars.forEach((s) => {
    const sx = (s.x - time * 0.012 * parallax * (s.bright ? 1.4 : 0.8) + lw) % lw
    if (Math.sin(time * 0.004 + s.twinkle) > 0.05) {
      ctx.fillStyle = s.bright ? PAL.star : PAL.starDim
      ctx.fillRect(sx, s.y, s.size || 1, s.size || 1)
    }
  })

  const sc = getEnduranceScale(lh) * (0.42 + t * 0.1)
  const dockPulse = 0.85 + Math.sin(time * 0.006) * 0.15
  const ringX = lw * (0.62 + Math.sin(time * 0.0015) * 0.012)
  const ringY = lh * (0.42 + Math.cos(time * 0.0012) * 0.008)
  drawEnduranceRingShip(ctx, ringX, ringY, sc, time)

  const approach = Math.min(1, t * 1.15)
  const sx = lw * (1.15 - approach * 0.78) + Math.sin(time * 0.012) * 2
  const sy = lh * (0.56 - approach * 0.08) + Math.cos(time * 0.01) * 1.5
  drawDockingPod(ctx, sx, sy, lw, time, Math.max(0.15, approach))

  if (approach > 0.55) {
    ctx.fillStyle = `rgba(38, 255, 152, ${(approach - 0.55) * 0.7 * dockPulse})`
    ctx.fillRect(Math.floor(lw * 0.52), Math.floor(lh * 0.36), Math.floor(lw * 0.14), Math.floor(lh * 0.1))
  }

  const barW = lw * 0.36
  const barX = lw * 0.1
  const barY = lh * 0.88
  ctx.fillStyle = PAL.metal
  ctx.fillRect(Math.floor(barX), Math.floor(barY), Math.floor(barW), 4)
  ctx.fillStyle = PAL.green
  ctx.fillRect(Math.floor(barX), Math.floor(barY), Math.floor(barW * approach), 4)
  ctx.fillStyle = PAL.cyan
  ctx.font = `${Math.max(5, lh * 0.02)}px monospace`
  ctx.fillText(`DOCK ${Math.floor(approach * 100)}%`, barX, barY - 4)

  ctx.fillStyle = `rgba(3, 5, 8, ${0.04 + (1 - approach) * 0.08})`
  ctx.fillRect(0, 0, lw, lh)
}

function drawDockingPod(ctx, x, y, lw, time, t) {
  const sc = Math.max(2, lw / 90)
  const angle = -0.25 + Math.sin(time * 0.012) * 0.02
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const pixels = [
    [0, -3, PAL.suit], [0, -2, PAL.cyan], [-1, -1, PAL.suit], [0, -1, '#fff'], [1, -1, PAL.suit],
    [-2, 0, PAL.metal], [-1, 0, PAL.suit], [0, 0, PAL.green], [1, 0, PAL.suit], [2, 0, PAL.metal],
    [-1, 1, PAL.orange], [0, 1, PAL.orange], [1, 1, PAL.orange],
    [0, 2, '#ffaa55'], [-1, 3, PAL.orange], [1, 3, PAL.orange],
  ]
  pixels.forEach(([dx, dy, col]) => {
    const rx = (dx * cos - dy * sin) * sc
    const ry = (dx * sin + dy * cos) * sc
    ctx.fillStyle = col
    ctx.fillRect(Math.floor(x + rx - sc), Math.floor(y + ry - sc), sc, sc)
  })
  const bx = x - sin(angle) * 4 * sc
  const by = y + cos(angle) * 4 * sc
  for (let i = 0; i < 8; i++) {
    const flick = Math.sin(time * 0.025 + i) * 0.5 + 0.5
    ctx.fillStyle = i < 2 ? '#fff176' : i < 5 ? PAL.orange : '#883322'
    ctx.globalAlpha = flick * t
    ctx.fillRect(
      Math.floor(bx - sin(angle) * i * 3 * sc),
      Math.floor(by + cos(angle) * i * 3 * sc),
      sc, sc,
    )
  }
  ctx.globalAlpha = 1
}

/** 气闸外 */
export function drawHatch(ctx, lw, lh, time, t) {
  fillVoid(ctx, lw, lh)
  drawAirlockFrame(ctx, lw, lh, time, 0)

  const pressure = Math.min(1, t * 1.5)
  const bars = 5
  for (let i = 0; i < bars; i++) {
    const lit = pressure > (i + 1) / bars
    ctx.fillStyle = lit ? PAL.green : PAL.metal
    ctx.fillRect(Math.floor(lw * 0.12 + i * 8), Math.floor(lh * 0.78), 5, 4)
  }

  drawAstronautSilhouette(ctx, lw * 0.42, lh * 0.58, lw, time, Math.min(1, t * 1.2))

  if (t > 0.5) {
    ctx.fillStyle = PAL.greenGlow
    ctx.fillRect(Math.floor(lw * 0.48), Math.floor(lh * 0.35), Math.floor(lw * 0.04), 2)
  }
}

function drawAirlockFrame(ctx, lw, lh, time, open) {
  ctx.fillStyle = PAL.wall
  ctx.fillRect(0, 0, lw, lh)
  const doorW = lw * (0.28 * (1 - open))
  ctx.fillStyle = PAL.wallHi
  ctx.fillRect(0, 0, doorW, lh)
  ctx.fillRect(lw - doorW, 0, doorW, lh)

  const cx = lw / 2
  const dy = lh * 0.32
  const dw = lw * 0.22
  const dh = lh * 0.36
  ctx.fillStyle = PAL.metal
  for (let a = 0; a < Math.PI * 2; a += 0.4) {
    px(ctx, cx + Math.cos(a) * dw * 0.5, dy + dh * 0.5 + Math.sin(a) * dh * 0.45, PAL.metal)
  }
  ctx.fillStyle = '#0a1018'
  ctx.fillRect(Math.floor(cx - dw * 0.35), Math.floor(dy + dh * 0.15), Math.ceil(dw * 0.7), Math.ceil(dh * 0.55))

  ctx.fillStyle = Math.sin(time * 0.01) > 0 ? PAL.green : PAL.greenDim
  ctx.fillRect(Math.floor(cx - 2), Math.floor(dy + 2), 4, 2)
}

function drawAstronautSilhouette(ctx, x, y, lw, time, alpha) {
  const sc = Math.max(2, lw / 100)
  ctx.globalAlpha = alpha
  const cols = [
    [0, -4, PAL.suit], [-1, -3, PAL.suit], [0, -3, PAL.visor], [1, -3, PAL.suit],
    [-2, -2, PAL.suit], [0, -2, PAL.suit], [2, -2, PAL.suit],
    [-2, -1, PAL.orange], [0, -1, PAL.suit], [2, -1, PAL.orange],
    [-1, 0, PAL.suit], [0, 0, PAL.cyanDim], [1, 0, PAL.suit],
    [-1, 1, PAL.metal], [1, 1, PAL.metal], [0, 2, PAL.metal],
  ]
  const breath = Math.sin(time * 0.004) * 0.5
  cols.forEach(([dx, dy, c]) => {
    ctx.fillStyle = c
    ctx.fillRect(Math.floor(x + dx * sc), Math.floor(y + (dy + breath) * sc), sc, sc)
  })
  if (Math.sin(time * 0.008) > 0.5) {
    ctx.fillStyle = PAL.cyan
    ctx.fillRect(Math.floor(x - sc), Math.floor(y - 3 * sc), sc, sc)
  }
  ctx.globalAlpha = 1
}

/** 气密锁闭 */
export function drawSeal(ctx, lw, lh, time, t) {
  drawHatch(ctx, lw, lh, time, 1)
  const close = Math.min(1, t * 1.8)
  const doorW = lw * 0.28 * close
  ctx.fillStyle = PAL.wallHi
  ctx.fillRect(Math.floor(lw / 2 - doorW / 2), 0, Math.ceil(doorW), lh)

  if (close > 0.7) {
    ctx.fillStyle = PAL.green
    ctx.fillRect(Math.floor(lw * 0.46), Math.floor(lh * 0.48), 6, 2)
  }
}

/** 廊道 */
export function drawCorridor(ctx, lw, lh, time, t) {
  const scroll = t * 32 + time * 0.002
  fillVoid(ctx, lw, lh)
  const cx = lw / 2
  const layers = 13

  for (let d = layers; d >= 0; d--) {
    const p = (d + scroll * 0.22) % (layers + 1)
    const z = 1 - p / (layers + 1)
    const w = lw * (0.14 + z * 0.86)
    const y = lh * 0.04 + (1 - z) * lh * 0.12
    const x = cx - w / 2

    ctx.fillStyle = d % 2 ? PAL.wall : PAL.wallHi
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.max(2, Math.floor(lh * 0.035 * z)))

    ctx.fillStyle = PAL.cyanDim
    ctx.fillRect(Math.floor(x + w * 0.1), Math.floor(y + lh * 0.55 * z), Math.ceil(w * 0.8), 1)
    if (z > 0.3) {
      ctx.fillStyle = PAL.cyan
      ctx.globalAlpha = 0.3 + z * 0.4
      ctx.fillRect(Math.floor(x + w * 0.15), Math.floor(y + lh * 0.54 * z), Math.ceil(w * 0.7), 2)
      ctx.globalAlpha = 1
    }

    const lit = Math.sin(scroll * 0.4 + d * 1.5) > 0
    ctx.fillStyle = lit ? PAL.green : PAL.greenDim
    ctx.fillRect(Math.floor(x + w * 0.08), Math.floor(y + lh * 0.2 * z), 3, 2)
    ctx.fillRect(Math.floor(x + w * 0.88), Math.floor(y + lh * 0.3 * z), 3, 2)
  }

  ctx.fillStyle = PAL.panel
  ctx.fillRect(0, Math.floor(lh * 0.88), lw, Math.ceil(lh * 0.12))
}

/** 舷窗星海 — 近景舷窗，不再复用廊道画面 */
export function drawViewport(ctx, lw, lh, time, t, stars) {
  fillVoid(ctx, lw, lh)

  const frame = 10
  const wx = lw * 0.1
  const wy = lh * 0.06
  const ww = lw * 0.8
  const wh = lh * 0.62
  const lean = Math.sin(time * 0.0015) * 0.012 * t

  ctx.fillStyle = PAL.wall
  ctx.fillRect(0, 0, lw, lh)
  ctx.fillStyle = PAL.wallHi
  ctx.fillRect(0, Math.floor(lh * 0.72), lw, Math.ceil(lh * 0.28))
  ctx.fillStyle = PAL.panel
  ctx.fillRect(Math.floor(lw * 0.18), Math.floor(lh * 0.78), Math.floor(lw * 0.64), Math.floor(lh * 0.04))

  ctx.save()
  ctx.translate(wx + ww / 2, wy + wh / 2)
  ctx.rotate(lean)
  ctx.translate(-(wx + ww / 2), -(wy + wh / 2))

  ctx.fillStyle = PAL.metal
  ctx.fillRect(Math.floor(wx - frame), Math.floor(wy - frame), Math.ceil(ww + frame * 2), Math.ceil(wh + frame * 2))
  ctx.fillStyle = '#000'
  ctx.fillRect(Math.floor(wx), Math.floor(wy), Math.ceil(ww), Math.ceil(wh))

  ctx.save()
  ctx.beginPath()
  ctx.rect(wx, wy, ww, wh)
  ctx.clip()
  const drift = time * 0.0008 * t
  stars.forEach((s) => {
    const sx = wx + ((s.x * 0.6 + drift * 40) % ww)
    const sy = wy + s.y * (wh / lh) * 0.85
    if (Math.sin(time * 0.003 + s.twinkle) > 0.05) {
      ctx.fillStyle = s.bright ? PAL.star : PAL.starDim
      ctx.fillRect(sx, sy, s.size || 1, s.size || 1)
    }
  })
  for (let i = 0; i < 22; i++) {
    const nx = wx + ww * (0.05 + (i * 0.17 + drift * 120) % 0.9)
    const ny = wy + wh * (0.08 + (i % 5) * 0.17)
    if (Math.sin(time * 0.002 + i * 1.7) > -0.15) {
      px(ctx, nx, ny, i % 3 ? PAL.nebula : PAL.nebulaHi)
    }
  }
  ctx.restore()

  ctx.strokeStyle = PAL.cyan
  ctx.globalAlpha = 0.35 + t * 0.35
  ctx.strokeRect(Math.floor(wx - 3), Math.floor(wy - 3), Math.ceil(ww + 6), Math.ceil(wh + 6))
  ctx.globalAlpha = 1
  ctx.restore()

  ctx.fillStyle = `rgba(128, 232, 255, ${0.04 + t * 0.08})`
  ctx.fillRect(Math.floor(wx), Math.floor(wy + wh), Math.ceil(ww), Math.ceil(lh * 0.06))
}

/** 终幕 · 主控台启动（合并原 auth + launch，一镜到底） */
export function drawFinale(ctx, lw, lh, time, t, route) {
  fillVoid(ctx, lw, lh)

  const bootEnd = 0.42
  const gridStart = 0.38

  if (t < bootEnd + 0.08) {
    const bt = Math.min(1, t / bootEnd)
    const sx = lw * 0.08
    const sy = lh * 0.14
    const sw = lw * 0.84
    const sh = lh * 0.38

    ctx.fillStyle = PAL.panel
    ctx.fillRect(Math.floor(sx - 4), Math.floor(sy - 4), Math.ceil(sw + 8), Math.ceil(sh + 8))
    ctx.fillStyle = '#060c12'
    ctx.fillRect(Math.floor(sx), Math.floor(sy), Math.ceil(sw), Math.ceil(sh))
    ctx.fillStyle = PAL.green
    ctx.fillRect(Math.floor(sx), Math.floor(sy), Math.ceil(sw), 2)

    const scanY = sy + 8 + bt * (sh - 16)
    ctx.fillStyle = 'rgba(38, 255, 152, 0.3)'
    ctx.fillRect(Math.floor(sx + 4), Math.floor(scanY), Math.ceil(sw - 8), 2)

    const fontSize = Math.max(6, Math.floor(lh * 0.028))
    ctx.font = `${fontSize}px monospace`
    const lines = ['> 永恒号主控台启动', '> 舰长：李可欣 · 开普勒星系', '> 欢迎，地球访客']
    const n = Math.min(lines.length, Math.floor(bt * 6) + 1)
    lines.slice(0, n).forEach((line, i) => {
      ctx.fillStyle = i === 1 && Math.sin(time * 0.025) > 0.15 ? PAL.red : PAL.green
      ctx.fillText(line, sx + 12, sy + 22 + i * (fontSize + 5))
    })
  }

  const gt = Math.max(0, (t - gridStart) / (1 - gridStart))
  if (gt > 0) {
    const panels = [
      { label: '自我介绍', icon: '✦' },
      { label: '个人项目', icon: '◎' },
      { label: '获奖记录', icon: '◈' },
      { label: '太阳系', icon: '◇' },
    ]
    const sx = lw * 0.1
    const sy = lh * 0.36
    const pw = lw * 0.38
    const ph = lh * 0.17

    panels.forEach((p, i) => {
      const px_x = sx + (i % 2) * (pw + 12)
      const py = sy + Math.floor(i / 2) * (ph + 10)
      const reveal = Math.min(1, (gt - i * 0.07) * 2.8)
      if (reveal <= 0) return
      ctx.globalAlpha = reveal
      ctx.fillStyle = '#0c1420'
      ctx.fillRect(Math.floor(px_x), Math.floor(py), Math.floor(pw), Math.floor(ph))
      ctx.fillStyle = PAL.cyan
      ctx.fillRect(Math.floor(px_x), Math.floor(py), Math.floor(pw), 2)
      ctx.fillStyle = PAL.green
      ctx.font = `${Math.max(5, lh * 0.024)}px monospace`
      ctx.fillText(`${p.icon} ${p.label}`, px_x + 8, py + 16)
      ctx.globalAlpha = 1
    })

    if (route && gt > 0.35) {
      ctx.fillStyle = PAL.cyan
      ctx.font = `${Math.max(5, lh * 0.02)}px monospace`
      ctx.textAlign = 'center'
      ctx.globalAlpha = Math.min(1, (gt - 0.35) * 2.5)
      ctx.fillText(`载入模块 · ${route}`, lw / 2, lh * 0.82)
      ctx.textAlign = 'left'
      ctx.globalAlpha = 1
    }
  }

  if (t > 0.72) {
    ctx.fillStyle = `rgba(38, 255, 152, ${(t - 0.72) * 0.35})`
    ctx.fillRect(0, 0, lw, lh)
  }
  if (t > 0.88) {
    ctx.fillStyle = `rgba(3, 5, 8, ${(t - 0.88) * 8})`
    ctx.fillRect(0, 0, lw, lh)
  }
}

/** @deprecated 保留供外部引用 */
export function drawAuth(ctx, lw, lh, time, t) {
  drawFinale(ctx, lw, lh, time, Math.min(0.4, t), null)
}

/** @deprecated 保留供外部引用 */
export function drawLaunch(ctx, lw, lh, time, t, route) {
  drawFinale(ctx, lw, lh, time, 0.45 + t * 0.55, route)
}

export function drawGlitch(ctx, lw, lh, time, seed) {
  ctx.fillStyle = 'rgba(38, 255, 152, 0.05)'
  for (let i = 0; i < 6; i++) {
    const y = ((seed * 13 + i * 27 + (time * 0.04) | 0) % lh)
    ctx.fillRect(0, y, lw, 1)
  }
  ctx.fillStyle = PAL.green
  ctx.font = `${Math.max(5, lh * 0.025)}px monospace`
  ctx.fillText(randomGlitch(8), (seed * 9) % Math.max(1, lw - 70), ((seed * 3 + 40) % lh))
}
