import { getPlanetSurfaceLayout } from '../../data/planetSurfaceLayouts'
import EarthProjectTrees from './EarthProjectTrees'
import JupiterCampusOrbit from './JupiterCampusOrbit'
import MarsProjector from './MarsProjector'
import MercuryResume from './MercuryResume'
import NeptuneBookshelf from './NeptuneBookshelf'
import SaturnScholarship from './SaturnScholarship'
import UranusInternshipDrift from './UranusInternshipDrift'
import './PlanetDataPanels.css'

const CUSTOM_ARCHIVES = new Set([
  'trees',
  'projector',
  'bookshelf',
  'resume',
  'campus-orbit',
  'scholarship',
  'internship-drift',
])

export function PlanetFactsPanel({ planetId, facts, className = '' }) {
  const layout = getPlanetSurfaceLayout(planetId).facts

  return (
    <section className={`pdp-facts pdp-facts--${layout} ${className}`.trim()} aria-label="环境特征">
      <h2 className="pdp-facts__title">环境特征</h2>
      {layout === 'telemetry' && (
        <div className="pdp-facts__telemetry">
          {facts.map(({ key, value }, i) => (
            <div key={key} className="pdp-facts__telemetry-row" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="pdp-facts__telemetry-key">{key.toUpperCase()}</span>
              <span className="pdp-facts__telemetry-val">{value}</span>
            </div>
          ))}
        </div>
      )}
      {layout === 'orbit-grid' && (
        <div className="pdp-facts__grid">
          {facts.map(({ key, value }) => (
            <div key={key} className="pdp-facts__grid-cell">
              <span className="pdp-facts__grid-key">{key}</span>
              <p className="pdp-facts__grid-val">{value}</p>
            </div>
          ))}
        </div>
      )}
      {layout === 'rover-log' && (
        <ol className="pdp-facts__rover">
          {facts.map(({ key, value }, i) => (
            <li key={key} className="pdp-facts__rover-entry">
              <span className="pdp-facts__rover-id">LOG-{String(i + 1).padStart(2, '0')}</span>
              <strong>{key}</strong>
              <p>{value}</p>
            </li>
          ))}
        </ol>
      )}
      {layout === 'bands' && (
        <div className="pdp-facts__bands">
          {facts.map(({ key, value }, i) => (
            <div key={key} className="pdp-facts__band" data-band={i}>
              <span className="pdp-facts__band-key">{key}</span>
              <p className="pdp-facts__band-val">{value}</p>
            </div>
          ))}
        </div>
      )}
      {layout === 'ring-segments' && (
        <div className="pdp-facts__rings">
          {facts.map(({ key, value }, i) => (
            <div key={key} className="pdp-facts__ring-seg" data-seg={i}>
              <span className="pdp-facts__ring-key">{key}</span>
              <p>{value}</p>
            </div>
          ))}
        </div>
      )}
      {layout === 'tilt-panel' && (
        <dl className="pdp-facts__tilt">
          {facts.map(({ key, value }) => (
            <div key={key} className="pdp-facts__tilt-row">
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {layout === 'data-stream' && (
        <ul className="pdp-facts__stream">
          {facts.map(({ key, value }) => (
            <li key={key} className="pdp-facts__stream-item">
              <span className="pdp-facts__stream-bar" aria-hidden="true" />
              <div>
                <strong>{key}</strong>
                <p>{value}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {layout === 'flare' && (
        <div className="pdp-facts__flare">
          {facts.map(({ key, value }) => (
            <div key={key} className="pdp-facts__flare-tag">
              <span>{key}</span>
              <p>{value}</p>
            </div>
          ))}
        </div>
      )}
      {layout === 'corrupted' && (
        <dl className="pdp-facts__corrupt">
          {facts.map(({ key, value }) => (
            <div key={key} className="pdp-facts__corrupt-row">
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {(layout === 'default' || !layout) && (
        <dl className="pdp-facts__default">
          {facts.map(({ key, value }) => (
            <div key={key} className="pdp-facts__default-row">
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export function PlanetArchivePanel({ planetId, archive, className = '' }) {
  const layout = getPlanetSurfaceLayout(planetId).archive
  if (!layout || !archive || CUSTOM_ARCHIVES.has(layout)) return null

  return (
    <section className={`pdp-archive pdp-archive--${layout} ${className}`.trim()} aria-label={`舰长档案 · ${archive.name}`}>
      <h2 className="pdp-archive__title">舰长档案 · {archive.name}</h2>
      {layout === 'default' && (
        <ul className="pdp-archive__default">
          {archive.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function PlanetSurfaceData({ planetId, facts, archive, showFacts }) {
  const { archive: archiveLayout } = getPlanetSurfaceLayout(planetId)
  const surfaceMod = `pdp-surface--${planetId}`

  return (
    <div className={`pdp-surface ${surfaceMod} ${showFacts ? 'pdp-surface--facts-open' : ''}`.trim()}>
      {showFacts && (
        <PlanetFactsPanel planetId={planetId} facts={facts} className="pdp-surface__facts" />
      )}
      {archiveLayout === 'trees' && <EarthProjectTrees className="pdp-surface__archive" />}
      {archiveLayout === 'projector' && <MarsProjector className="pdp-surface__archive" />}
      {archiveLayout === 'bookshelf' && <NeptuneBookshelf className="pdp-surface__archive" />}
      {archiveLayout === 'resume' && <MercuryResume className="pdp-surface__archive" />}
      {archiveLayout === 'campus-orbit' && <JupiterCampusOrbit className="pdp-surface__archive" />}
      {archiveLayout === 'scholarship' && <SaturnScholarship className="pdp-surface__archive" />}
      {archiveLayout === 'internship-drift' && <UranusInternshipDrift className="pdp-surface__archive" />}
      {archiveLayout && !CUSTOM_ARCHIVES.has(archiveLayout) && (
        <PlanetArchivePanel planetId={planetId} archive={archive} className="pdp-surface__archive" />
      )}
    </div>
  )
}
