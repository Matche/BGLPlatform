'use client'

import { useState } from 'react'
import type { ProjectsPayload } from '@/types/project'
import type { Cohort } from '@/types/cohort'
import RoleGate from '@/components/role/RoleGate'
import SourceBanner from '@/components/layout/SourceBanner'
import Sidebar from '@/components/layout/Sidebar'
import MacroView from '@/components/views/MacroView'
import ProjectDetail from '@/components/views/ProjectDetail'
import ChatView from '@/components/views/ChatView'
import CohortOverview from '@/components/pilotage/CohortOverview'
import { useAdmin } from '@/components/data/AdminProvider'

export type ViewKey = 'macro' | 'detail' | 'chat'
type Filter = 'all' | 'PROTOTYPE' | 'IDEATION'

const VIEW_TABS: { key: ViewKey; label: string }[] = [
  { key: 'macro', label: 'Vue macro' },
  { key: 'detail', label: 'Vue projet' },
  { key: 'chat', label: 'Chat' },
]

export default function PilotageDashboard({ payload }: { payload: ProjectsPayload }) {
  const { cohorts } = useAdmin()
  const [cohortId, setCohortId] = useState<string | null>(null)
  const [view, setView] = useState<ViewKey>('macro')
  const [curId, setCurId] = useState<string>('')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  // Projets d'une cohorte : live → Notion (payload) ; sinon → projets mock.
  const getProjects = (c: Cohort) => (c.isLive ? payload.projects : c.projects ?? [])

  const cohort = cohorts.find((c) => c.id === cohortId) ?? null
  const projects = cohort ? getProjects(cohort) : []
  const current = projects.find((p) => p.id === curId) ?? projects[0]

  function openCohort(id: string) {
    const c = cohorts.find((x) => x.id === id)
    const projs = c ? getProjects(c) : []
    setCohortId(id)
    setView('macro')
    setCurId(projs[0]?.id ?? '')
    setFilter('all')
    setSearch('')
  }

  function selectProject(id: string) {
    setCurId(id)
    setView('detail')
  }

  // ── Vue d'ensemble des cohortes ──
  if (!cohort) {
    return (
      <RoleGate allow={['admin']}>
        <SourceBanner source={payload.source} lastSync={payload.lastSync} />
        <main className="main">
          <CohortOverview cohorts={cohorts} getProjects={getProjects} onSelect={openCohort} />
        </main>
      </RoleGate>
    )
  }

  // ── Pilotage scopé à une cohorte ──
  const bannerSource = cohort.isLive ? payload.source : 'mock'
  const bannerSync = cohort.isLive ? payload.lastSync : projects[0]?.lastUpdated ?? ''

  return (
    <RoleGate allow={['admin']}>
      <SourceBanner source={bannerSource} lastSync={bannerSync} />

      <div className="cohort-crumb">
        <button className="detail-back" onClick={() => setCohortId(null)}>
          ← Toutes les cohortes
        </button>
        <span className="cohort-crumb-name">{cohort.name}</span>
        <span className={`cohort-status ${cohort.status}`}>{cohort.period}</span>
      </div>

      <div className="app">
        <Sidebar
          projects={projects}
          curId={curId}
          filter={filter}
          search={search}
          onSelect={selectProject}
          onFilter={setFilter}
          onSearch={setSearch}
        />

        <main className="main">
          <div className="detail-tabs" style={{ marginBottom: 16 }}>
            {VIEW_TABS.map((t) => (
              <button
                key={t.key}
                className={`detail-tab ${view === t.key ? 'active' : ''}`}
                onClick={() => setView(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {view === 'macro' && <MacroView projects={projects} onSelect={selectProject} />}
          {view === 'detail' && current && <ProjectDetail project={current} onBack={() => setView('macro')} />}
          {view === 'detail' && !current && <div className="placeholder-panel panel">Aucun projet dans cette cohorte.</div>}
          {view === 'chat' && <ChatView projectCount={projects.length} />}
        </main>
      </div>
    </RoleGate>
  )
}
