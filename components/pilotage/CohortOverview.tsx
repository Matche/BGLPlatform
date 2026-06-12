'use client'

import type { Cohort, CohortStatus } from '@/types/cohort'
import type { Project } from '@/types/project'
import { avgPct } from '@/lib/utils'

const STATUS_LABEL: Record<CohortStatus, string> = {
  active: 'En cours',
  closed: 'Clôturée',
  upcoming: 'À venir',
}

export default function CohortOverview({
  cohorts,
  getProjects,
  onSelect,
}: {
  cohorts: Cohort[]
  getProjects: (c: Cohort) => Project[]
  onSelect: (id: string) => void
}) {
  const allProjects = cohorts.flatMap(getProjects)
  const totalProjects = allProjects.length
  const globalAvg = totalProjects ? Math.round(allProjects.reduce((s, p) => s + avgPct(p), 0) / totalProjects) : 0

  return (
    <section className="view-section active">
      <div className="macro-header">
        <h1>Vue d&apos;ensemble — Cohortes</h1>
        <p>Pilotage de toutes les promotions du programme AI Facilitator · cliquez une cohorte pour le détail.</p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Cohortes</div>
          <div className="kpi-value">{cohorts.length}</div>
          <div className="kpi-sub">promotions suivies</div>
        </div>
        <div className="kpi-card cyan-dark">
          <div className="kpi-label">Projets cumulés</div>
          <div className="kpi-value">{totalProjects}</div>
          <div className="kpi-sub">toutes cohortes</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">Cohortes actives</div>
          <div className="kpi-value">{cohorts.filter((c) => c.status === 'active').length}</div>
          <div className="kpi-sub">en cours</div>
        </div>
        <div className="kpi-card magenta">
          <div className="kpi-label">Avancement moyen</div>
          <div className="kpi-value">{globalAvg}%</div>
          <div className="kpi-sub">global, toutes cohortes</div>
        </div>
      </div>

      <div className="cohort-grid">
        {cohorts.map((c) => {
          const projects = getProjects(c)
          const avg = projects.length ? Math.round(projects.reduce((s, p) => s + avgPct(p), 0) / projects.length) : 0
          return (
            <button className={`cohort-card ${c.status}`} key={c.id} onClick={() => onSelect(c.id)}>
              <div className="cohort-card-head">
                <h3>{c.name}</h3>
                <span className={`cohort-status ${c.status}`}>{STATUS_LABEL[c.status]}</span>
              </div>
              <div className="cohort-card-period">
                {c.period}
                {c.isLive && <span className="cohort-live">● live Notion</span>}
              </div>
              <p className="cohort-card-desc">{c.description}</p>
              <div className="cohort-card-stats">
                <div>
                  <span className="cohort-stat-val">{projects.length}</span>
                  <span className="cohort-stat-lbl">projets</span>
                </div>
                <div>
                  <span className="cohort-stat-val">{avg}%</span>
                  <span className="cohort-stat-lbl">avancement moyen</span>
                </div>
              </div>
              <div className="pm-track">
                <div className="pm-fill" style={{ width: `${avg}%` }} />
              </div>
              <span className="cohort-card-open">Ouvrir le pilotage →</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
