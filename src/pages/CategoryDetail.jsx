import { useState } from 'react'
import { getCategory } from '../data/categories'
import { profile, projects, stats, strengths } from '../data/content'
import { playBeep } from '../utils/sound'
import PixelButton from '../components/PixelButton'
import PixelNav from '../components/PixelNav'
import './CategoryDetail.css'

function ProjectsView() {
  const [active, setActive] = useState(projects[0])

  return (
    <div className="detail-layout">
      <aside className="detail-sidebar">
        <h3 className="detail-sidebar__title">站点列表</h3>
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`detail-sidebar__item ${active.id === p.id ? 'detail-sidebar__item--active' : ''}`}
            onClick={() => { playBeep('click'); setActive(p) }}
          >
            <span>No.{p.missionNo}</span>
            <span>{p.title}</span>
          </button>
        ))}
      </aside>

      <article className="detail-main">
        <div className="detail-main__visual" style={{ '--accent': active.accent }}>
          <span className="detail-main__mission">任务记录 No.{active.missionNo}</span>
          <h2 className="detail-main__heading">{active.title}</h2>
        </div>
        <p className="detail-main__desc">{active.description}</p>
        <p className="detail-main__log">{active.log}</p>
        <div className="detail-main__tags">
          {active.tags.map((t) => (
            <span key={t} className="detail-tag">{t}</span>
          ))}
        </div>
        <p className="detail-main__meta">{active.role} · {active.period}</p>
      </article>

      <aside className="detail-panel">
        <h3 className="detail-panel__title">数据终端</h3>
        <dl className="detail-panel__list">
          <div><dt>任务编号</dt><dd>{active.missionNo}</dd></div>
          <div><dt>执行角色</dt><dd>{active.role}</dd></div>
          <div><dt>航行时段</dt><dd>{active.period}</dd></div>
          <div><dt>搭载技术</dt><dd>{active.tags.join(' / ')}</dd></div>
        </dl>
      </aside>
    </div>
  )
}

function SkillsView() {
  return (
    <div className="detail-skills">
      <p className="detail-intro">环绕核心行星的技能卫星群，各模块独立运行、协同运作。</p>
      <div className="detail-skills__grid">
        {strengths.map((s) => (
          <div key={s.icon} className="skill-module">
            <div className="skill-module__head">
              <span className="skill-module__id">MOD-{s.icon}</span>
              <span className="skill-module__title">{s.title}</span>
            </div>
            <div className="skill-module__bar">
              <div className="skill-module__fill" style={{ width: `${s.level}%` }} />
            </div>
            <p className="skill-module__desc">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExperienceView() {
  return (
    <div className="detail-exp">
      <div className="detail-exp__header">
        <div className="detail-exp__monogram">{profile.name.slice(-1)}</div>
        <div>
          <h2 className="detail-exp__name">{profile.name}</h2>
          <p className="detail-exp__edu">{profile.education}</p>
        </div>
      </div>
      <p className="detail-intro">{profile.intro}</p>
      <div className="detail-exp__stats">
        {stats.map((s) => (
          <div key={s.label} className="detail-exp__stat">
            <span className="detail-exp__stat-val">{s.value}</span>
            <span className="detail-exp__stat-label">{s.label}</span>
            <span className="detail-exp__stat-sys">{s.system}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CrewPreview() {
  return (
    <div className="detail-crew-preview">
      <p className="detail-intro">观测台已捕获船员信号。完整档案请前往船员舱。</p>
      <dl className="detail-panel__list detail-panel__list--wide">
        <div><dt>姓名</dt><dd>{profile.name} ({profile.nameEn})</dd></div>
        <div><dt>呼号</dt><dd>{profile.callsign}</dd></div>
        <div><dt>任务方向</dt><dd>{profile.role}</dd></div>
        <div><dt>驻地</dt><dd>{profile.location}</dd></div>
      </dl>
    </div>
  )
}

const VIEWS = {
  projects: ProjectsView,
  skills: SkillsView,
  experience: ExperienceView,
  crew: CrewPreview,
}

export default function CategoryDetail({ categoryId, onNavigate }) {
  const cat = getCategory(categoryId)
  const View = VIEWS[categoryId] ?? ProjectsView

  if (!cat) {
    return (
      <div className="detail-page">
        <PixelNav onNavigate={onNavigate} />
        <p className="detail-error">星域未找到</p>
      </div>
    )
  }

  return (
    <div className={`detail-page detail-page--${cat.type}`}>
      <div className="detail-page__bg" aria-hidden="true" />
      <PixelNav onNavigate={onNavigate} />

      <div className="detail-page__inner container">
        <header className="detail-page__header">
          <span className="section-label">{cat.logPrefix}</span>
          <h1 className="section-title">{cat.name}</h1>
          <p className="section-desc">{cat.description}</p>
        </header>

        <View />

        <footer className="detail-page__nav">
          <PixelButton variant="ghost" onClick={() => onNavigate('universe')}>
            ← 返回宇宙
          </PixelButton>
          {categoryId === 'crew' && (
            <PixelButton variant="primary" onClick={() => onNavigate('crew')}>
              进入船员舱 →
            </PixelButton>
          )}
        </footer>
      </div>
    </div>
  )
}
