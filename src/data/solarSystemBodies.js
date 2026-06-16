/** 全屏太阳系探索 · 天体档案（位置由渲染器动态计算） */
import { profile, projects, honors, internships, campusExperience } from './content'

export const SOLAR_BODY_META = [
  {
    id: 'sun',
    planetName: null,
    label: '太阳',
    name: 'AIGC作品',
    kind: 'sun',
    color: '#ffb84a',
    lines: ['AIGC 创作与生成式作品', '全屏播放 AIGC 作品集'],
  },
  {
    id: 'mercury',
    planetName: 'Mercury',
    label: '水星',
    name: '基础档案',
    kind: 'planet',
    color: '#8a8a8a',
    lines: [
      profile.education,
      profile.educationPeriod,
      `GPA 3.73 · 专业前 5% · ${profile.hometown}`,
    ],
  },
  {
    id: 'venus',
    planetName: 'Venus',
    label: '金星',
    name: '作品集',
    kind: 'planet',
    color: '#c4a06a',
    lines: [profile.tagline, `来自${profile.origin}的 AI 产品探索者`],
  },
  {
    id: 'earth',
    planetName: 'Earth',
    label: '地球',
    name: '个人项目',
    kind: 'planet',
    color: '#2f6ea8',
    lines: projects.map((p) => p.title),
  },
  {
    id: 'mars',
    planetName: 'Mars',
    label: '火星',
    name: '竞赛荣誉',
    kind: 'planet',
    color: '#b84a28',
    lines: honors.slice(0, 4).map((h) => `${h.year} · ${h.title}`),
  },
  {
    id: 'jupiter',
    planetName: 'Jupiter',
    label: '木星',
    name: '校园经历',
    kind: 'planet',
    color: '#b8895a',
    lines: campusExperience.map((c) => `${c.org} · ${c.role}`),
  },
  {
    id: 'saturn',
    planetName: 'Saturn',
    label: '土星',
    name: '国家奖学金',
    kind: 'planet',
    color: '#d8c898',
    lines: ['2025 年国家奖学金', 'GPA 3.73 · 专业前 5%'],
  },
  {
    id: 'uranus',
    planetName: 'Uranus',
    label: '天王星',
    name: '实习经历',
    kind: 'planet',
    color: '#7ec8dc',
    lines: internships.map((i) => `${i.role} · ${i.company}`),
  },
  {
    id: 'neptune',
    planetName: 'Neptune',
    label: '海王星',
    name: '联系方式',
    kind: 'planet',
    color: '#3a52c4',
    lines: [profile.email, profile.phone, profile.location],
  },
]

/** @deprecated 使用 SOLAR_BODY_META + getSolarBodyPositions */
export const SOLAR_BODIES = SOLAR_BODY_META

export function getSolarBody(id) {
  return SOLAR_BODY_META.find((b) => b.id === id) ?? null
}
