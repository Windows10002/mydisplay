import { px } from './pixelCanvas'

/** 飞船精灵：局部坐标，机头朝上 (-Y) — 星际穿越配色 */
const SHIP_PIXELS = [
  [0, -4, '#ffffff'],
  [0, -3, '#80E8FF'],
  [-1, -2, '#26FF98'], [0, -2, '#B0BEC5'], [1, -2, '#26FF98'],
  [-2, -1, '#101A33'], [-1, -1, '#26FF98'], [0, -1, '#ffffff'], [1, -1, '#26FF98'], [2, -1, '#101A33'],
  [-3, 0, '#3a4a5a'], [-2, 0, '#80E8FF'], [-1, 0, '#B0BEC5'], [0, 0, '#26FF98'], [1, 0, '#B0BEC5'], [2, 0, '#80E8FF'], [3, 0, '#3a4a5a'],
  [-1, 1, '#cc5520'], [0, 1, '#FF7A2F'], [1, 1, '#cc5520'],
  [0, 2, '#ffaa55'],
  [-1, 3, '#FF7A2F'], [1, 3, '#FF7A2F'],
]

export function movementToShipAngle(vx, vy) {
  if (Math.hypot(vx, vy) < 0.5) return null
  return Math.atan2(vy, vx) + Math.PI / 2
}

export function drawSpaceship(ctx, cx, cy, angle, scale = 1, boost = 0) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const sc = scale + boost * 0.12

  if (boost > 0.2) {
    ctx.globalAlpha = 0.35 + boost * 0.25
    SHIP_PIXELS.forEach(([dx, dy]) => {
      const rx = (dx * cos - dy * sin) * sc
      const ry = (dx * sin + dy * cos) * sc
      px(ctx, cx + rx * 1.4, cy + ry * 1.4, '#26FF98')
    })
    ctx.globalAlpha = 1
  }

  SHIP_PIXELS.forEach(([dx, dy, color]) => {
    const rx = (dx * cos - dy * sin) * sc
    const ry = (dx * sin + dy * cos) * sc
    px(ctx, cx + rx, cy + ry, color)
  })
}

/** 引擎尾焰 + 高速 warp  streak */
export function drawEngineExhaust(ctx, cx, cy, angle, trail, speed = 0) {
  const colors = ['#FF7A2F', '#ffaa55', '#cc5520', '#883322', '#050812']
  const backX = -Math.sin(angle)
  const backY = Math.cos(angle)
  const warp = Math.min(1, speed / 18)

  if (warp > 0.35) {
    ctx.globalAlpha = 0.5 * warp
    for (let i = 1; i <= 6; i++) {
      const wx = cx + backX * (3 + i * 2.5)
      const wy = cy + backY * (3 + i * 2.5)
      px(ctx, wx, wy, i < 3 ? '#80E8FF' : '#26FF98')
      px(ctx, wx + backX, wy + backY, '#80E8FF')
    }
    ctx.globalAlpha = 1
  }

  trail.forEach((t, i) => {
    const c = colors[Math.min(colors.length - 1, Math.floor((1 - t.life) * colors.length))]
    const size = Math.max(1, Math.round(t.size * t.life * (1 + warp * 0.5)))
    const ox = t.x + backX * (2 + (1 - t.life) * (4 + warp * 4))
    const oy = t.y + backY * (2 + (1 - t.life) * (4 + warp * 4))
    for (let dy = -size; dy <= size; dy++) {
      for (let dx = -size; dx <= size; dx++) {
        if (dx * dx + dy * dy <= size * size) {
          px(ctx, ox + dx, oy + dy, c)
        }
      }
    }
    if (i > 0) {
      const prev = trail[i - 1]
      px(ctx, Math.floor((prev.x + t.x) / 2), Math.floor((prev.y + t.y) / 2), warp > 0.4 ? '#80E8FF' : '#aa6633')
    }
  })
}

