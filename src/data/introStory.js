/** 永恒号 · 登舰序章 — 故事情节时间轴 */

export const INTRO_DURATION = 82000

export const MOTIVATION_OPTIONS = [
  {
    id: 'intro',
    label: '认识舰长',
    sub: '听李可欣的自我介绍',
    log: '参观路线已记录：先从舰长档案开始。',
  },
  {
    id: 'projects',
    label: '个人项目',
    sub: '看看她做过什么',
    log: '参观路线已记录：载入项目档案。',
  },
  {
    id: 'awards',
    label: '获奖记录',
    sub: '荣誉与竞赛经历',
    log: '参观路线已记录：打开荣誉日志。',
  },
]

export const SCENES = [
  { id: 'prologue', start: 0, end: 3000 },
  { id: 'dock', start: 3000, end: 7500 },
  { id: 'hatch', start: 7500, end: 14000 },
  { id: 'seal', start: 14000, end: 19500 },
  { id: 'corridor', start: 19500, end: 33000 },
  { id: 'viewport', start: 33000, end: null, interactive: true },
  { id: 'finale', start: null, end: null, duration: 5500 },
]

/** 舰内通讯字幕 { scene, at(local ms), tag, text } */
export const COMM_LINES = [
  { scene: 'prologue', at: 800, tag: 'ARCHIVE', text: '217-D · 公元 2026 · 近地轨道' },
  { scene: 'prologue', at: 1600, tag: 'SIGNAL', text: 'CREW-000 在指挥舱失联' },
  { scene: 'prologue', at: 2400, tag: 'LOG', text: '「……别……相信……时钟……」', ghost: true },
  { scene: 'dock', at: 200, tag: '···', text: '……嘶……有人……还在吗……', ghost: true },
  { scene: 'dock', at: 900, tag: 'MISSION', text: 'ORBIT · 永恒号 · 对接通道已解锁' },
  { scene: 'dock', at: 1800, tag: '舰桥', text: '李可欣 · 开普勒星系 · 身份确认' },
  { scene: 'dock', at: 3200, tag: 'LOG', text: '上一任记录员最后位置：指挥舱 · 状态未知' },
  { scene: 'hatch', at: 1000, tag: 'HATCH', text: '外压 0.00 atm · 内压 1.00 atm · 平衡中' },
  { scene: 'hatch', at: 3500, tag: 'HATCH', text: '机械锁解除 · 请确认舱外无人跟随' },
  { scene: 'seal', at: 1200, tag: 'HATCH', text: '舱门闭合 · 密封完成 · NOMINAL' },
  { scene: 'seal', at: 3500, tag: 'AI-CORE', text: '欢迎登舰 · 舰内大气正常' },
  { scene: 'seal', at: 5500, tag: 'LOG', text: '登舰时间已同步至任务时钟' },
  { scene: 'corridor', at: 1500, tag: 'NAV', text: '距指挥舱 120m · 预计 4 分钟' },
  { scene: 'corridor', at: 4500, tag: 'NAV', text: '前方区域：主控模块 · 上一日志断点同区' },
  { scene: 'corridor', at: 7500, tag: '···', text: '……别……相信……时钟……', ghost: true },
  { scene: 'viewport', at: 500, tag: '舷窗', text: '外部光学正常 · 深空模式' },
  { scene: 'viewport', at: 2500, tag: '舰长', text: '李可欣：你好地球人，请选择参观路线' },
  { scene: 'finale', at: 400, tag: '主控台', text: '永恒号主计算机启动中…' },
  { scene: 'finale', at: 2200, tag: '系统', text: '指挥舱界面载入 · 任务日志就绪' },
  { scene: 'finale', at: 3800, tag: '舰长', text: '欢迎登舰，接下来由我带你参观控制台' },
]

export const TITLE_CARDS = [
  { scene: 'prologue', at: 0, lines: ['── ARCHIVE · 217-D ──', '永恒号 · 登舰序章'] },
  { scene: 'dock', at: 0, line: '第一幕 · 深空对接' },
  { scene: 'hatch', at: 0, line: '第二幕 · 踏入气闸' },
  { scene: 'seal', at: 0, line: '第三幕 · 气密锁闭' },
  { scene: 'corridor', at: 0, line: '第四幕 · 廊道前行' },
  { scene: 'viewport', at: 0, line: '第五幕 · 舷窗深空' },
  { scene: 'finale', at: 0, line: '终幕 · 主控台启动' },
]

export const GLITCH_EVENTS = [
  { scene: 'prologue', at: 2600, dur: 400 },
  { scene: 'corridor', at: 7200, dur: 450 },
  { scene: 'finale', at: 3200, dur: 350 },
]

export const GLITCH_CHARS = '01█▓CREW-000ERR::LOST'

export function getAutoScene(elapsed) {
  return SCENES.find((s) => !s.interactive && s.start != null && elapsed >= s.start && elapsed < s.end)
}

export function sceneT(elapsed, scene) {
  if (!scene || scene.start == null || scene.end == null) return 0
  return Math.min(1, (elapsed - scene.start) / (scene.end - scene.start))
}

export function activeComm(sceneId, localMs) {
  return COMM_LINES.filter((c) => c.scene === sceneId && localMs >= c.at && localMs < c.at + 3200)
}

export function activeTitle(sceneId, localMs) {
  const dur = sceneId === 'dock' ? 1600 : 2800
  return TITLE_CARDS.find((t) => t.scene === sceneId && localMs >= t.at && localMs < t.at + dur)
}

export function activeGlitch(sceneId, localMs) {
  return GLITCH_EVENTS.find((g) => g.scene === sceneId && localMs >= g.at && localMs < g.at + g.dur)
}

export function randomGlitch(n = 10) {
  let s = ''
  for (let i = 0; i < n; i++) s += GLITCH_CHARS[(Math.random() * GLITCH_CHARS.length) | 0]
  return s
}
