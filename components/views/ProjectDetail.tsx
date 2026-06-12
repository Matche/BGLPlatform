'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/types/project'
import { AX_KEYS, AX_LABELS, AX_SUB, axisClass, getInitials } from '@/lib/utils'
import { useRole } from '@/components/role/RoleProvider'

function dpoColor(dpo: string): string {
  if (dpo === 'Validé') return '#A5F3A5'
  if (dpo === 'BLOQUANT') return '#FFAAAA'
  return '#FFE082'
}

function notionUrl(pageId: string): string | null {
  if (!pageId || pageId.startsWith('mock-')) return null
  return `https://www.notion.so/${pageId.replace(/-/g, '')}`
}

function linesToArray(s: string): string[] {
  return s.split('\n').map((t) => t.trim()).filter(Boolean)
}

interface Fields {
  vp: string
  achievements: string[]
  utilisateurs: string[]
  warnings: string[]
  nextSteps: string[]
  notesMeta: string
}

interface Draft {
  vp: string
  achievements: string
  utilisateurs: string
  warnings: string
  nextSteps: string
  notesMeta: string
}

function fieldsFromProject(p: Project): Fields {
  return {
    vp: p.vp,
    achievements: p.achievements,
    utilisateurs: p.utilisateurs,
    warnings: p.warnings,
    nextSteps: p.nextSteps,
    notesMeta: p.notesMeta,
  }
}