/** 悬停锁定框 — 旋转角 bracket + 脉冲 */
export function drawTargetLock(ctx, cx, cy, pulse) {
  const r = 15 + Math.floor(Math.sin(pulse * 2) * 1.5)
  const c = '#26FF98'
  const dim = '#3a4a5a'
  const rot = pulse * 0.8

  for (let i = 0; i < 4; i++) {
    const a = rot + (i * Math.PI) / 2
    const lx = Math.cos(a) * r
    const ly = Math.sin(a) * r
    for (let j = 0; j < 5; j++) {
      px(ctx, cx + lx + Math.cos(a + Math.PI / 2) * j * 0.6, cy + ly + Math.sin(a + Math.PI / 2) * j * 0.6, c)
      px(ctx, cx + lx + Math.cos(a) * j * 0.6, cy + ly + Math.sin(a) * j * 0.6, c)
    }
  }

  const ringR = r - 4
  for (let a = 0; a < Math.PI * 2; a += 0.45) {
    px(ctx, cx + Math.cos(a + rot) * ringR, cy + Math.sin(a + rot) * ringR, dim)
  }

  px(ctx, cx, cy, '#ffffff')
  ;[0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((a) => {
    px(ctx, cx + Math.cos(a) * 7, cy + Math.sin(a) * 7, '#80E8FF')
  })
}

/** 控制台 · 琥珀色 HUD 准星（与太阳系飞船光标区分） */
export function drawConsoleCursor(ctx, cx, cy, time, interactionMode = 'default') {
  const gold = '#c9a84c'
  const bright = '#e8cc78'
  const dim = '#6a5a38'
  const accent = '#26FF98'
  const pulse = 0.5 + Math.sin(time * 0.004) * 0.5
  const arm = interactionMode === 'hover' ? 10 : 8
  const gap = 3

  for (let i = -arm; i <= arm; i++) {
    if (Math.abs(i) <= gap) continue
    px(ctx, cx + i, cy, Math.abs(i) % 2 === 0 ? dim : gold)
    px(ctx, cx, cy + i, Math.abs(i) % 2 === 0 ? dim : gold)
  }

  px(ctx, cx, cy, bright)
  px(ctx, cx - 1, cy, gold)
  px(ctx, cx, cy - 1, gold)

  const bracket = interactionMode === 'hover' ? 6 + Math.floor(pulse) : 5
  const corners = [
    [-1, -1], [1, -1], [-1, 1], [1, 1],
  ]
  corners.forEach(([sx, sy]) => {
    for (let i = 0; i < bracket; i++) {
      px(ctx, cx + sx * (gap + i), cy + sy * gap, gold)
      px(ctx, cx + sx * gap, cy + sy * (gap + i), gold)
    }
  })

  if (interactionMode === 'hover') {
    px(ctx, cx, cy - bracket - 3, accent)
    px(ctx, cx - 1, cy - bracket - 3, accent)
    px(ctx, cx + 1, cy - bracket - 3, accent)
  }

  if (interactionMode === 'click') {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      px(ctx, cx + Math.cos(a) * 12, cy + Math.sin(a) * 12, bright)
    }
  }
}

/** 控制台 · 文本输入闪烁竖线 */
export function drawConsoleTextCaret(ctx, cx, cy, blinkOn) {
  drawConsoleCursor(ctx, cx - 3, cy, 0, 'default')
  if (blinkOn) {
    for (let y = -5; y <= 5; y++) px(ctx, cx + 4, cy + y, '#c9a84c')
    px(ctx, cx + 5, cy - 5, '#e8cc78')
    px(ctx, cx + 5, cy + 5, '#e8cc78')
  }
}

/** 默认模式 · 旋转准星环 */
export function drawCursorReticle(ctx, cx, cy, time, speed = 0) {
  const pulse = 0.5 + Math.sin(time * 0.005) * 0.5
  const r = 10 + speed * 0.08
  const rot = time * 0.0025

  for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
    const x1 = cx + Math.cos(a + rot) * r
    const y1 = cy + Math.sin(a + rot) * r
    const x2 = cx + Math.cos(a + rot + 0.4) * (r - 3)
    const y2 = cy + Math.sin(a + rot + 0.4) * (r - 3)
    for (let t = 0; t <= 1; t += 0.25) {
      px(ctx, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, pulse > 0.6 ? '#80E8FF' : '#3a4a5a')
    }
  }

  px(ctx, cx - 5, cy, `rgba(128, 232, 255, ${0.3 + pulse * 0.3})`)
  px(ctx, cx + 5, cy, `rgba(128, 232, 255, ${0.3 + pulse * 0.3})`)
  px(ctx, cx, cy - 5, `rgba(128, 232, 255, ${0.3 + pulse * 0.3})`)
  px(ctx, cx, cy + 5, `rgba(128, 232, 255, ${0.3 + pulse * 0.3})`)
}

/** 点击波纹 */
export function drawClickRipples(ctx, ripples) {
  ripples.forEach((r) => {
    const alpha = r.life
    if (alpha <= 0) return
    ctx.globalAlpha = alpha * 0.6
    const rad = Math.floor(r.radius)
    for (let a = 0; a < Math.PI * 2; a += 0.35) {
      px(ctx, r.x + Math.cos(a) * rad, r.y + Math.sin(a) * rad, '#26FF98')
    }
    ctx.globalAlpha = 1
  })
}

/** 环绕飞船的星尘 */
export function drawShipSparkles(ctx, cx, cy, particles, speed = 0) {
  const boost = 1 + Math.min(2, speed / 12)
  particles.forEach((p) => {
    p.angle += p.speed * boost
    p.dist += Math.sin(p.angle * 2) * 0.02
    const ppx = Math.floor(cx + Math.cos(p.angle) * p.dist)
    const ppy = Math.floor(cy + Math.sin(p.angle) * p.dist * 0.75)
    px(ctx, ppx, ppy, p.bright ? '#26FF98' : '#80E8FF')
    if (speed > 10 && p.bright) {
      px(ctx, ppx + 1, ppy, '#ffffff')
    }
  })
}

/** 文本输入模式：小飞船 + 闪烁竖线 */
export function drawTextCaretShip(ctx, cx, cy, blinkOn) {
  drawSpaceship(ctx, cx, cy - 2, -Math.PI / 2, 0.75)
  if (blinkOn) {
    for (let y = -4; y <= 5; y++) px(ctx, cx + 5, cy + y, '#26FF98')
    px(ctx, cx + 6, cy - 4, '#80E8FF')
    px(ctx, cx + 6, cy + 5, '#80E8FF')
  }
}
