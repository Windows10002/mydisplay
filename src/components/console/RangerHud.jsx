/** 徘徊者驾驶舱 HUD — 叠加在导航视口上 */
export default function RangerHud() {
  return (
    <div className="ranger-hud" aria-hidden="true">
      <div className="ranger-hud__frame">
        <span className="ranger-hud__corner ranger-hud__corner--tl" />
        <span className="ranger-hud__corner ranger-hud__corner--tr" />
        <span className="ranger-hud__corner ranger-hud__corner--bl" />
        <span className="ranger-hud__corner ranger-hud__corner--br" />
      </div>

      <div className="ranger-hud__pitch-ladder">
        {[-20, -10, 0, 10, 20].map((deg) => (
          <div key={deg} className={`ranger-hud__pitch ${deg === 0 ? 'ranger-hud__pitch--zero' : ''}`}>
            <span className="ranger-hud__pitch-line" />
            <span className="ranger-hud__pitch-label">{deg === 0 ? '0°' : `${deg > 0 ? '+' : ''}${deg}`}</span>
          </div>
        ))}
      </div>

      <div className="ranger-hud__horizon" />

      <div className="ranger-hud__reticle">
        <span className="ranger-hud__reticle-h" />
        <span className="ranger-hud__reticle-v" />
        <span className="ranger-hud__reticle-dot" />
        <span className="ranger-hud__reticle-ring" />
      </div>

      <div className="ranger-hud__readout ranger-hud__readout--tl">
        <span className="ranger-hud__readout-label">RANGER-01</span>
        <span className="ranger-hud__readout-val">NAV HUD</span>
      </div>
      <div className="ranger-hud__readout ranger-hud__readout--tr">
        <span className="ranger-hud__readout-label">VEL</span>
        <span className="ranger-hud__readout-val">0.01 C</span>
      </div>
      <div className="ranger-hud__readout ranger-hud__readout--bl">
        <span className="ranger-hud__readout-label">HDG</span>
        <span className="ranger-hud__readout-val">247.3°</span>
      </div>
      <div className="ranger-hud__readout ranger-hud__readout--br">
        <span className="ranger-hud__readout-label">ALT</span>
        <span className="ranger-hud__readout-val">26 KY</span>
      </div>
    </div>
  )
}
