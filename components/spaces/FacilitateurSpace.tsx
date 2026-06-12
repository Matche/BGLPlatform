'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'
import ToolCard from '@/components/spaces/ToolCard'
import ToolHost from '@/components/tools/ToolHost'
import Modal from '@/components/ui/Modal'
import UseCaseList from '@/components/community/UseCaseList'
import EventCalendar from '@/components/community/EventCalendar'
import CreateEventForm from '@/components/community/CreateEventForm'
import { useData } from '@/components/data/DataProvider'
import { TOOL_REGISTRY } from '@/lib/tools/registry'

type Tab = 'outils' | 'cas-usage' | 'evenements'

const TABS: { key: Tab; label: string }[] = [
  { key: 'outils', label: 'Boîte à outils' },
  { key: 'cas-usage', label: 'Cas d’usage' },
  { key: 'evenements', label: 'Événements' },
]

const PORTEUR = TOOL_REGISTRY.filter((t) => t.group === 'porteur')
const AMBASSADEUR = TOOL_REGISTRY.filter((t) => t.group === 'ambassadeur')

export default function FacilitateurSpace() {
  const [tab, setTab] = useState<Tab>('outils')
  const [openTool, setOpenTool] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const { useCases, events } = useData()

  return (
    <RoleGate allow={['admin', 'facilitateur']}>
      <main className="main space-main">
        {openTool ? (
          <ToolHost slug={openTool} onBack={() => setOpenTool(null)} />
        ) : (
          <>
            <div className="space-header">
              <h1>Espace Facilitateur IA</h1>
              <p>Boîte à outils porteur de projet et ambassadeur · conduite de POC, conformité, animation.</p>
            </div>

            <div className="detail-tabs" style={{ marginBottom: 18 }}>
              {TABS.map((t) => (
                <button key={t.key} className={`detail-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                  {t.label}
                  {t.key === 'cas-usage' && <span className="tab-count">{useCases.length}</span>}
                  {t.key === 'evenements' && <span className="tab-count">{events.length}</span>}
                </button>
              ))}
            </div>

            {tab === 'outils' && (
              <>
                <section style={{ marginBottom: 22 }}>
                  <div className="section-title">Boîte à outils — Porteur de projet</div>
                  <div className="tool-grid">
                    {PORTEUR.map((t) => (
                      <ToolCard key={t.slug} tool={t} onOpen={() => setOpenTool(t.slug)} />
                    ))}
                  </div>
                </section>
                <section>
                  <div className="section-title">Boîte à outils — Ambassadeur</div>
                  <div className="tool-grid">
                    {AMBASSADEUR.map((t) => (
                      <ToolCard key={t.slug} tool={t} onOpen={() => setOpenTool(t.slug)} />
                    ))}
                  </div>
                </section>
              </>
            )}

            {tab === 'cas-usage' && (
              <section>
                <div className="section-title">Cas d’usage — Face facilitateur</div>
                <p className="section-intro">
                  Prenez connaissance des cas remontés, posez les tags de priorisation et de nature, et qualifiez les
                  Quick Win. Les votes reflètent le soutien de la communauté.
                </p>
                <UseCaseList mode="admin" />
              </section>
            )}

            {tab === 'evenements' && (
              <section>
                <div className="section-bar">
                  <div className="section-title" style={{ margin: 0 }}>
                    Événements — Organisation
                  </div>
                  <button className="btn-primary sm" onClick={() => setCreating(true)}>
                    + Créer un événement
                  </button>
                </div>
                <p className="section-intro">
                  Créez un Café IA, un Lunch &amp; Learn ou une démo trimestrielle. Les dates s’affichent dans le
                  calendrier de l’espace utilisateur.
                </p>
                <EventCalendar />
              </section>
            )}
          </>
        )}
      </main>

      {creating && (
        <Modal title="Créer un événement" onClose={() => setCreating(false)}>
          <CreateEventForm onDone={() => setCreating(false)} />
        </Modal>
      )}
    </RoleGate>
  )
}
