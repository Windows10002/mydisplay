import { fillCircle, px } from './pixelCanvas'

export const LEVER_PIXEL_SCALE = 4

export function setupLeverCanvas(canvas, ctx, lw, lh) {
  canvas.width = lw
  canvas.height = lh
  canvas.style.width = `${lw * LEVER_PIXEL_SCALE}px`
  canvas.style.height = `${lh * LEVER_PIXEL_SCALE}px`
  ctx.imageSmoothingEnabled = false
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h)
}

const PAL = {
  frame: '#3a3a36',
  frameHi: '#6a6a66',
  frameLo: '#2a2a28',
  slot: '#0c0c0a',
  slotHi: '#181818',
  stem: '#9a9a96',
  stemLo: '#6a6a66',
  joint: '#8a8a86',
  jointHi: '#b0b0a8',
  gripTop: '#e8cc78',
  gripMid: '#c9a84c',
  gripLo: '#8a6830',
  gripSide: '#6a5020',
  led: '#26ff98',
}

/** 立体竖槽 */
function drawVerticalSlot(ctx, x, top, bottom, w) {
  const h = bottom - top
  fillRect(ctx, x, top, w, h, PAL.frameLo)
  fillRect(ctx, x + 1, top, w - 2, h, PAL.frame)
  fillRect(ctx, x + 1, top + 1, w - 2, h - 2, PAL.slot)

  for (let y = top; y < bottom; y++) {
    px(ctx, x, y, PAL.frameHi)
    px(ctx, x + 1, y, PAL.slotHi)
    px(ctx, x + w - 2, y, '#1a1a18')
    px(ctx, x + w - 1, y, PAL.frameLo)
  }

  fillRect(ctx, x + 2, top + 1, w - 4, 2, '#080808')

  for (let i = 1; i < 5; i++) {
    const ty = top + Math.floor((h * i) / 5)
    px(ctx, x + 2, ty, '#2a2a28')
    px(ctx, x + w - 3, ty, '#2a2a28')
  }
}

/** 竖槽内推杆 · pushT 0=底部，1=顶部 */
function drawVerticalLever(ctx, cx, slotTop, slotBot, pushT) {
  const t = Math.max(0, Math.min(1, pushT))
  const travel = slotBot - slotTop - 20
  const gripY = slotBot - 11 - t * travel

  fillCircle(ctx, cx, slotBot - 4, 3, PAL.frameLo)
  fillCircle(ctx, cx, slotBot - 4, 2, PAL.joint)
  px(ctx, cx - 1, slotBot - 5, PAL.jointHi)

  for (let y = gripY + 2; y <= slotBot - 6; y++) {
    px(ctx, cx, y, PAL.stem)
    px(ctx, cx + 1, y, PAL.stemLo)
  }

  for (let dx = -9; dx <= 9; dx++) {
    px(ctx, cx + dx, gripY - 1, PAL.gripTop)
    px(ctx, cx + dx, gripY, PAL.gripMid)
    px(ctx, cx + dx, gripY + 1, PAL.gripLo)
  }
  fillRect(ctx, cx - 10, gripY + 1, 20, 1, PAL.gripLo)
  for (let dy = -1; dy <= 1; dy++) {
    px(ctx, cx + 10, gripY + dy, PAL.gripSide)
    px(ctx, cx + 11, gripY + dy, '#4a3818')
  }
  px(ctx, cx - 10, gripY - 1, PAL.gripTop)
}

/** 双推杆 · 自下往上推，立体竖槽 */
export function renderDualThrottle(ctx, lw, lh, { pushed, armed, time }) {
  ctx.clearRect(0, 0, lw, lh)

  fillRect(ctx, 2, lh - 19, lw - 4, 11, PAL.frameLo)
  fillRect(ctx, 3, lh - 18, lw - 6, 9, PAL.frame)
  fillRect(ctx, 3, lh - 18, lw - 6, 2, PAL.frameHi)
  fillRect(ctx, 4, lh - 16, lw - 8, 6, PAL.slot)

  const ledOn = armed && Math.floor(time / 520) % 2 === 0
  px(ctx, 5, lh - 17, ledOn ? PAL.led : '#1a3828')
  px(ctx, lw - 6, lh - 17, ledOn ? PAL.led : '#1a3828')

  const slotTop = 6
  const slotBot = lh - 20
  const slotW = 16
  const leftX = 14
  const rightX = lw - 14 - slotW

  drawVerticalSlot(ctx, leftX, slotTop, slotBot, slotW)
  drawVerticalSlot(ctx, rightX, slotTop, slotBot, slotW)

  const pushT = pushed ? 1 : 0
  drawVerticalLever(ctx, leftX + Math.floor(slotW / 2), slotTop, slotBot, pushT)
  drawVerticalLever(ctx, rightX + Math.floor(slotW / 2), slotTop, slotBot, pushT)
}
