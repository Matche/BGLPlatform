'use client'

import { useState } from 'react'
import type { ProjectsPayload } from '@/types/project'
import RoleGate from '@/components/role/RoleGate'
import SourceBanner from '@/components/layout/SourceBanner'
import Sidebar from '@/components/layout/Sidebar'
import MacroView from '@/components/views/MacroView'
import ProjectDetail from '@/components/views/ProjectDetail'
import ChatView from '@/components/views/ChatView'

export type ViewKey = 'macro' | 'detail' | 'chat'
type Filter = 'all' | 'PROTOTYPE' | 'IDEATION'

const VIEW_TABS: { key: ViewKey; label: string }[] = [
  { key: 'macro', label: 'Vue macro' },
  { key: 'detail', label: 'Vue projet' },
  { key: 'chat', label: 'Chat' },
]

export default function PilotageDashboard({ payload }: { payload: ProjectsPayload }) {
  const { projects } = payload
  const [view, setView] = useState<ViewKey>('macro')
  const [curId, setCurId] = useState<string>(projects[0]?.id ?? '')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const current = projects.find((p) => p.id === curId) ?? projects[0]

  function selectProject(id: string) {
    setCurId(id)
    setView('detail')
  }

  return (
    <RoleGate allow={['admin']}>
      <SourceBanner source={payload.source} lastSync={payload.lastSync} />

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
          {view === 'chat' && <ChatView projectCount={projects.length} />}
        </main>
      </div>
    </RoleGate>
  )
}
