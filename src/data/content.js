export const profile = {
  name: '李可欣',
  nameEn: 'Li Kexin',
  age: 21,
  tagline: '用数据读懂需求，用产品连接价值',
  origin: '开普勒星系',
  intro:
    '广东白云学院人工智能专业在读，专业前 1%，2025 年国家奖学金获得者。擅长 AI 产品落地、端侧模型部署与数据驱动迭代，在智能教育、生态监测与软硬协同等方向有完整项目经验。',
  education: '广东白云学院 · 人工智能（本科）',
  educationPeriod: '2023.09 — 2027.06',
  location: '广州',
  hometown: '广东汕头',
  email: '3022748402@qq.com',
  phone: '166 2001 7305',
  role: 'AI 产品 / 数据方向',
  callsign: '开普勒-001',
}

/** 登舰欢迎 · 主机自我介绍（打字机） */
export const hostIntroLines = [
  '> 信号接入… 距离地球 1,200 光年',
  '> 你好，地球人。',
  '> 我是来自开普勒星球的李可欣。',
  '> 永恒号指挥舱已就绪，生命维持与导航系统正常。',
  '> 接下来，我将带你参观我们的控制台。',
  '> 你可以浏览我的项目、荣誉与航行记录。',
  '> 准备好了吗？',
]

export const shipStatus = {
  oxygen: 98,
  power: 94,
  comm: 100,
  gravity: 1.0,
}

export const consoleLogs = [
  '系统加载中… 舰长：李可欣',
  '领域：人工智能 · AI 产品 · 数据洞察',
  '任务：展示项目成果与航行履历',
  '目标星域：开普勒星系 · 永恒号指挥舱',
  '通讯链路：稳定 | 遥测：正常',
]

export const stats = [
  { value: '3', label: '核心项目', system: 'MISSION COUNT' },
  { value: '98%', label: '批改准确率', system: 'AI ACCURACY' },
  { value: '8项', label: '国家级奖项', system: 'AWARDS' },
  { value: 'Top 5%', label: '专业排名', system: 'RANK' },
]

export const projects = [
  {
    id: 1,
    missionNo: '003',
    title: '智能作业批改系统',
    role: '产品负责人',
    period: '2026.05 — 2026.06',
    description:
      '面向 K12 教育搭建 AI 智能批改工具，主导学情分析模块需求定义与模型选型调优，推动批改准确率提升至 98%，负责网页端功能设计与 IP 整体风格规划。',
    tags: ['AI 产品', '学情分析', '模型调优', '产品设计'],
    pixelBg: '#101A33',
    accent: '#26FF98',
    log: '教育智能批改链路部署，学情数据闭环验证通过。',
    url: 'https://first-seven-lake.vercel.app/',
  },
  {
    id: 2,
    missionNo: '002',
    title: '水族馆生态监测与智能清洁机器人',
    role: '主要负责人',
    period: '2025.12 — 至今',
    description:
      '省级攀登计划项目。以树莓派 4B 为核心，集成多模态传感与 YOLO 目标检测，部署轻量化 LLM 实现水质预警、清理优先级排序与路径规划，通过 AI Agent 驱动机械臂无人化运行。',
    tags: ['深度学习', 'YOLO', 'LLM Agent', '树莓派', '软硬协同'],
    pixelBg: '#101A33',
    accent: '#FF7A2F',
    log: '生态监测站上线，多模态感知与 Agent 决策链路联调完成。',
    url: 'https://github.com/Windows10002/zhinengqinglijiqiren',
  },
  {
    id: 3,
    missionNo: '001',
    title: '水产养殖水质监测系统',
    role: '主要负责人',
    period: '2024.12 — 2025.12',
    description:
      '面向中小养殖户的低成本智能水质监测系统。实地采集养殖数据，用 Excel、Python 完成清洗与趋势建模，推动产品完成 3 轮迭代，验证数据驱动的产品优化路径。',
    tags: ['Python', '数据分析', '用户调研', '产品迭代'],
    pixelBg: '#101A33',
    accent: '#80E8FF',
    log: '水质监测终端三轮迭代，用户调研驱动产品形态收敛。',
    url: 'https://github.com/Windows10002/shuizhijiance',
  },
]

export const strengths = [
  {
    icon: '01',
    title: 'AI 产品落地',
    level: 93,
    description: '具备教育、养殖等场景从模型选型、需求定义到网页端产品设计的全流程能力。',
  },
  {
    icon: '02',
    title: '端侧 AI 部署',
    level: 90,
    description: 'Jetson Nano YOLOv8 TensorRT 部署、树莓派轻量化推理与软硬协同调试经验。',
  },
  {
    icon: '03',
    title: '数据洞察',
    level: 92,
    description: 'Python、Excel 数据清洗与趋势建模；门店用户画像分析，助力转化率提升 15%。',
  },
  {
    icon: '04',
    title: '项目管理',
    level: 91,
    description: '曾任西区会长，统筹 10+ 场校级活动，擅长跨部门协同与多项目并行推进。',
  },
  {
    icon: '05',
    title: '竞赛实战',
    level: 94,
    description: 'ROBOCON 全国一等奖等 8 项国家级奖项，嵌入式芯片竞赛全国三等奖。',
  },
  {
    icon: '06',
    title: '工具链',
    level: 88,
    description: 'Python、C、嵌入式开发；Figma、VS Code、Cursor、Git；华为 HCIA 认证。',
  },
]

