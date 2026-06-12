'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'
import ToolCard, { type Tool } from '@/components/spaces/ToolCard'
import Modal from '@/components/ui/Modal'
import UseCaseList from '@/components/community/UseCaseList'
import EventCalendar from '@/components/community/EventCalendar'
import CreateEventForm from '@/components/community/CreateEventForm'
import { useData } from '@/components/data/DataProvider'

type Tab = 'outils' | 'cas-usage' | 'evenements'

const TABS: { key: Tab; label: string }[] = [
  { key: 'outils', label: 'Boîte à outils' },
  { key: 'cas-usage', label: 'Cas d’usage' },
  { key: 'evenements', label: 'Événements' },
]

// PRD §6.1
const OUTILS_PORTEUR: Tool[] = [
  {
    title: 'Kit d’onboarding POC',
    objective: 'Réussir ses POC et embarquer progressivement les premiers utilisateurs : trame de cadrage, sélection des users, supports de com, jalons de suivi.',
    prio: 'P0',
  },
  {
    title: 'Kit de recueil de feedback',
    objective: 'Tracer les retours utilisateurs : signalement simple, formulaire structuré, tableau de suivi des retours et incohérences.',
    prio: 'P0',
  },
  {
    title: 'Outil de qualification conformité AI Act',
    objective: 'Qualifier rapidement un projet au regard de l’AI Act, indiquer le type d’accompagnement requis et poser des warnings.',
    prio: 'P0',
  },
  {
    title: 'Bibliothèque de canevas',
    objective: 'Canevas réutilisables calés sur les livrables du programme, pour ne pas repartir d’une page blanche.',
    prio: 'P1',
  },
  {
    title: 'Parcours par jalons (stage gate)',
    objective: 'Matérialiser les passages de cap de l’idée à la présentation sponsor : checklist courte et pièces attendues par jalon. Peut alimenter la vue micro du pilotage.',
    prio: 'P1',
  },
]

// PRD §6.2
const OUTILS_AMBASSADEUR: Tool[] = [
  {
    title: 'Annuaire conformité',
    objective: 'Identifier le DPO et les référents règlement IA, et les bons points de contact à solliciter selon le sujet.',
    prio: 'P0',
  },
  {
    title: 'Kit ambassadeur clé en main',
    objective: 'Trames d’animation et supports de partage à destination des collègues.',
    prio: 'à statuer',
  },
]

export default function FacilitateurSpace() {
  const [tab, setTab] = useState<Tab>('outils')
  const [creating, setCreating] = useState(false)
  const { useCases, events } = useData()

  return (
    <RoleGate allow={['admin', 'facilitateur']}>
      <main className="main space-main">
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
                {OUTILS_PORTEUR.map((t) => (
                  <ToolCard key={t.title} tool={t} />
                ))}
              </div>
            </section>
            <section>
              <div className="section-title">Boîte à outils — Ambassadeur</div>
              <div className="tool-grid">
                {OUTILS_AMBASSADEUR.map((t) => (
                  <ToolCard key={t.title} tool={t} />
                ))}
              </div>
            </section>
          </>
        )}

        {tab === 'cas-usage' && (
          <section>
            <div className="section-title">Cas d’usage — Face facilitateur</div>
            <p className="section-intro">
              Prenez connaissance des cas remontés, posez les tags de priorisation et de nature, et qualifiez les Quick
              Win. Les votes reflètent le soutien de la communauté.
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
              Créez un Café IA, un Lunch &amp; Learn ou une démo trimestrielle. Les dates s’affichent dans le calendrier
              de l’espace utilisateur.
            </p>
            <EventCalendar />
          </section>
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
