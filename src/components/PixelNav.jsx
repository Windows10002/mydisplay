import PixelButton from './PixelButton'
import './PixelNav.css'

const LINKS = [
  { id: 'console', label: '← 控制台' },
  { id: 'universe', label: '宇宙全景' },
  { id: 'log', label: '航行日志' },
  { id: 'crew', label: '船员档案' },
  { id: 'comm', label: '通讯终端' },
]

export default function PixelNav({ current, onNavigate }) {
  return (
    <nav className="pixel-nav" aria-label="航行导航">
      <div className="pixel-nav__inner">
        <PixelButton variant="ghost" size="sm" onClick={() => onNavigate('console')}>
          ENDURANCE
        </PixelButton>
        <span className="pixel-nav__title">创作星域 · ORION SECTOR</span>
        <div className="pixel-nav__actions">
          {LINKS.filter((l) => l.id !== 'console').map((link) => (
            <PixelButton
              key={link.id}
              variant={current === link.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </PixelButton>
          ))}
        </div>
      </div>
    </nav>
  )
}
