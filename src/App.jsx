import { useCallback, useEffect, useState } from 'react'
import SpaceCursor from './components/SpaceCursor'
import BoardingCinematic, { shouldSkipCinematic } from './pages/BoardingCinematic'
import CategoryDetail from './pages/CategoryDetail'
import CommTerminal from './pages/CommTerminal'
import ConsoleHome from './pages/ConsoleHome'
import CrewArchive from './pages/CrewArchive'
import FlightLog from './pages/FlightLog'
import UniverseHub from './pages/UniverseHub'
import WormholeTransition from './pages/WormholeTransition'

export default function App() {
  const [page, setPage] = useState(() => {
    try {
      if (sessionStorage.getItem('endurance-intro-done') === '1') return 'console'
      if (sessionStorage.getItem('endurance-cinematic-done') === '1') return 'console'
    } catch { /* ignore */ }
    return 'cinematic'
  })

  const navigate = useCallback((target) => {
    setPage(target)
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('console-page', page === 'console')
    document.body.classList.toggle('cinematic-page', page === 'cinematic')
    return () => {
      document.body.classList.remove('console-page')
      document.body.classList.remove('cinematic-page')
    }
  }, [page])

  const showCursor = page !== 'wormhole' && page !== 'cinematic'

  const [consoleFromIntro, setConsoleFromIntro] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setConsoleFromIntro(true)
    setPage('console')
  }, [])

  const handleConsoleEntryHandled = useCallback(() => {
    setConsoleFromIntro(false)
  }, [])

  let content
  switch (true) {
    case page === 'cinematic':
      content = <BoardingCinematic onComplete={handleIntroComplete} />
      break
    case page === 'console':
      content = (
        <ConsoleHome
          onNavigate={navigate}
          entryFromIntro={consoleFromIntro}
          onEntryHandled={handleConsoleEntryHandled}
        />
      )
      break
    case page === 'wormhole':
      content = <WormholeTransition onComplete={() => setPage('universe')} />
      break
    case page === 'universe':
      content = <UniverseHub onNavigate={navigate} />
      break
    case page === 'crew':
      content = <CrewArchive onNavigate={navigate} />
      break
    case page === 'log':
      content = <FlightLog onNavigate={navigate} />
      break
    case page === 'comm':
      content = <CommTerminal onNavigate={navigate} />
      break
    case page.startsWith('category-'):
      content = (
        <CategoryDetail
          categoryId={page.replace('category-', '')}
          onNavigate={navigate}
        />
      )
      break
    default:
      content = <ConsoleHome onNavigate={navigate} />
  }

  return (
    <>
      {showCursor && <SpaceCursor />}
      {content}
    </>
  )
}
