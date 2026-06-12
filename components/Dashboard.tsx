'use client'

import { useState } from 'react'
import type { ProjectsPayload } from '@/types/project'
import TopHeader from '@/components/layout/TopHeader'
import SourceBanner from '@/components/layout/SourceBanner'
import Sidebar from '@/components/layout/Sidebar'
import MacroView from '@/components/views/MacroView'
import ProjectDetail from '@/components/views/ProjectDetail'
import ChatView from '@/components/views/ChatView'

export type ViewKey = 'macro' | 'detail' | 'chat'
type Filter = 'all' | 'PROTOTYPE' | 'IDEATION'

const REPORT_TAG = '2026-06'

export default function Dashboard({ payload }: { payload: ProjectsPayload }) {
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
    <>
      <TopHeader view={view} onView={setView} reportTag={REPORT_TAG} />
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
          {view === 'macro' && <MacroView projects={projects} onSelect={selectProject} />}
          {view === 'detail' && current && (
            <ProjectDetail project={current} onBack={() => setView('macro')} />
          )}
          {view === 'chat' && <ChatView projectCount={projects.length} />}
        </main>
      </div>

      <div className="footer">
        Reporting Coaching INSKIP — AI Facilitator Programme BGL BNP · Mis à jour mensuellement à partir des sessions de
        coaching et des transcripts Notion.
      </div>
    </>
  )
}
