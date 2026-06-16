import { fillCircle, px } from './pixelCanvas'

export const BUTTON_PIXEL_SCALE = 4

const METAL = {
  plate: '#3a4250',
  plateHi: '#5a6878',
  plateLo: '#2a3240',
  edge: '#1a2028',
  edgeHi: '#687890',
  screw: '#4a5060',
  screwHi: '#8a94a8',
  well: '#08080c',
  wellEdge: '#141820',
}

const GREEN = {
  top: '#26FF98',
  topHi: '#7affc8',
  topLo: '#18c878',
  left: '#148858',
  leftDark: '#0a5038',
  right: '#0e6848',
  rightDark: '#083828',
}

const AMBER = {
  top: '#e8cc78',
  topHi: '#fff0b8',
  topLo: '#c9a84c',
  left: '#a07830',
  leftDark: '#684818',
  right: '#886028',
  rightDark: '#503810',
}

const VENUS = {
  gold: '#e8cc78',
  goldHi: '#fff0b0',
  goldLo: '#a08040',
  tape: '#6a5840',
  tapeHi: '#8a7860',
  window: '#101018',
  windowHi: '#283040',
  play: '#ffd888',
}

export function setupButtonCanvas(canvas, ctx, lw, lh) {
  canvas.width = lw
  canvas.height = lh
  canvas.style.width = `${lw * BUTTON_PIXEL_SCALE}px`
  canvas.style.height = `${lh * BUTTON_PIXEL_SCALE}px`
  ctx.imageSmoothingEnabled = false
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h)
}

function drawPlate(ctx, lw, lh) {
  fillRect(ctx, 0, 0, lw, lh, METAL.plateLo)
  fillRect(ctx, 1, 1, lw - 2, lh - 2, METAL.plate)
  fillRect(ctx, 0, 0, lw, 1, METAL.edgeHi)
  fillRect(ctx, 0, lh - 1, lw, 1, METAL.edge)
  fillRect(ctx, 0, 0, 1, lh, METAL.edgeHi)
  fillRect(ctx, lw - 1, 0, 1, lh, METAL.edge)

  const screws = [[2, 2], [lw - 4, 2], [2, lh - 4], [lw - 4, lh - 4]]
  screws.forEach(([sx, sy]) => {
    fillRect(ctx, sx, sy, 2, 2, METAL.screw)
    px(ctx, sx, sy, METAL.screwHi)
  })
}

function drawWell(ctx, x, y, w, h) {
  fillRect(ctx, x, y, w, h, METAL.wellEdge)
  fillRect(ctx, x + 1, y + 1, w - 2, h - 2, METAL.well)
}

/** 等距立体键帽 · w/d 为顶面格数，h 为侧壁高度 */
function drawIsoKey(ctx, ox, oy, w, d, h, pal, press = 0) {
  const px0 = Math.floor(ox + press)
  const py0 = Math.floor(oy + press)
  const wall = press > 0 ? Math.max(3, h - 2) : h

  for (let hi = wall - 1; hi >= 0; hi--) {
    for (let di = 0; di < d; di++) {
      const lx = px0 - di * 2
      const ly = py0 + di + hi
      px(ctx, lx, ly, hi === wall - 1 ? pal.leftDark : pal.left)
    }
  }

  for (let hi = wall - 1; hi >= 0; hi--) {
    for (let wi = 0; wi < w; wi++) {
      const rx = px0 + wi * 2 + 2
      const ry = py0 + wi + hi
      px(ctx, rx, ry, hi === wall - 1 ? pal.rightDark : pal.right)
    }
  }

  for (let di = 0; di < d; di++) {
    for (let wi = 0; wi < w; wi++) {
      const tx = px0 + wi * 2 - di * 2
      const ty = py0 + wi + di
      let c = pal.top
      if (wi === 0 && di === 0) c = pal.topHi
      else if (wi === w - 1 || di === d - 1) c = pal.topHi
      else if (wi === 0 || di === 0) c = pal.topLo
      px(ctx, tx, ty, c)
      px(ctx, tx + 1, ty, wi === w - 1 ? pal.topHi : pal.top)
    }
  }
}

