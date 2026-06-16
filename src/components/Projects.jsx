import { projects } from '../data/content'
import './Projects.css'

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects__header">
          <span className="section-label">Works</span>
          <h2 className="section-title">精选项目</h2>
          <p className="section-desc">
            从教育智能到生态监测，每个项目都围绕真实场景的数据洞察与产品落地。
          </p>
        </div>

        <div className="projects__list">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`project-card ${index % 2 === 1 ? 'project-card--reverse' : ''}`}
            >
              <div
                className="project-card__visual"
                style={{
                  '--project-bg': project.pixelBg,
                  '--project-accent': project.accent,
                }}
              >
                <div className="project-card__visual-inner">
                  <span className="project-card__visual-icon">
                    {String(project.id).padStart(2, '0')}
                  </span>
                  <div className="project-card__visual-grid" />
                </div>
              </div>

              <div className="project-card__body">
                <div className="project-card__meta">
                  <span className="project-card__role">{project.role}</span>
                  <span className="project-card__period">{project.period}</span>
                </div>

                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>

                <div className="project-card__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
