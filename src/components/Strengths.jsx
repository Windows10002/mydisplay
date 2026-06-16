import { strengths } from '../data/content'
import './Strengths.css'

export default function Strengths() {
  return (
    <section id="strengths" className="strengths">
      <div className="container">
        <div className="strengths__header">
          <span className="section-label">Skills</span>
          <h2 className="section-title">个人优势</h2>
          <p className="section-desc">
            数据、产品、协作——三个维度支撑我从洞察到落地的完整链路。
          </p>
        </div>

        <div className="strengths__grid">
          {strengths.map((item, index) => (
            <div
              key={item.title}
              className="strength-card"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <span className="strength-card__icon">{item.icon}</span>
              <h3 className="strength-card__title">{item.title}</h3>
              <p className="strength-card__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
