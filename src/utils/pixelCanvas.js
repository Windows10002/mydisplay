/** 低分辨率像素画布：逻辑坐标 → 放大显示 */
export const PIXEL_SIZE = 4

export function setupPixelCanvas(canvas, ctx) {
  const w = window.innerWidth
  const h = window.innerHeight
  const lw = Math.max(1, Math.floor(w / PIXEL_SIZE))
  const lh = Math.max(1, Math.floor(h / PIXEL_SIZE))

  canvas.width = lw
  canvas.height = lh
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.imageSmoothingEnabled = false

  return { lw, lh, scale: PIXEL_SIZE }
}

export function px(ctx, x, y, color) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  ctx.fillStyle = color
  ctx.fillRect(ix, iy, 1, 1)
}

export function fillCircle(ctx, cx, cy, r, color) {
  const ir = Math.ceil(r)
  for (let y = -ir; y <= ir; y++) {
    for (let x = -ir; x <= ir; x++) {
      if (x * x + y * y <= r * r) {
        px(ctx, cx + x, cy + y, color)
      }
    }
  }
}

export function strokeCircle(ctx, cx, cy, r, color) {
  const ir = Math.ceil(r)
  for (let y = -ir; y <= ir; y++) {
    for (let x = -ir; x <= ir; x++) {
      const d = x * x + y * y
      if (d <= r * r && d >= (r - 0.85) * (r - 0.85)) {
        px(ctx, cx + x, cy + y, color)
      }
    }
  }
}

export function drawOrbitEllipse(ctx, cx, cy, rx, ry, color, step = 0.08) {
  ctx.fillStyle = color
  for (let a = 0; a < Math.PI * 2; a += step) {
    const x = Math.floor(cx + Math.cos(a) * rx)
    const y = Math.floor(cy + Math.sin(a) * ry)
    ctx.fillRect(x, y, 1, 1)
  }
}

export function snapScreen(v, size = 2) {
  return Math.round(v / size) * size
}
