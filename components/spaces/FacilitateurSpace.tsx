'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'
import ToolCard, { type Tool } from '@/components/spaces/ToolCard'

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
            <div className="panel placeholder-panel">
              <p>
                Prise de connaissance des cas d’usage remontés par les collaborateurs, puis administration :
              </p>
              <ul className="list-clean bullets" style={{ marginTop: 8 }}>
                <li>Déduplication des cas similaires et regroupement par catégorie</li>
                <li>Tags de priorisation : prioritaire / pas prioritaire</li>
                <li>Tags de nature : Quick Win Copilot, Quick Win Mistral, solution custom</li>
                <li>Qualification des Quick Win et saisie des modalités de mise en œuvre</li>
              </ul>
              <div className="soon-note">À construire — alimenté par les soumissions de l’espace utilisateur.</div>
            </div>
          </section>
        )}

        {tab === 'evenements' && (
          <section>
            <div className="section-title">Événements — Organisation</div>
            <div className="tool-grid">
              <ToolCard tool={{ title: 'Café IA', objective: 'Créer un Café IA et disposer d’un kit d’animation clé en main.', prio: 'P0' }} />
              <ToolCard tool={{ title: 'Lunch & Learn', objective: 'Créer un Lunch & Learn et disposer du kit d’animation associé.', prio: 'P0' }} />
              <ToolCard tool={{ title: 'Démo trimestrielle', objective: 'Programmer une démo trimestrielle et son support d’animation.', prio: 'P0' }} />
            </div>
            <div className="panel placeholder-panel" style={{ marginTop: 14 }}>
              <p>
                Les dates créées s’affichent dans le calendrier de l’espace utilisateur. Les formations Polytechnique
                Executive Education (mise à jour techno + posture) y figurent également.
              </p>
            </div>
          </section>
        )}
      </main>
    </RoleGate>
  )
}