export default function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const { role } = useRole()
  const isAdmin = role === 'admin'
  const [tab, setTab] = useState<'current' | 'notes'>('current')

  const [fields, setFields] = useState<Fields>(() => fieldsFromProject(project))
  const [draft, setDraft] = useState<Draft | null>(null)
  const [edit, setEdit] = useState(false)
  const [validated, setValidated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const validKey = `bgl.validated.${project.notionPageId}`
  const canEdit = isAdmin && !project.notionPageId.startsWith('mock-')

  // Réinitialise à chaque changement de projet (les bases Notion sont mensuelles :
  // un nouvel ID de page = reporting non validé).
  useEffect(() => {
    setFields(fieldsFromProject(project))
    setEdit(false)
    setError('')
    setSaved(false)
    setValidated(window.localStorage.getItem(validKey) === '1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.notionPageId])

  function enterEdit() {
    setDraft({
      vp: fields.vp,
      achievements: fields.achievements.join('\n'),
      utilisateurs: fields.utilisateurs.join('\n'),
      warnings: fields.warnings.join('\n'),
      nextSteps: fields.nextSteps.join('\n'),
      notesMeta: fields.notesMeta,
    })
    setSaved(false)
    setError('')
    setEdit(true)
  }

  function setValidatedState(v: boolean) {
    setValidated(v)
    window.localStorage.setItem(validKey, v ? '1' : '0')
  }

  async function save() {
    if (!draft) return
    setSaving(true)
    setError('')
    const reporting = {
      vp: draft.vp.trim(),
      achievements: linesToArray(draft.achievements),
      utilisateurs: linesToArray(draft.utilisateurs),
      warnings: linesToArray(draft.warnings),
      nextSteps: linesToArray(draft.nextSteps),
      notesMeta: draft.notesMeta.trim(),
    }
    try {
      const res = await fetch(`/api/projects/${project.notionPageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporting }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Échec de l’enregistrement')
      }
      setFields(reporting)
      setEdit(false)
      setSaved(true)
      setValidatedState(false) // une modification remet le reporting en attente de validation
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setSaving(false)
    }
  }

  const p = project

  return (
    <section className="view-section active">
      <button className="detail-back" onClick={onBack}>
        ← Retour à la vue macro
      </button>

      {/* Barre de reporting (admin) */}
      {canEdit && (
        <div className="reporting-bar">
          {!edit ? (
            <button className="btn-secondary sm" onClick={enterEdit}>
              ✎ Modifier le reporting
            </button>
          ) : (
            <button className="btn-secondary sm" onClick={() => setEdit(false)} disabled={saving}>
              ✕ Annuler
            </button>
          )}
          {validated ? (
            <button className="valid-pill" onClick={() => setValidatedState(false)} title="Cliquer pour dévalider">
              ✓ Reporting validé
            </button>
          ) : (
            <button className="btn-primary sm" onClick={() => setValidatedState(true)} disabled={edit}>
              Marquer validé
            </button>
          )}
          {saved && <span className="save-ok">Enregistré dans Notion ✓</span>}
        </div>
      )}

      {canEdit && !validated && (
        <div className="pending-banner">⏳ En attente de validation du coach</div>
      )}
      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}

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
              {edit ? (
                <textarea
                  className="edit-area light"
                  rows={4}
                  value={draft!.vp}
                  onChange={(e) => setDraft({ ...draft!, vp: e.target.value })}
                />
              ) : (
                <div className="vp-text">{fields.vp}</div>
              )}
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
              {notionUrl(p.notionPageId) && (
                <a className="notion-link" href={notionUrl(p.notionPageId)!} target="_blank" rel="noopener noreferrer">
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
                  {edit ? (
                    <textarea
                      className="edit-area"
                      rows={5}
                      placeholder="Un élément par ligne"
                      value={draft!.achievements}
                      onChange={(e) => setDraft({ ...draft!, achievements: e.target.value })}
                    />
                  ) : (
                    <ul className="list-clean bullets">
                      {fields.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="section-title" style={{ fontSize: 13, marginBottom: 8 }}>
                    Utilisateurs internes cibles
                  </div>
                  {edit ? (
                    <textarea
                      className="edit-area"
                      rows={5}
                      placeholder="Un élément par ligne"
                      value={draft!.utilisateurs}
                      onChange={(e) => setDraft({ ...draft!, utilisateurs: e.target.value })}
                    />
                  ) : (
                    <ul className="list-clean targets">
                      {fields.utilisateurs.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="warning-box">
                <div className="section-title" style={{ fontSize: 13, marginBottom: 8 }}>
                  Warnings
                </div>
                {edit ? (
                  <textarea
                    className="edit-area"
                    rows={4}
                    placeholder="Un élément par ligne"
                    value={draft!.warnings}
                    onChange={(e) => setDraft({ ...draft!, warnings: e.target.value })}
                  />
                ) : (
                  <ul className="list-clean warnings">
                    {fields.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="next-steps-box">
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', marginBottom: 7 }}>
                  Prochaines étapes
                </div>
                {edit ? (
                  <textarea
                    className="edit-area"
                    rows={4}
                    placeholder="Un élément par ligne"
                    value={draft!.nextSteps}
                    onChange={(e) => setDraft({ ...draft!, nextSteps: e.target.value })}
                  />
                ) : (
                  <ul className="next-steps-list">
                    {fields.nextSteps.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>

              {edit && (
                <div className="save-bar">
                  <button className="btn-primary" onClick={save} disabled={saving}>
                    {saving ? 'Enregistrement…' : '💾 Enregistrer dans Notion'}
                  </button>
                  <button className="btn-secondary" onClick={() => setEdit(false)} disabled={saving}>
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 'var(--r-md)', boxShadow: 'var(--sh-md)', padding: '20px 22px' }}>
          <div className="section-title" style={{ marginBottom: 12 }}>
            Notes meta coach
          </div>
          {edit ? (
            <>
              <textarea
                className="edit-area"
                rows={6}
                value={draft!.notesMeta}
                onChange={(e) => setDraft({ ...draft!, notesMeta: e.target.value })}
              />
              <div className="save-bar">
                <button className="btn-primary" onClick={save} disabled={saving}>
                  {saving ? 'Enregistrement…' : '💾 Enregistrer dans Notion'}
                </button>
                <button className="btn-secondary" onClick={() => setEdit(false)} disabled={saving}>
                  Annuler
                </button>
              </div>
            </>
          ) : (
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
              {fields.notesMeta}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
