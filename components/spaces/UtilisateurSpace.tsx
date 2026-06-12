'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'

type Tab = 'accueil' | 'cas-usage' | 'evenements'

const TABS: { key: Tab; label: string }[] = [
  { key: 'accueil', label: 'Accueil' },
  { key: 'cas-usage', label: 'Cas d’usage' },
  { key: 'evenements', label: 'Événements' },
]

export default function UtilisateurSpace() {
  const [tab, setTab] = useState<Tab>('accueil')

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
            </button>
          ))}
        </div>

        {tab === 'accueil' && (
          <div className="action-grid">
            <button className="action-card" onClick={() => setTab('cas-usage')}>
              <div className="action-card-icon">?</div>
              <h3>Poser une question</h3>
              <p>Une interrogation sur l’IA, un outil, un usage ? Posez-la, un facilitateur vous répond.</p>
              <span className="soon-badge">À venir</span>
            </button>
            <button className="action-card" onClick={() => setTab('cas-usage')}>
              <div className="action-card-icon">+</div>
              <h3>Proposer un cas d’usage</h3>
              <p>Décrivez un besoin métier qui pourrait être adressé par l’IA. La communauté vote pour le soutenir.</p>
              <span className="soon-badge">À venir</span>
            </button>
          </div>
        )}

        {tab === 'cas-usage' && (
          <section>
            <div className="section-title">Cas d’usage soumis</div>
            <div className="panel placeholder-panel">
              <p>
                Les cas d’usage proposés par les collaborateurs, classés par nombre de votes, avec un système de
                <strong> +1 façon Reddit</strong> pour soutenir une idée.
              </p>
              <div className="soon-note">À construire — soumission, vote +1 et classement.</div>
            </div>
          </section>
        )}

        {tab === 'evenements' && (
          <section>
            <div className="section-title">Calendrier des événements</div>
            <div className="panel placeholder-panel">
              <p>Prochaines dates : Café IA, Lunch &amp; Learn, démos trimestrielles, et formations Polytechnique Executive Education.</p>
              <div className="soon-note">À construire — calendrier des prochaines dates.</div>
            </div>
          </section>
        )}
      </main>
    </RoleGate>
  )
}
