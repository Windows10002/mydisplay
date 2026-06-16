/** 舰长控制台 · 指令与互动配置 */

export const BOOT_CHECKS = [
  { id: 'hab', text: '生活舱系统' },
  { id: 'nav', text: '导航系统' },
  { id: 'com', text: '通讯链路' },
  { id: 'main', text: '主计算机' },
]

export const MISSION_COMMANDS = {
  intro: {
    id: 'intro',
    label: '自我介绍',
    sublabel: '个人简介',
    hint: '右侧屏幕即时展示',
    ringModule: 'HAB-1',
    page: 'crew',
    lockMsg: '舰长档案已在右侧屏幕打开',
    crtStandby: '舰长档案 · 播放中',
    footer: '舰长档案 · 右侧屏幕查看',
    completeMsg: '舰长档案 · 已载入',
    directPlay: true,
    skipWormhole: true,
  },
  projects: {
    id: 'projects',
    label: '个人项目',
    sublabel: '项目经历',
    hint: '跃迁后加载项目',
    ringModule: 'DOCK',
    page: 'category-projects',
    lockMsg: '项目模块已锁定 · 请确认跃迁',
    crtStandby: '等待跃迁 · 项目数据包就绪',
    footer: '确认传输后将进入跃迁通道',
    engageLabel: '确认跃迁',
    engageSub: '启动虫洞 · 加载个人项目',
    completeMsg: '项目数据 · 传输完成',
    directPlay: false,
  },
  awards: {
    id: 'awards',
    label: '获奖记录',
    sublabel: '荣誉与竞赛',
    hint: '荣誉档案即时展开',
    ringModule: 'ENG',
    page: 'log',
    lockMsg: '荣誉档案已在右侧屏幕打开',
    crtStandby: '荣誉档案 · 检索中',
    footer: '荣誉档案 · 右侧屏幕查看',
    completeMsg: '荣誉档案 · 已载入',
    directPlay: true,
    skipWormhole: true,
  },
}

export function guestCallsign() {
  const n = Math.floor(Math.random() * 900) + 100
  return `访客${n}`
}

export function loadCrewSession() {
  try {
    const name = sessionStorage.getItem('endurance-crew-name')
    const call = sessionStorage.getItem('endurance-crew-call')
    if (name) return { name, callsign: call || guestCallsign() }
  } catch { /* ignore */ }
  return null
}

export function saveCrewSession(name, callsign) {
  try {
    sessionStorage.setItem('endurance-crew-name', name)
    sessionStorage.setItem('endurance-crew-call', callsign)
  } catch { /* ignore */ }
}
