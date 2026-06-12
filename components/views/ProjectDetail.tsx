'use client'

import { useState } from 'react'
import type { Project } from '@/types/project'
import { AX_KEYS, AX_LABELS, AX_SUB, axisClass, getInitials } from '@/lib/utils'

function dpoColor(dpo: string): string {
  if (dpo === 'Validé') return '#A5F3A5'
  if (dpo === 'BLOQUANT') return '#FFAAAA'
  return '#FFE082'
}

/** Lien vers la page Notion (masqué pour les données de démo). */
function notionUrl(pageId: string): string | null {
  if (!pageId || pageId.startsWith('mock-')) return null
  return `https://www.notion.so/${pageId.replace(/-/g, '')}`
}

export default function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [tab, setTab] = useState<'current' | 'notes'>('current')
  const p = project
  const nUrl = notionUrl(p.notionPageId)

  return (
    <section className="view-section active">
      <button className="detail-back" onClick={onBack}>
        ← Retour à la vue macro
      </button>

      <div className="detail-tabs">
        <button className={`detail-tab ${tab === 'current' ? 'active' : ''}`} onClick={() => setTab('current')}>
          Vue actuelle
        </button>
        <button className={`detail-tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>
          Notes coach
        </button>
      </div>

      {tab === 'current' ? (
        <div className="detail-view">
          {/* ── Panneau gauche cyan ── */}
          <div className="left-panel">
            {p.nextSession && <div className="left-board">{p.nextSession}</div>}
            <div className="project-name">{p.name}</div>

            <div className="vp-box">
              <h4>Proposition de valeur</h4>
              <div className="vp-text">{p.vp}</div>
            </div>

            <div className="conf-section">
              <h4>Conformité &amp; Risques</h4>
              {p.conformite.notes.map((n, i) => (
                <div className="conf-item" key={i}>
                  {n}
                </div>
              ))}
              <div className="conf-pills">
                <span className="conf-pill">
                  DPO : <span style={{ color: dpoColor(p.conformite.dpo) }}>{p.conformite.dpo}</span>
                </span>
                <span className="conf-pill">Risque : {p.conformite.risk}</span>
                <span className="conf-pill">Perso : {p.conformite.perso ? 'Oui' : 'Non'}</span>
              </div>
            </div>

            <div className="team-section">
              <div className="team-label">TEAM</div>
              <div className="team-list">
                {p.team.map((m, i) => (
                  <div className="team-member" key={i}>
                    <div className="team-avatar">{getInitials(m.name)}</div>
                    <div>
                      <div className="team-name">{m.name}</div>
                      <div className="team-role">{m.role}</div>
                      <div className="team-org">{m.org}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="stakeholders">
                <div className="stk-title">Stakeholders</div>
                <div className="stk-grid">
                  {p.stakeholders.map((s, i) => (
                    <div className="stk-item" key={i}>
                      <strong>{s.name}</strong>
                      {s.role} · {s.org}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Panneau droit ── */}
          <div className="right-panel">
            <div className="right-header">
              <div className="right-header-left">
                <span className="right-header-tag">{p.id.toUpperCase()}</span>
                <span className={`right-header-status ${p.status === 'IDEATION' ? 'idea' : ''}`}>{p.status}</span>
              </div>
              {nUrl && (
                <a className="notion-link" href={nUrl} target="_blank" rel="noopener noreferrer">
                  Ouvrir dans Notion ↗
                </a>
              )}
            </div>

            <div className="right-body">
              <div style={{ marginBottom: 16 }}>
                <div className="section-title">Axes d&apos;évaluation</div>
                <div className="axes-row">
                  {AX_KEYS.map((k, i) => {
                    const v = p[k] as number
                    return (
                      <div className={`axis-cell ${axisClass(v)}`} key={k}>
                        <div className="ax-lbl">{AX_LABELS[i]}</div>
                        <div className="ax-val">{v}/3</div>
                        <div className="ax-sub">{AX_SUB[v] || '—'}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="objectives">
                <div className="section-title">Objectifs en cours</div>
                {p.objectives.map((o, i) => (
                  <div className="objective" key={i}>
                    <div>
                      <div className="obj-cat">{o.cat}</div>
                      <div className="obj-desc">{o.desc}</div>
                    </div>
                    <div className="obj-bar">
                      <div className="obj-bar-track">
                        <div className="obj-bar-marker" style={{ left: `${o.pct}%` }} />
                      </div>
                    </div>
                    <div className="obj-pct">{o.pct}%</div>
                  </div>
                ))}
              </div>

              <div className="two-col">
                <div>
                  <div className="section-title" style={{ fontSize: 13, marginBottom: 8 }}>
                    Achievements
                  </div>
                  <ul className="list-clean bullets">
                    {p.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="section-title" style={{ fontSize: 13, marginBottom: 8 }}>
                    Utilisateurs internes cibles
                  </div>
                  <ul className="list-clean targets">
                    {p.utilisateurs.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="warning-box">
                <div className="section-title" style={{ fontSize: 13, marginBottom: 8 }}>
                  Warnings
                </div>
                <ul className="list-clean warnings">
                  {p.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="next-steps-box">
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', marginBottom: 7 }}>
                  Prochaines étapes
                </div>
                <ul className="next-steps-list">
                  {p.nextSteps.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', boxShadow: 'var(--sh-md)', padding: '20px 22px' }}>
          <div className="section-title" style={{ marginBottom: 12 }}>
            Notes meta coach
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--grey-700)',
              lineHeight: 1.6,
              background: 'var(--grey-50)',
              padding: '13px 15px',
              borderRadius: 'var(--r-sm)',
              borderLeft: '4px solid var(--cyan)',
            }}
          >
            {p.notesMeta}
          </div>
        </div>
      )}
    </section>
  )
}