export const honors = [
  { year: '2025', title: '国家奖学金', detail: 'GPA 3.73，专业排名前 5%' },
  { year: '2025', title: 'ROBOCON 全国一等奖', detail: '第二十四届全国大学生机器人大赛等 8 项国家级奖项' },
  { year: '2025', title: '蓝桥杯嵌入式组', detail: '广东省三等奖' },
  { year: '2025', title: '中国国际创新创业大赛', detail: '省级三等奖（连续 2 年）' },
  { year: '2024', title: '嵌入式芯片与系统设计竞赛', detail: '全国三等奖 / 南部赛区一等奖' },
  { year: '2024', title: '菱朗杯汽车与农机电子环保大赛', detail: '广东省三等奖' },
  { year: '—', title: '校级与院级荣誉', detail: '累计 30 余项' },
]

export const campusExperience = [
  {
    period: '2024.09 — 2025.09',
    org: '广东白云学院机器人队',
    role: '软件组成员',
    detail:
      '加入校机器人队软件组，参与第二十四届全国大学生机器人大赛 ROBOCON 备赛与全国赛。负责 YOLOv8 模型训练与端侧部署、路径规划算法联调，以及大模型辅助决策模块开发，支撑战队斩获全国一等奖。',
    highlights: ['ROBOCON 全国一等奖 · 软件组核心开发', 'YOLOv8 端侧部署与路径规划', '大模型辅助决策模块'],
  },
  {
    period: '2023.12 — 2025.06',
    org: '电子设计与制作协会',
    role: '核心成员',
    detail:
      '长期参与协会嵌入式与智能电子作品研发。主导多类传感器数据采集方案，完成嵌入式 AI 算法移植与调试，协同团队完成智能电子作品从原型到落地的完整链路，积累软硬协同开发经验。',
    highlights: ['嵌入式 AI 算法移植', '传感器数据采集与融合', '智能电子作品研发'],
  },
  {
    period: '2024.06 — 2025.06',
    org: '大学生就业创新创业促进会',
    role: '西区会长',
    detail:
      '担任西区会长，统筹 10+ 场校级大型活动，从策划、排期到现场执行全流程负责。搭建跨部门协作与项目管理机制，协调志愿者与社团资源，提升活动执行效率与参与体验。',
    highlights: ['统筹 10+ 场校级活动', '跨部门协作与项目管理', '西区运营与志愿者协调'],
  },
]

export const internships = [
  {
    period: '2025.12 — 2026.03',
    company: '昆明新螺蛳湾国际商贸城',
    role: '数据分析实习生',
    detail:
      '负责线上线下店用户数据分析，运用 Python 完成数据清洗、分层用户画像搭建与消费趋势建模。基于分析结论提出运营策略，助力相关门店月度转化率提升 15%。',
    highlights: ['线上线下店用户数据分析', '用户分层画像与趋势建模', 'Python 数据清洗', '转化率提升 15%'],
  },
  {
    period: '2023.06 — 2023.09',
    company: '汕头潮南古溪织布厂',
    role: '生产跟单实习生',
    detail:
      '参与生产排期与品质管控，跟进订单全流程，协调生产、仓储与质检环节。在快节奏制造环境中锻炼沟通协同能力，熟悉从接单到出货的完整跟单链路。',
    highlights: ['生产排期与品质管控', '订单全流程跟进', '跨部门生产协同'],
  },
]

export const flightLogs = [
  {
    date: '2026.05',
    title: '智能批改系统任务启动',
    body: '担任产品负责人，批改准确率提升至 98%，负责学情分析与产品设计。',
  },
  {
    date: '2025.12',
    title: '攀登计划 · 生态监测机器人',
    body: '省级项目主要负责人，多模态感知与 AI Agent 决策系统落地。',
  },
  {
    date: '2025.06',
    title: '国家奖学金',
    body: 'GPA 3.73，专业排名前 5%。',
  },
  {
    date: '2025.05',
    title: 'ROBOCON 全国一等奖',
    body: '机器人队软件组，端侧 YOLO 部署与路径规划模块。',
  },
  {
    date: '2024.12',
    title: '水质监测系统首航',
    body: '校级创新项目负责人，完成 3 轮产品迭代。',
  },
  {
    date: '2024.09',
    title: '登舰 · 人工智能专业',
    body: '广东白云学院入学，选定 AI 产品与数据方向。',
  },
]

export const skills = [
  'Python', 'C语言', '嵌入式开发', 'YOLO', 'TensorRT', 'LLM', 'Excel', 'Figma', 'Git', '用户调研', '产品迭代',
]

export const certifications = [
  '大学英语四级',
  '华为 HCIA 认证',
  '中国创业培训证书',
]

export const navLinks = [
  { label: '关于', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
]
