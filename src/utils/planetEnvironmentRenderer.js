import { fillCircle, px } from './pixelCanvas'

function drawStars(ctx, lw, lh, time, density = 80) {
  for (let i = 0; i < density; i++) {
    const x = (i * 97 + 13) % lw
    const y = (i * 53 + 7) % lh
    if (Math.sin(time * 0.001 + i) > 0.2) {
      px(ctx, x, y, i % 7 === 0 ? '#d8e8ff' : '#4a5a78')
    }
  }
}

function drawCraters(ctx, lw, lh, time, color) {
  for (let i = 0; i < 48; i++) {
    const x = (i * 131) % lw
    const y = (lh * 0.45 + (i * 67) % Math.floor(lh * 0.5))
    fillCircle(ctx, x, y, 1 + (i % 3), color)
    if (i % 4 === 0) px(ctx, x + 2, y, '#6a6a6a')
  }
  const sunX = lw * 0.12
  for (let r = 8; r < 40; r += 6) {
    for (let a = -0.4; a < 0.4; a += 0.08) {
      px(ctx, sunX + Math.cos(a) * r, lh * 0.35 + Math.sin(a) * r * 0.5, '#ffaa55')
    }
  }
}

function drawAcidRain(ctx, lw, lh, time) {
  for (let i = 0; i < 30; i++) {
    const x = (i * 41 + time * 0.02) % lw
    const y = (i * 29 + time * 0.08) % lh
    px(ctx, x, y, '#e8c878')
    px(ctx, x, y + 1, '#c4a06a')
  }
  for (let y = 0; y < lh; y++) {
    const a = 0.15 + (y / lh) * 0.25
    ctx.fillStyle = `rgba(58, 40, 16, ${a})`
    ctx.fillRect(0, y, lw, 1)
  }
}

function drawClouds(ctx, lw, lh, time) {
  ctx.fillStyle = '#0a2848'
  ctx.fillRect(0, Math.floor(lh * 0.55), lw, Math.ceil(lh * 0.45))
  ctx.fillStyle = '#1a4838'
  for (let i = 0; i < 12; i++) {
    const bx = (i * 80 + time * 0.015) % (lw + 40) - 20
    const by = lh * 0.62 + (i % 3) * 8
    fillCircle(ctx, bx, by, 4 + (i % 2), '#2a6848')
    fillCircle(ctx, bx + 6, by + 2, 3, '#3a7858')
  }
  for (let i = 0; i < 20; i++) {
    const cx = (i * 60 + time * 0.025) % lw
    const cy = lh * 0.15 + (i * 17) % Math.floor(lh * 0.35)
    px(ctx, cx, cy, '#ffffff')
    px(ctx, cx + 1, cy, '#d8e8ff')
  }
}

function drawDustStorm(ctx, lw, lh, time) {
  for (let y = 0; y < lh; y++) {
    const t = y / lh
    ctx.fillStyle = `rgb(${Math.floor(40 + t * 80)}, ${Math.floor(16 + t * 20)}, ${Math.floor(8 + t * 10)})`
    ctx.fillRect(0, y, lw, 1)
  }
  for (let i = 0; i < 40; i++) {
    const x = (i * 37 + time * 0.06) % lw
    const y = lh * 0.3 + (i * 19 + time * 0.02) % Math.floor(lh * 0.6)
    px(ctx, x, y, '#d87850')
    px(ctx, x + 1, y, '#b84a28')
  }
}

function drawBands(ctx, lw, lh, time) {
  const cx = lw * 0.5
  const cy = lh * 0.42
  const pr = Math.min(lw, lh) * 0.15
  for (let y = -pr; y <= pr; y++) {
    const band = Math.floor((y + pr) / 4) % 4
    const colors = ['#8a6030', '#b8895a', '#dcc8a0', '#9a7040']
    for (let x = -pr; x <= pr; x++) {
      if (x * x + y * y <= pr * pr) {
        px(ctx, cx + x, cy + y, colors[band])
      }
    }
  }
  fillCircle(ctx, cx + pr * 0.3, cy + pr * 0.15, Math.floor(pr * 0.22), '#cc4420')
  for (let a = 0; a < Math.PI * 2; a += 0.2) {
    px(ctx, cx + Math.cos(a + time * 0.0003) * (pr + 4), cy + Math.sin(a + time * 0.0003) * (pr + 4) * 0.35, '#3a2818')
  }
}

