'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'
import Modal from '@/components/ui/Modal'
import UseCaseList from '@/components/community/UseCaseList'
import EventCalendar from '@/components/community/EventCalendar'
import ProposeUseCaseForm from '@/components/community/ProposeUseCaseForm'
import AskQuestionForm from '@/components/community/AskQuestionForm'
import { useData } from '@/components/data/DataProvider'

type Tab = 'accueil' | 'cas-usage' | 'evenements'
type ModalKind = null | 'propose' | 'question'

const TABS: { key: Tab; label: string }[] = [
  { key: 'accueil', label: 'Accueil' },
  { key: 'cas-usage', label: 'Cas d’usage' },
  { key: 'evenements', label: 'Événements' },
]

export default function UtilisateurSpace() {
  const [tab, setTab] = useState<Tab>('accueil')
  const [modal, setModal] = useState<ModalKind>(null)
  const { useCases, events } = useData()

  return (
    <RoleGate allow={['admin', 'utilisateur']}>
      <main className="main space-main">
        <div className="space-header">
          <h1>Espace utilisateur</h1>
          <p>Faites remonter vos besoins IA, soutenez les idées de la communauté et suivez les événements.</p>
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

        {tab === 'accueil' && (
          <div className="action-grid">
            <button className="action-card" onClick={() => setModal('question')}>
              <div className="action-card-icon">?</div>
              <h3>Poser une question</h3>
              <p>Une interrogation sur l’IA, un outil, un usage ? Posez-la, un facilitateur vous répond.</p>
            </button>
            <button className="action-card" onClick={() => setModal('propose')}>
              <div className="action-card-icon">+</div>
              <h3>Proposer un cas d’usage</h3>
              <p>Décrivez un besoin métier qui pourrait être adressé par l’IA. La communauté vote pour le soutenir.</p>
            </button>
          </div>
        )}

        {tab === 'cas-usage' && (
          <section>
            <div className="section-bar">
              <div className="section-title" style={{ margin: 0 }}>
                Cas d’usage soumis — classés par votes
              </div>
              <button className="btn-primary sm" onClick={() => setModal('propose')}>
                + Proposer un cas d’usage
              </button>
            </div>
            <UseCaseList mode="vote" />
          </section>
        )}

        {tab === 'evenements' && (
          <section>
            <div className="section-title">Calendrier des événements</div>
            <EventCalendar />
          </section>
        )}
      </main>

      {modal === 'propose' && (
        <Modal title="Proposer un cas d’usage" onClose={() => setModal(null)}>
          <ProposeUseCaseForm onDone={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'question' && (
        <Modal title="Poser une question" onClose={() => setModal(null)}>
          <AskQuestionForm onDone={() => setModal(null)} />
        </Modal>
      )}
    </RoleGate>
  )
}
