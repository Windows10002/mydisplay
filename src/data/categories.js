/** 宇宙总览页 — 热点坐标（对齐太阳系视觉中心） */
export const categories = [
  {
    id: 'projects',
    name: '核心行星',
    label: 'CORE PLANET',
    logPrefix: '任务档案',
    description: '主力项目与代表作，永恒号首要探索目标。',
    type: 'planet',
    x: 44,
    y: 50,
  },
  {
    id: 'skills',
    name: '技能卫星群',
    label: 'SATELLITE CLUSTER',
    logPrefix: '系统模块',
    description: '数据、产品、协作等核心能力模块。',
    type: 'satellites',
    x: 66,
    y: 32,
  },
  {
    id: 'experience',
    name: '实战空间站',
    label: 'STATION ALPHA',
    logPrefix: '航行记录',
    description: '项目实战、竞赛荣誉与任务履历。',
    type: 'station',
    x: 26,
    y: 66,
  },
  {
    id: 'crew',
    name: '观测台',
    label: 'OBSERVATORY',
    logPrefix: '船员档案',
    description: '个人简介、教育与基础信息。',
    type: 'observatory',
    x: 74,
    y: 62,
  },
]

export function getCategory(id) {
  return categories.find((c) => c.id === id) ?? null
}
