/** 解析 B 站页面链接，生成嵌入式播放器 URL */
export function isBilibiliUrl(url) {
  return typeof url === 'string' && /bilibili\.com/i.test(url)
}

export function parseBilibiliBvid(url) {
  const match = url.match(/BV[\w]+/i)
  return match ? match[0] : null
}

export function bilibiliEmbedUrl(url, { autoplay = false } = {}) {
  const bvid = parseBilibiliBvid(url)
  if (!bvid) return url

  const params = new URLSearchParams({
    bvid,
    page: '1',
    high_quality: '1',
    danmaku: '0',
    autoplay: autoplay ? '1' : '0',
  })

  return `https://player.bilibili.com/player.html?${params}`
}
