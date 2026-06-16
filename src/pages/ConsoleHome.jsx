import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shipStatus } from '../data/content'
import { loadCrewSession } from '../data/consoleCommands'
import { playBeep, playConsoleBoot, playDepartLaunch, playSwitch } from '../utils/sound'
import PixelPushLever from '../components/console/PixelPushLever'
import ConsoleBoot from '../components/console/ConsoleBoot'
import CrewIdentification from '../components/console/CrewIdentification'
import CrtMissionDisplay from '../components/console/CrtMissionDisplay'
import EnduranceRing from '../components/console/EnduranceRing'
import SolarSystemExplorer from '../components/console/SolarSystemExplorer'
import SolarSystemViewport from '../components/console/SolarSystemViewport'
import {
  ModuleLight,
  ShipGauge,
  ShipToggle,
} from '../components/console/ShipControls'
import WormholeTransition from '../pages/WormholeTransition'
import './ConsoleHome.css'

const IDLE_MS = 45000

function resolvePhase(entryFromIntro) {
  if (loadCrewSession()) {
    return entryFromIntro ? 'standby' : 'boot'
  }
  return entryFromIntro ? 'crew-id' : 'boot'
}

export default function ConsoleHome({ onNavigate, entryFromIntro = false, onEntryHandled }) {
  const [phase, setPhase] = useState(() => resolvePhase(entryFromIntro))
  const [crew, setCrew] = useState(() => loadCrewSession())
  const [lockMsg, setLockMsg] = useState('')
  const [engineArm, setEngineArm] = useState(false)
  const [dockLock, setDockLock] = useState(true)
  const [shake, setShake] = useState(false)
  const [idle, setIdle] = useState(false)
  const [solarOpen, setSolarOpen] = useState(false)
  const [clock, setClock] = useState('00:14:32')
  const idleTimer = useRef(null)
  const entryHandled = useRef(false)

  const canDepart = phase === 'standby' && !solarOpen

  const leds = useMemo(() => {
    if (phase === 'transit') {
      return { hab: 'cal', nav: 'cal', com: 'cal', main: 'warn' }
    }
    if (solarOpen) {
      return { hab: 'nom', nav: 'active', com: 'active', main: 'active' }
    }
    return {
      hab: 'active',
      nav: idle ? 'cal' : 'active',
      com: 'active',
      main: engineArm ? 'warn' : 'nom',
    }
  }, [phase, idle, solarOpen, engineArm])

  useEffect(() => {
    if (entryHandled.current) return
    entryHandled.current = true
    onEntryHandled?.()
    if (phase === 'standby') playConsoleBoot(entryFromIntro)
  }, [entryFromIntro, onEntryHandled, phase])

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now() % 86400000
      const h = String(Math.floor(t / 3600000)).padStart(2, '0')
      const m = String(Math.floor((t % 3600000) / 60000)).padStart(2, '0')
      const s = String(Math.floor((t % 60000) / 1000)).padStart(2, '0')
      setClock(`${h}:${m}:${s}`)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const resetIdle = useCallback(() => {
    setIdle(false)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS)
  }, [])

  useEffect(() => {
    resetIdle()
    window.addEventListener('pointermove', resetIdle)
    window.addEventListener('keydown', resetIdle)
    return () => {
      window.removeEventListener('pointermove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      clearTimeout(idleTimer.current)
    }
  }, [resetIdle])

  useEffect(() => {
    document.body.classList.toggle('cursor-solar-explorer', solarOpen)
    document.body.classList.toggle('console-crew-id', phase === 'crew-id')
    return () => {
      document.body.classList.remove('cursor-solar-explorer')
      document.body.classList.remove('console-crew-id')
    }
  }, [solarOpen, phase])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && solarOpen) {
        playBeep('panel')
        setSolarOpen(false)
        setLockMsg('已返回指挥舱')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [solarOpen])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 280)
  }

  const depart = () => {
    if (!canDepart) return
    playDepartLaunch()
    triggerShake()
    setEngineArm(true)
    setLockMsg('跃迁通道开启 · 请勿离开岗位')
    setPhase('transit')
    resetIdle()
  }

  const completeTransit = useCallback(() => {
    playBeep('ready')
    setPhase('standby')
    setLockMsg('跃迁完成 · 欢迎进入太阳系')
    setSolarOpen(true)
  }, [])

  const footerMsg = useMemo(() => {
    if (idle) return '待机 · 长时间无操作'
    if (phase === 'transit') return '虫洞跃迁中 · 正在载入太阳系'
    if (solarOpen) return '太阳系导航 · 点击星球查看档案'
    return '阅读右侧介绍后 · 点击出发'
  }, [idle, phase, solarOpen])

  const hover = () => playBeep('hover')

  const afterBoot = () => {
    playConsoleBoot(false)
    setPhase(loadCrewSession() ? 'standby' : 'crew-id')
  }

  const afterCrew = (c) => {
    setCrew(c)
    setPhase('standby')
    setLockMsg('舰长档案已在右侧屏幕播放')
  }

  const displayName = crew?.name ?? '访客'
  const displayCall = crew?.callsign ?? '未登记'
  const showConsole = phase === 'standby' && !solarOpen

  return (
    <div className={`console console--${phase} ${shake ? 'console--shake' : ''} ${idle ? 'console--idle' : ''}`}>
      {phase === 'boot' && <ConsoleBoot onComplete={afterBoot} />}
      {phase === 'crew-id' && <CrewIdentification onComplete={afterCrew} />}
      {phase === 'transit' && (
        <WormholeTransition
          overlay
          title="虫洞跃迁 · 航向太阳系"
          subtitle="WORMHOLE TRANSIT · ENGAGE"
          onComplete={completeTransit}
        />
      )}
      {solarOpen && (
        <SolarSystemExplorer onClose={() => { playBeep('panel'); setSolarOpen(false); setLockMsg('已返回指挥舱') }} />
      )}

      <div className={`console__bezel ${showConsole ? 'is-visible' : ''}`}>
        <header className="console__header">
          <div className="console__header-left">
            <span className="console__patch">NASA</span>
            <div>
              <h1 className="console__title">ENDURANCE</h1>
              <p className="console__subtitle">指挥舱 · 通讯区</p>
            </div>
          </div>
          <div className="console__header-mid">
            <span className="console__clock-label">任务计时</span>
            <span className="console__clock">T+ {clock}</span>
          </div>
          <div className="console__header-right">
            <ModuleLight label="生活舱" status={leds.hab} />
            <ModuleLight label="导航" status={leds.nav} />
            <ModuleLight label="通讯" status={leds.com} />
            <ModuleLight label="主控" status={leds.main} />
          </div>
        </header>

        <div className="console__deck">
          <section className="console__bay console__bay--ranger">
            <div className="bay-header">
              <span className="bay-header__id">左舱</span>
              <span className="bay-header__title">导航画面</span>
              <span className="bay-header__status bay-header__status--nom">在线</span>
            </div>
            <SolarSystemViewport />
            <div className="console__viewport-footer">
              <span>像素太阳系 · 实时画面</span>
              <span>8 条轨道</span>
            </div>
          </section>

          <section className="console__bay console__bay--cmd">
            <div className="bay-header">
              <span className="bay-header__id">中舱</span>
              <span className="bay-header__title">指令控制台</span>
              <span className="bay-header__status bay-header__status--nom">{canDepart ? '就绪' : '跃迁中'}</span>
            </div>

            <div className="console__mission-select">
              <p className="console__mission-select-title">舰长接待协议</p>
              <p className="console__mission-select-hint">右侧屏幕正在播放自我介绍 · 阅读完毕后点击出发</p>
            </div>

            {lockMsg && <p className="console__lock-msg">{lockMsg}</p>}

            <EnduranceRing
              activeModule={engineArm ? 'ENG' : 'NAV'}
              scanning={phase === 'transit'}
            />

            <div className="console__toggles">
              <ShipToggle label="主引擎就绪" on={engineArm} onClick={() => { playSwitch(engineArm); setEngineArm((v) => !v) }} />
              <ShipToggle label="对接锁定" on={dockLock} onClick={() => { playSwitch(dockLock); setDockLock((v) => !v) }} />
            </div>

            <div className="console__depart-block">
              <PixelPushLever
                size="lg"
                label="出发"
                engageLabel="GO"
                sublabel="虫洞跃迁 · 进入太阳系"
                hint={canDepart ? '向上推杆确认跃迁' : '跃迁进行中…'}
                armed={canDepart}
                disabled={!canDepart}
                onMouseEnter={hover}
                onEngage={depart}
              />
            </div>
          </section>

          <section className="console__bay console__bay--crt">
            <div className="bay-header">
              <span className="bay-header__id">右舱</span>
              <span className="bay-header__title">任务数据屏</span>
              <span className="bay-header__status bay-header__status--nom">舰长档案</span>
            </div>

            <div className="console__gauges">
              <ShipGauge label="O₂" value={shipStatus.oxygen} />
              <ShipGauge label="PWR" value={shipStatus.power} />
              <ShipGauge label="COM" value={shipStatus.comm} />
            </div>

            <div className="console__crt-body">
              {phase === 'standby' && (
                <CrtMissionDisplay
                  moduleId="intro"
                  crew={crew}
                  showActions={false}
                  onReturn={() => {}}
                  onOpenFull={() => { playBeep('click'); onNavigate('crew') }}
                />
              )}
            </div>

            <dl className="console__crew-data">
              <div><dt>姓名</dt><dd>{displayName}</dd></div>
              <div><dt>编号</dt><dd>{displayCall}</dd></div>
              <div><dt>身份</dt><dd>{crew ? '访客' : '站长'}</dd></div>
            </dl>
          </section>
        </div>

        <footer className="console__footer">
          <button type="button" className="console__morse" onMouseEnter={hover} onClick={() => { playBeep('click'); onNavigate('comm') }}>
            联系通道
          </button>
          <span className="console__footer-msg">{footerMsg}</span>
          <span className="console__footer-id">永恒号 / {displayName}</span>
        </footer>
      </div>
    </div>
  )
}