function drawRings(ctx, lw, lh, time) {
  const cx = lw * 0.5
  const cy = lh * 0.45
  const pr = Math.min(lw, lh) * 0.14
  fillCircle(ctx, cx, cy, pr, '#d8c898')
  fillCircle(ctx, cx - 2, cy - 2, pr * 0.7, '#f0e8c8')
  for (let rx = pr * 2.2; rx <= pr * 3.8; rx += 1) {
    for (let a = 0; a < Math.PI * 2; a += 0.04) {
      if (Math.sin(a * 2 + time * 0.001) > 0.3) {
        px(ctx, cx + Math.cos(a) * rx, cy + Math.sin(a) * rx * 0.22, '#e8dcc0')
      }
    }
  }
}

function drawIceTilt(ctx, lw, lh, time) {
  const cx = lw * 0.48
  const cy = lh * 0.5
  const pr = Math.min(lw, lh) * 0.12
  for (let y = -pr; y <= pr; y++) {
    for (let x = -pr; x <= pr; x++) {
      if (x * x + y * y <= pr * pr) {
        px(ctx, cx + x, cy + y * 0.6 + x * 0.3, '#7ec8dc')
      }
    }
  }
  for (let i = 0; i < 16; i++) {
    px(ctx, cx + Math.cos(i + time * 0.0005) * pr * 2, cy + Math.sin(i) * 4, '#b0e8f0')
  }
}

function drawStorm(ctx, lw, lh, time) {
  for (let y = 0; y < lh; y++) {
    ctx.fillStyle = `rgb(${Math.floor(4 + y * 0.02)}, ${Math.floor(8 + y * 0.04)}, ${Math.floor(24 + y * 0.08)})`
    ctx.fillRect(0, y, lw, 1)
  }
  const uiCx = lw * 0.5
  const uiCy = lh * 0.54
  const uiR = Math.min(lw, lh) * 0.26
  for (let i = 0; i < 35; i++) {
    const x = (i * 43 + time * 0.12) % lw
    const y = (i * 31 + time * 0.05) % lh
    if (Math.hypot(x - uiCx, y - uiCy) < uiR) continue
    px(ctx, x, y, '#6888e0')
    px(ctx, x + 2, y + 1, '#3a52c4')
  }
}

function drawCorona(ctx, lw, lh, time) {
  const cx = lw * 0.5
  const cy = lh * 0.45
  const pulse = Math.sin(time * 0.002) * 0.5 + 0.5
  for (let r = 12; r < 50; r += 2) {
    for (let a = 0; a < Math.PI * 2; a += 0.15) {
      const col = r < 20 ? '#fff8e0' : r < 32 ? '#ffb84a' : '#ff7a2f'
      if (Math.sin(a * 3 + time * 0.003 + r) > 0.1 + pulse * 0.2) {
        px(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, col)
      }
    }
  }
  fillCircle(ctx, cx, cy, 8 + pulse * 2, '#fff8e0')
}

const EFFECTS = {
  craters: drawCraters,
  acidRain: drawAcidRain,
  clouds: drawClouds,
  dustStorm: drawDustStorm,
  bands: drawBands,
  rings: drawRings,
  iceTilt: drawIceTilt,
  storm: drawStorm,
  corona: drawCorona,
}

export function renderPlanetEnvironment(ctx, lw, lh, time, env) {
  if (!env) return
  const { palette, effect } = env

  ctx.fillStyle = palette.bg
  ctx.fillRect(0, 0, lw, lh)

  for (let y = 0; y < lh; y++) {
    const t = y / lh
    const r = parseInt(palette.sky.slice(1, 3), 16)
    const g = parseInt(palette.sky.slice(3, 5), 16)
    const b = parseInt(palette.sky.slice(5, 7), 16)
    const br = parseInt(palette.bg.slice(1, 3), 16)
    const bg = parseInt(palette.bg.slice(3, 5), 16)
    const bb = parseInt(palette.bg.slice(5, 7), 16)
    ctx.fillStyle = `rgb(${Math.floor(br + (r - br) * t)}, ${Math.floor(bg + (g - bg) * t)}, ${Math.floor(bb + (b - bb) * t)})`
    ctx.fillRect(0, y, lw, 1)
  }

  drawStars(ctx, lw, lh, time, effect === 'corona' ? 40 : 70)

  const drawEffect = EFFECTS[effect]
  if (drawEffect) drawEffect(ctx, lw, lh, time, palette.particle)

  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.02 + i * 0.015})`
    ctx.fillRect(i, i, lw - i * 2, lh - i * 2)
  }
}