function drawLed(ctx, x, y, on, color) {
  const off = '#1a2820'
  fillRect(ctx, x, y, 2, 2, on ? color : off)
  if (on) px(ctx, x, y, '#ffffff')
}

function drawArmedGlow(ctx, lw, lh, color, pulse) {
  const a = pulse > 0.5 ? 1 : 0
  if (!a) return
  for (let x = 2; x < lw - 2; x++) {
    px(ctx, x, 1, color)
    px(ctx, x, lh - 2, color)
  }
  for (let y = 2; y < lh - 2; y++) {
    px(ctx, 1, y, color)
    px(ctx, lw - 2, y, color)
  }
}

function renderIsoKeyButton(ctx, lw, lh, pal, ledColor, glowColor, { pressed, armed, time }) {
  drawPlate(ctx, lw, lh)
  drawWell(ctx, 5, 7, lw - 10, lh - 12)

  const press = pressed ? 2 : 0
  const h = pressed ? 4 : 7
  const w = lw >= 54 ? 12 : 10
  const d = 4
  const footprintW = w * 2 + 2
  const footprintH = d + w + h
  const kx = Math.floor((lw - footprintW) / 2) + 1
  const ky = Math.floor((lh - 12 - footprintH) / 2) + 8

  drawIsoKey(ctx, kx, ky, w, d, h, pal, press)

  const pulse = armed ? (Math.sin(time * 0.008) + 1) / 2 : 0
  const ledOn = armed && Math.floor(time / 420) % 2 === 0
  drawLed(ctx, kx + press, ky + press, ledOn, ledColor)
  drawArmedGlow(ctx, lw, lh, glowColor, armed ? pulse : 0)

  return { labelX: kx + press + w, labelY: ky + press + Math.floor(d / 2) + 2 }
}

export function renderGreenKeyButton(ctx, lw, lh, state) {
  return renderIsoKeyButton(ctx, lw, lh, GREEN, '#40ff90', '#26FF98', state)
}

export function renderAmberKeyButton(ctx, lw, lh, state) {
  return renderIsoKeyButton(ctx, lw, lh, AMBER, '#ffb84a', '#c9a84c', state)
}

function drawPixelReel(ctx, cx, cy, r, angle, pal) {
  fillCircle(ctx, cx, cy, r, pal.tapeHi)
  fillCircle(ctx, cx, cy, r - 1, pal.tape)
  fillCircle(ctx, cx, cy, 2, pal.goldLo)
  for (let i = 0; i < 6; i++) {
    const a = angle + (i / 6) * Math.PI * 2
    const x2 = cx + Math.cos(a) * (r - 1)
    const y2 = cy + Math.sin(a) * (r - 1)
    px(ctx, x2, y2, pal.goldLo)
    px(ctx, cx + Math.cos(a) * (r - 2), cy + Math.sin(a) * (r - 2), pal.tape)
  }
}

