import { getSolarBody } from './solarSystemBodies'
import { SUN_AIGC_VIDEO, VENUS_PORTFOLIO_VIDEO } from './planetAssets'

/** 行星特征环境 · 科学描述 + 档案映射 */
export const PLANET_ENVIRONMENTS = {
  sun: {
    id: 'sun',
    label: '太阳',
    category: 'star',
    categoryLabel: '恒星',
    tagline: '太阳系中心 · 氢氦聚变',
    facts: [
      { key: '结构', value: '核心温度约 1500 万℃，外层光球向外辐射能量，无固态表面' },
      { key: '大气', value: '主要由氢、氦组成，日冕延伸至行星际空间' },
      { key: '现象', value: '太阳黑子、耀斑、日冕物质抛射，驱动全系统气候与空间天气' },
      { key: '环境', value: '极强辐射与磁场，是八大行星能量来源' },
    ],
    palette: { bg: '#1a0800', sky: '#3a1808', accent: '#ffb84a', particle: '#ff7a2f' },
    effect: 'corona',
    video: SUN_AIGC_VIDEO,
    videoEngageLabel: '播放',
    videoEngageSub: '全屏播放 AIGC 作品集',
  },
  mercury: {
    id: 'mercury',
    label: '水星',
    category: 'terrestrial',
    categoryLabel: '类地行星',
    tagline: '离太阳最近 · 昼夜温差最大',
    facts: [
      { key: '大气', value: '几乎无永久大气层，仅极稀薄氢、氦、氧，太阳风直接轰击地表' },
      { key: '温度', value: '白天赤道约 430℃，夜间约 -172℃，温差超 600℃' },
      { key: '地貌', value: '密布陨石坑，荒漠裸岩，无河流、无活跃火山，无卫星' },
      { key: '其他', value: '磁场微弱、辐射极强；公转 88 地球日，自转极慢，无水无生命' },
    ],
    palette: { bg: '#0a0a12', sky: '#1a1a28', accent: '#8a8a8a', particle: '#b8b8b8' },
    effect: 'craters',
  },
  venus: {
    id: 'venus',
    label: '金星',
    category: 'terrestrial',
    categoryLabel: '类地行星',
    tagline: '失控温室 · 太阳系最热行星',
    facts: [
      { key: '大气', value: '96% 二氧化碳，地表气压约为地球 90 倍；高空浓硫酸云，常年硫酸雨' },
      { key: '温度', value: '地表恒定约 462℃，比水星更热，锡、铅会熔化' },
      { key: '地貌', value: '遍布火山与熔岩平原，云层完全遮蔽地表；逆向自转，243 天一圈' },
      { key: '其他', value: '无磁场、无卫星，酸雨持续腐蚀地表，完全不适合生命' },
    ],
    palette: { bg: '#1a1008', sky: '#3a2810', accent: '#c4a06a', particle: '#e8c878' },
    effect: 'acidRain',
    video: VENUS_PORTFOLIO_VIDEO,
    videoEngageLabel: '开启作品集',
    videoEngageSub: '全屏播放个人作品集',
  },
  earth: {
    id: 'earth',
    label: '地球',
    category: 'terrestrial',
    categoryLabel: '类地行星',
    tagline: '唯一宜居 · 生命家园',
    facts: [
      { key: '大气', value: '78% 氮 + 21% 氧，臭氧层阻挡紫外线，风雨云雪水循环温和' },
      { key: '温度', value: '地表平均约 15℃，液态水覆盖 71% 表面积' },
      { key: '地貌', value: '板块运动活跃，陆地、海洋、山脉、河流、冰川与多样生态' },
      { key: '其他', value: '强磁场抵御辐射；月球稳定自转轴形成四季，完整碳循环孕育生命' },
    ],
    palette: { bg: '#041018', sky: '#0a2848', accent: '#2f6ea8', particle: '#8ec8e8' },
    effect: 'clouds',
  },
  mars: {
    id: 'mars',
    label: '火星',
    category: 'terrestrial',
    categoryLabel: '类地行星',
    tagline: '红色星球 · 沙尘与冰冠',
    facts: [
      { key: '大气', value: '极稀薄，95% 二氧化碳，气压仅地球 0.6%，无法留存液态水' },
      { key: '温度', value: '白天最高约 20℃，夜间约 -130℃；两极有干冰与水冰极冠' },
      { key: '地貌', value: '氧化铁呈橘红色；奥林帕斯山、最长峡谷、荒漠沙丘与陨石坑' },
      { key: '其他', value: '全球沙尘暴可持续数月；地下大量水冰，无全球磁场，辐射强' },
    ],
    palette: { bg: '#120808', sky: '#281008', accent: '#b84a28', particle: '#d87850' },
    effect: 'dustStorm',
  },
  jupiter: {
    id: 'jupiter',
    label: '木星',
    category: 'gasGiant',
    categoryLabel: '气态巨行星',
    tagline: '太阳系最大 · 条纹与风暴',
    facts: [
      { key: '结构', value: '无固态地表，外层氢氦大气向内变为液态金属氢，核心为岩石重元素' },
      { key: '风暴', value: '大气条纹分明；大红斑持续数百年，直径可容下三个地球' },
      { key: '温度', value: '云顶约 -145℃，向内压力与温度急剧升高，内核数万摄氏度' },
      { key: '环境', value: '磁场太阳系最强，辐射致命；数十颗卫星，氢氦为主，无液态水' },
    ],
    palette: { bg: '#0a0810', sky: '#1a1420', accent: '#b8895a', particle: '#dcc8a0' },
    effect: 'bands',
  },
  saturn: {
    id: 'saturn',
    label: '土星',
    category: 'gasGiant',
    categoryLabel: '气态巨行星',
    tagline: '低密度巨星 · 壮丽环系',
    facts: [
      { key: '结构', value: '氢氦为主，平均密度小于水；无固体地表' },
      { key: '环系', value: '行星环由数十亿冰块与岩石碎屑组成，宽而薄，反光极强' },
      { key: '大气', value: '云顶约 -178℃，北极有稳定六边形风暴；云层由氨、水冰构成' },
      { key: '其他', value: '磁场强大；卫星极多，土卫六拥有浓厚氮大气与甲烷湖' },
    ],
    palette: { bg: '#0c0a08', sky: '#1a1810', accent: '#d8c898', particle: '#f0e8c8' },
    effect: 'rings',
  },
  uranus: {
    id: 'uranus',
    label: '天王星',
    category: 'iceGiant',
    categoryLabel: '冰巨行星',
    tagline: '躺着公转 · 太阳系最冷',
    facts: [
      { key: '姿态', value: '自转轴倾斜 98°，一面可连续 42 年白昼、另一面 42 年黑夜' },
      { key: '成分', value: '氢氦与大量甲烷冰，吸收红光呈淡蓝绿色；内部富含水氨甲烷冰幔' },
      { key: '温度', value: '云顶最低约 -224℃，太阳系行星中最低' },
      { key: '环境', value: '风暴微弱，磁场偏离中心；暗淡冰质环与冰卫星，极度严寒' },
    ],
    palette: { bg: '#060c14', sky: '#0a1828', accent: '#7ec8dc', particle: '#b0e8f0' },
    effect: 'iceTilt',
  },
  neptune: {
    id: 'neptune',
    label: '海王星',
    category: 'iceGiant',
    categoryLabel: '冰巨行星',
    tagline: '最外侧 · 风暴最强',
    facts: [
      { key: '大气', value: '高浓度甲烷呈深蓝色；风速可达 2100 km/h，远超地球' },
      { key: '结构', value: '厚层水 / 氨 / 甲烷冰幔，小型岩石内核，外层氢氦大气' },
      { key: '温度', value: '云顶约 -214℃，内部热源强于天王星' },
      { key: '环境', value: '暗弱行星环，多颗冰冻卫星；常年超级风暴，低温高压无法登陆' },
    ],
    palette: { bg: '#040818', sky: '#081838', accent: '#3a52c4', particle: '#6888e0' },
    effect: 'storm',
  },
}

export function getPlanetEnvironment(id) {
  return PLANET_ENVIRONMENTS[id] ?? null
}

export function getPlanetArchive(id) {
  return getSolarBody(id)
}
