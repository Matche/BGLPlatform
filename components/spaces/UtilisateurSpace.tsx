'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'
import Modal from '@/components/ui/Modal'
import UseCaseList from '@/components/community/UseCaseList'
import EventCalendar from '@/components/community/EventCalendar'
import ProposeUseCaseForm from '@/components/community/ProposeUseCaseForm'
import Directory from '@/components/community/Directory'
import FaqChat from '@/components/community/FaqChat'
import { useData } from '@/components/data/DataProvider'
import { avgPct } from '@/lib/utils'
import { FORMAT_COLOR } from '@/lib/taxonomy'

type Tab = 'accueil' | 'cas-usage' | 'evenements' | 'annuaire' | 'assistant'

const TABS: { key: Tab; label: string }[] = [
  { key: 'accueil', label: 'Accueil' },
  { key: 'cas-usage', label: 'Cas d’usage' },
  { key: 'evenements', label: 'Événements' },
  { key: 'annuaire', label: 'Annuaire' },
  { key: 'assistant', label: 'Assistant' },
]

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return {
    day: d.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
    full: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }),
  }
}

export default function UtilisateurSpace() {
  const [tab, setTab] = useState<Tab>('accueil')
  const [proposing, setProposing] = useState(false)
  const { useCases, events } = useData()

  const nextEvents = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const topUseCases = [...useCases].sort((a, b) => b.votes - a.votes).slice(0, 3)

  return (
    <RoleGate allow={['admin', 'utilisateur']}>
      <main className="main space-main">
        <div className="space-header">
          <h1>Espace utilisateur</h1>
          <p>Faites remonter vos besoins IA, soutenez les idées de la communauté et suivez le programme.</p>
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
          <div className="dash">
            {/* Accès rapides */}
            <div className="dash-actions">
              <button className="dash-action" onClick={() => setProposing(true)}>
                <span className="dash-action-icon" style={{ background: 'var(--green)' }}>+</span>
                <div>
                  <h3>Proposer un cas d’usage</h3>
                  <p>Faites remonter un besoin métier. La communauté vote pour le soutenir.</p>
                </div>
              </button>
              <button className="dash-action" onClick={() => setTab('annuaire')}>
                <span className="dash-action-icon" style={{ background: 'var(--slate)' }}>☰</span>
                <div>
                  <h3>Annuaire IA</h3>
                  <p>Facilitateurs IA, référents AI Act et DPO à solliciter selon votre sujet.</p>
                </div>
              </button>
              <button className="dash-action" onClick={() => setTab('assistant')}>
                <span className="dash-action-icon" style={{ background: 'var(--magenta)' }}>?</span>
                <div>
                  <h3>Assistant FAQ</h3>
                  <p>Vos questions fréquentes sur l’IA, la conformité et le programme, en chat.</p>
                </div>
              </button>
            </div>

            <div className="dash-cols">
              {/* Prochains événements */}
              <div className="dash-panel">
                <div className="dash-panel-head">
                  <h3>Prochains événements</h3>
                  <button className="dash-link" onClick={() => setTab('evenements')}>
                    Voir le calendrier →
                  </button>
                </div>
                <div className="dash-events">
                  {nextEvents.map((ev) => {
                    const d = fmtDate(ev.date)
                    return (
                      <div className="dash-event" key={ev.id}>
                        <div className="dash-event-date" style={{ borderColor: FORMAT_COLOR[ev.format] }}>
                          <span className="dash-event-day">{d.day}</span>
                          <span className="dash-event-month">{d.month}</span>
                        </div>
                        <div className="dash-event-body">
                          <span className="event-format" style={{ background: FORMAT_COLOR[ev.format] }}>
                            {ev.format}
                          </span>
                          <div className="dash-event-title">{ev.title}</div>
                          <div className="dash-event-meta">
                            {d.full} · {ev.time} · {ev.location}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cas d'usage les plus soutenus */}
              <div className="dash-panel">
                <div className="dash-panel-head">
                  <h3>Cas d’usage les plus soutenus</h3>
                  <button className="dash-link" onClick={() => setTab('cas-usage')}>
                    Voir tous →
                  </button>
                </div>
                <div className="dash-uc">
                  {topUseCases.map((uc, i) => (
                    <div className="dash-uc-row" key={uc.id}>
                      <span className="dash-uc-rank">#{i + 1}</span>
                      <span className="dash-uc-votes">▲ {uc.votes}</span>
                      <div className="dash-uc-main">
                        <div className="dash-uc-title">{uc.title}</div>
                        <div className="dash-uc-tags">
                          <span className="uc-tag bu">{uc.businessUnit}</span>
                          <span className="uc-tag dom">{uc.domaine}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'cas-usage' && (
          <section>
            <div className="section-bar">
              <div className="section-title" style={{ margin: 0 }}>
                Cas d’usage soumis — classés par votes
              </div>
              <button className="btn-primary sm" onClick={() => setProposing(true)}>
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

        {tab === 'annuaire' && (
          <section>
            <div className="section-title">Annuaire IA</div>
            <Directory />
          </section>
        )}

        {tab === 'assistant' && (
          <section>
            <div className="section-title">Assistant FAQ</div>
            <FaqChat />
          </section>
        )}
      </main>

      {proposing && (
        <Modal title="Proposer un cas d’usage" onClose={() => setProposing(false)}>
          <ProposeUseCaseForm onDone={() => setProposing(false)} />
        </Modal>
      )}
    </RoleGate>
  )
}
