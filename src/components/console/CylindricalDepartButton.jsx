import './CylindricalDepartButton.css'

export default function CylindricalDepartButton({
  label = '出发',
  sublabel,
  hint,
  armed = false,
  disabled = false,
  onClick,
  onMouseEnter,
}) {
  return (
    <button
      type="button"
      className={`cyl-depart ${armed ? 'cyl-depart--armed' : ''} ${disabled ? 'cyl-depart--disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-label={label}
    >
      <span className="cyl-depart__plate" aria-hidden="true">
        <span className="cyl-depart__screw cyl-depart__screw--tl" />
        <span className="cyl-depart__screw cyl-depart__screw--tr" />
        <span className="cyl-depart__screw cyl-depart__screw--bl" />
        <span className="cyl-depart__screw cyl-depart__screw--br" />

        <span className="cyl-depart__well">
          <span className="cyl-depart__led-ring" />
          <span className="cyl-depart__assembly">
            <span className="cyl-depart__barrel">
              <span className="cyl-depart__barrel-shine" />
              <span className="cyl-depart__barrel-shadow" />
            </span>
            <span className="cyl-depart__top">
              <span className="cyl-depart__top-gloss" />
              <span className="cyl-depart__top-label">{label}</span>
              <span className="cyl-depart__top-mark">GO</span>
            </span>
          </span>
        </span>
      </span>

      {sublabel && <span className="cyl-depart__sublabel">{sublabel}</span>}
      {hint && <span className="cyl-depart__hint">{hint}</span>}
    </button>
  )
}