export function renderVenusDeckButton(ctx, lw, lh, { pressed, armed, time }) {
  fillRect(ctx, 0, 0, lw, lh, '#18181c')

  const deckY = 4
  const deckH = lh - 10
  fillRect(ctx, 2, deckY, lw - 4, deckH, '#222228')
  fillRect(ctx, 3, deckY + 1, lw - 6, deckH - 2, '#141418')

  const spin = armed ? time * 0.004 : 0
  const press = pressed ? 1 : 0
  drawPixelReel(ctx, 12, deckY + Math.floor(deckH / 2), 5, spin, VENUS)
  drawPixelReel(ctx, lw - 12, deckY + Math.floor(deckH / 2), 5, -spin, VENUS)

  const winX = 18
  const winW = lw - 36
  const winY = deckY + 4 + press
  const winH = deckH - 8
  fillRect(ctx, winX, winY, winW, winH, VENUS.window)
  fillRect(ctx, winX + 1, winY + 1, winW - 2, winH - 2, '#0a0a10')

  if (armed) {
    const scanY = winY + 1 + Math.floor((time * 0.04) % (winH - 2))
    fillRect(ctx, winX + 1, scanY, winW - 2, 1, VENUS.goldLo)
  }

  const triX = Math.floor(lw / 2)
  const triY = winY + Math.floor(winH / 2)
  px(ctx, triX - 2, triY - 1, VENUS.play)
  px(ctx, triX - 2, triY, VENUS.play)
  px(ctx, triX - 2, triY + 1, VENUS.play)
  px(ctx, triX - 1, triY - 2, VENUS.gold)
  px(ctx, triX - 1, triY - 1, VENUS.goldHi)
  px(ctx, triX - 1, triY, VENUS.goldHi)
  px(ctx, triX - 1, triY + 1, VENUS.goldHi)
  px(ctx, triX - 1, triY + 2, VENUS.gold)
  px(ctx, triX, triY - 1, VENUS.goldHi)
  px(ctx, triX, triY, VENUS.goldHi)
  px(ctx, triX, triY + 1, VENUS.goldHi)
  px(ctx, triX + 1, triY, VENUS.goldLo)

  fillRect(ctx, 6, lh - 5, lw - 12, 2, VENUS.tape)
  fillRect(ctx, 6, lh - 3, lw - 12, 1, VENUS.tapeHi)
}

/** 平面像素按钮 · 控制台磷光琥珀色 · 向里压入 */
export function renderFlatPressButton(ctx, lw, lh, { pressed, armed, time }) {
  ctx.clearRect(0, 0, lw, lh)

  fillRect(ctx, 0, 0, lw, lh, '#2a2a28')
  fillRect(ctx, 1, 1, lw - 2, lh - 2, '#1a1a18')
  fillRect(ctx, 2, 2, lw - 4, lh - 4, '#141410')

  if (!pressed) {
    fillRect(ctx, 3, 2, lw - 6, lh - 4, '#6a5830')
    fillRect(ctx, 4, 3, lw - 8, lh - 6, '#c9a84c')
    for (let x = 4; x < lw - 4; x++) px(ctx, x, 3, '#e8cc78')
    for (let x = 5; x < lw - 5; x++) px(ctx, x, 4, '#d4b060')
    px(ctx, lw - 5, 3, '#8a6830')
    px(ctx, 4, lh - 5, '#8a6830')
  } else {
    fillRect(ctx, 3, 2, lw - 6, lh - 4, '#0a0a08')
    const inset = 4
    fillRect(ctx, 3 + inset, 2 + inset, lw - 6 - inset * 2, lh - 4 - inset * 2, '#5a4828')
    fillRect(ctx, 4 + inset, 3 + inset, lw - 8 - inset * 2, lh - 6 - inset * 2, '#a08840')
    for (let x = 4 + inset; x < lw - 4 - inset; x++) px(ctx, x, 3 + inset, '#8a7848')
    for (let x = 3; x < lw - 3; x++) {
      px(ctx, x, 2, '#2a2a28')
      px(ctx, x, lh - 3, '#2a2a28')
    }
    for (let y = 2; y < lh - 2; y++) {
      px(ctx, 3, y, '#2a2a28')
      px(ctx, lw - 4, y, '#2a2a28')
    }
  }

  if (armed && Math.floor(time / 460) % 2 === 0) {
    px(ctx, 2, 2, '#80e8ff')
    px(ctx, lw - 3, 2, '#80e8ff')
    px(ctx, 2, lh - 3, '#80e8ff')
    px(ctx, lw - 3, lh - 3, '#80e8ff')
  }
}
