const MODULES = [
  'LANDER', 'HAB-1', 'HAB-2', 'HAB-3', 'HAB-4',
  'COM', 'MAIN', 'DOCK', 'DATA', 'PWR', 'NAV', 'ENG',
]

export default function EnduranceRing({ activeModule = 'MAIN', scanning = false }) {
  return (
    <div className={`endurance-ring ${scanning ? 'endurance-ring--scan' : ''}`} aria-hidden="true">
      <div className="endurance-ring__label">ENDURANCE · RING SCHEMATIC</div>
      <div className="endurance-ring__viewport">
        <div className="endurance-ring__spokes" />
        <div className="endurance-ring__hub">
          <span>CORE</span>
        </div>
        {MODULES.map((name, i) => {
          const angle = (i / MODULES.length) * 360
          return (
            <div
              key={name}
              className={`endurance-ring__pod ${name === activeModule ? 'is-active' : ''}`}
              style={{ '--angle': `${angle}deg` }}
            >
              <span className="endurance-ring__pod-body" />
              <span className="endurance-ring__pod-label">{name}</span>
            </div>
          )
        })}
      </div>
      <div className="endurance-ring__status">
        <span className="endurance-ring__nom">DOCKING CLAMPS · LOCKED</span>
        <span className="endurance-ring__nom">SPIN · 5.6 RPM</span>
      </div>
    </div>
  )
}
