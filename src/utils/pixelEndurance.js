import { fillCircle, px } from './pixelCanvas.js'

/** 工业冷灰 · 无白色 · 与宇航员舱外服区分 */
const SHIP = {
  frame: '#2a3548',
  hull: '#4a5870',
  hullHi: '#687890',
  dark: '#121820',
  hub: '#3a4860',
  green: '#26FF98',
  cyan: '#60c8e8',
  orange: '#e87830',
  pipe: '#3a4558',
}

/**
 * 永恒号 · 侧视环形舰
 * 宽扁椭圆环 + 左向长对接臂 · 明显是飞船不是人
 */
export function drawEnduranceRingShip(ctx, cx, cy, sc = 1, time = 0) {
  const s = Math.max(1, sc)
  const rx = 38 * s
  const ry = 11 * s

  for (let a = 0; a < Math.PI * 2; a += 0.05) {
    const xo = cx + Math.cos(a) * rx
    const yo = cy + Math.sin(a) * ry
    const xi = cx + Math.cos(a) * (rx - 5 * s)
    const yi = cy + Math.sin(a) * (ry - 2.5 * s)
    px(ctx, xo, yo, SHIP.hullHi)
    px(ctx, xi, yi, SHIP.hull)
    px(ctx, (xo + xi) / 2, (yo + yi) / 2, SHIP.frame)
  }

  ctx.fillStyle = SHIP.dark
  for (let dy = -ry + s; dy <= ry - s; dy += s) {
    for (let dx = -rx + 2 * s; dx <= rx - 2 * s; dx += s) {
      if ((dx / (rx - 2 * s)) ** 2 + (dy / (ry - s)) ** 2 < 0.82) {
        ctx.fillRect(Math.floor(cx + dx), Math.floor(cy + dy), s, s)
      }
    }
  }

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    const x1 = cx + Math.cos(a) * 4 * s
    const y1 = cy + Math.sin(a) * 4 * s * 0.45
    const x2 = cx + Math.cos(a) * (rx - 2 * s)
    const y2 = cy + Math.sin(a) * (ry - s)
    const steps = 10
    for (let t = 0; t <= steps; t++) {
      px(ctx, x1 + (x2 - x1) * (t / steps), y1 + (y2 - y1) * (t / steps), SHIP.pipe)
    }
  }

  fillCircle(ctx, cx, cy, 4 * s, SHIP.hub)
  fillCircle(ctx, cx, cy, 2 * s, SHIP.green)

  const mods = [
    [0, -ry, SHIP.hullHi],
    [0, ry, SHIP.hullHi],
    [rx - s, 0, SHIP.orange],
    [-rx + 2 * s, 0, SHIP.hull],
  ]
  mods.forEach(([ox, oy, col]) => {
    fillCircle(ctx, cx + ox, cy + oy, 2.5 * s, col)
  })

  const armX = cx - rx - 2 * s
  const armLen = 28 * s
  for (let d = 0; d < armLen; d += s) {
    const wx = armX - d
    ctx.fillStyle = d % (3 * s) < 2 * s ? SHIP.pipe : SHIP.frame
    ctx.fillRect(Math.floor(wx), Math.floor(cy - 3 * s), Math.ceil(s * 1.3), Math.ceil(6 * s))
    if (d % (4 * s) === 0) px(ctx, wx, cy - 4 * s, SHIP.hullHi)
  }

  const dockX = armX - armLen
  const dockY = cy
  ctx.fillStyle = SHIP.frame
  ctx.fillRect(Math.floor(dockX - 2 * s), Math.floor(cy - 5 * s), Math.ceil(5 * s), Math.ceil(10 * s))
  ctx.fillStyle = SHIP.dark
  ctx.fillRect(Math.floor(dockX - s), Math.floor(cy - 3 * s), Math.ceil(3 * s), Math.ceil(6 * s))

  const blink = Math.floor(time * 0.01) % 2 === 0
  fillCircle(ctx, dockX + s, dockY, 2 * s, blink ? SHIP.green : SHIP.cyan)

  if (ctx.fillText) {
    ctx.font = `${Math.max(5, 3.5 * s)}px monospace`
    ctx.fillStyle = SHIP.cyan
    ctx.textAlign = 'center'
    ctx.fillText('◆ ENDURANCE ◆', cx, cy - ry - 4 * s)
  }

  return { dockX: dockX + s, dockY }
}

export function getEnduranceScale(lh) {
  return Math.max(1, lh / 110)
}

export function drawEnduranceIcon(ctx, x, y, time = 0) {
  drawEnduranceRingShip(ctx, x, y, 0.32, time)
}
