export function ShipToggle({ label, on, onClick }) {
  return (
    <button type="button" className={`ship-toggle ${on ? 'is-on' : ''}`} onClick={onClick} aria-pressed={on}>
      <span className="ship-toggle__track">
        <span className="ship-toggle__thumb" />
      </span>
      <span className="ship-toggle__label">{label}</span>
    </button>
  )
}

export function ShipPushButton({
  label,
  sublabel,
  hint,
  variant = 'main',
  onClick,
  onMouseEnter,
  className = '',
  selected = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={`ship-push ship-push--${variant} ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''} ${className}`.trim()}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
    >
      <span className="ship-push__bezel">
        <span className="ship-push__cap">{label}</span>
        {selected && <span className="ship-push__lock-ring" aria-hidden="true" />}
      </span>
      {sublabel && <span className="ship-push__sub">{sublabel}</span>}
      {hint && <span className="ship-push__hint">{hint}</span>}
    </button>
  )
}

export function ShipGauge({ label, value, max = 100, unit = '%' }) {
  const pct = Math.min(100, (value / max) * 100)
  const angle = (pct / 100) * 270 - 135
  return (
    <div className="ship-gauge">
      <div className="ship-gauge__dial" style={{ '--needle': `${angle}deg` }}>
        <span className="ship-gauge__tick ship-gauge__tick--min" />
        <span className="ship-gauge__tick ship-gauge__tick--mid" />
        <span className="ship-gauge__tick ship-gauge__tick--max" />
        <span className="ship-gauge__needle" />
        <span className="ship-gauge__hub" />
      </div>
      <span className="ship-gauge__label">{label}</span>
      <span className="ship-gauge__value">{value}{unit}</span>
    </div>
  )
}

export function ModuleLight({ label, status = 'nom' }) {
  const stateLabel = {
    nom: 'NOM',
    warn: 'WARN',
    cal: 'CAL',
    active: 'ACT',
  }[status] ?? 'NOM'

  return (
    <div className={`module-light module-light--${status}`}>
      <span className="module-light__led" />
      <span className="module-light__name">{label}</span>
      <span className="module-light__state">{stateLabel}</span>
    </div>
  )
}
