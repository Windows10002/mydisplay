import './PixelButton.css'

export default function PixelButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`pixel-btn pixel-btn--${variant} pixel-btn--${size} ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      <span className="pixel-btn__face">{children}</span>
    </button>
  )
}
