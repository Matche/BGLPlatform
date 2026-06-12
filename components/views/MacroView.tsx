'use client'

import type { Project } from '@/types/project'
import { avgPct } from '@/lib/utils'
import ProgressChart from '@/components/charts/ProgressChart'
import AxesChart from '@/components/charts/AxesChart'

export default function MacroView({
  projects,
  onSelect,
}: {
  projects: Project[]
  onSelect: (id: string) => void
}) {
  const total = projects.length
  const nbProto = projects.filter((p) => p.status === 'PROTOTYPE').length
  const nbSansSponsor = projects.filter((p) => p.gouv === 0).length
  const avgGlobal = total ? Math.round(projects.reduce((s, p) => s + avgPct(p), 0) / total) : 0

  return (
    <section className="view-section active">
      <div className="macro-header">
        <div>
          <h1>Vue d&apos;ensemble — Programme BGL BNP</h1>
          <p>Synthèse des projets IA internes coachés par INSKIP · Juin 2026</p>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Projets actifs</div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-sub">dans la promotion 2026</div>
        </div>
        <div className="kpi-card magenta">
          <div className="kpi-label">En prototype</div>
          <div className="kpi-value">{nbProto}</div>
          <div className="kpi-sub">phase d&apos;expérimentation</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">Sans sponsor</div>
          <div className="kpi-value">{nbSansSponsor}</div>
          <div className="kpi-sub">gouvernance à sécuriser</div>
        </div>
        <div className="kpi-card cyan-dark">
          <div className="kpi-label">Avancement moyen</div>
          <div className="kpi-value">{avgGlobal}%</div>
          <div className="kpi-sub">sur l&apos;ensemble des objectifs</div>
        </div>
      </div>

      <div className="section-grid">
        <div className="panel">
          <h3 className="panel-title">Avancement par projet</h3>
          <div className="chart-wrap">
            <ProgressChart projects={projects} />
          </div>
        </div>
        <div className="panel">
          <h3 className="panel-title magenta">Score moyen par axe</h3>
          <div className="chart-wrap-sm">
            <AxesChart projects={projects} />
          </div>
          <div style={{ marginTop: 11, fontSize: 11, color: 'var(--grey-700)', textAlign: 'center' }}>
            Tests utilisateurs et gouvernance sont les axes les plus fragiles du programme.
          </div>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">Projets — détail rapide</h3>
        <div className="project-grid">
          {projects.map((p) => (
            <div key={p.id} className="proj-card" onClick={() => onSelect(p.id)}>
              <div className="proj-card-head">
                <h3>{p.name}</h3>
                <span className={`proj-card-status ${p.status === 'IDEATION' ? 'idea' : ''}`}>
                  {p.status === 'PROTOTYPE' ? 'PROTOTYPE' : 'IDÉATION'}
                </span>
              </div>
              <div className="proj-card-body">
                <div className="proj-card-vp">{p.vp}</div>
                <div className="proj-card-meta">
                  <span>{p.team.length} membres</span>
                  <span>Conf. {p.confidence}</span>
                </div>
                <div className="proj-card-progress">
                  <div className="pm-label">
                    <span>Avancement</span>
                    <strong>{avgPct(p)}%</strong>
                  </div>
                  <div className="pm-track">
                    <div className="pm-fill" style={{ width: `${avgPct(p)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
