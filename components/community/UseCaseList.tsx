'use client'

import { useState } from 'react'
import { useData } from '@/components/data/DataProvider'
import { NATURES, PRIORITES, type Nature, type Priorite } from '@/lib/taxonomy'
import type { UseCase } from '@/types/community'

/**
 * Liste des cas d'usage classés par votes.
 * mode "vote" : face utilisateur (+1 façon Reddit).
 * mode "admin" : face facilitateur (priorité, nature, modalités).
 */
export default function UseCaseList({ mode }: { mode: 'vote' | 'admin' }) {
  const { useCases } = useData()
  const ranked = [...useCases].sort((a, b) => b.votes - a.votes)

  return (
    <div className="uc-list">
      {ranked.map((uc, i) => (
        <UseCaseRow key={uc.id} uc={uc} rank={i + 1} mode={mode} />
      ))}
    </div>
  )
}

function UseCaseRow({ uc, rank, mode }: { uc: UseCase; rank: number; mode: 'vote' | 'admin' }) {
  const { votedIds, toggleVote, tagUseCase } = useData()
  const voted = votedIds.includes(uc.id)
  const [modalites, setModalites] = useState(uc.modalites ?? '')

  return (
    <div className="uc-row">
      <button
        className={`uc-vote ${voted ? 'voted' : ''}`}
        onClick={() => toggleVote(uc.id)}
        title={voted ? 'Retirer mon vote' : 'Soutenir ce cas d’usage'}
        aria-pressed={voted}
      >
        <span className="uc-vote-arrow">▲</span>
        <span className="uc-vote-count">{uc.votes}</span>
      </button>

      <div className="uc-main">
        <div className="uc-rank">#{rank}</div>
        <h3 className="uc-title">{uc.title}</h3>
        <p className="uc-desc">{uc.description}</p>
        <div className="uc-tags">
          <span className="uc-tag bu">{uc.businessUnit}</span>
          <span className="uc-tag dom">{uc.domaine}</span>
          {uc.priorite && <span className={`uc-tag prio ${uc.priorite === 'Prioritaire' ? 'on' : 'off'}`}>{uc.priorite}</span>}
          {uc.nature && <span className="uc-tag nature">{uc.nature}</span>}
          <span className="uc-by">par {uc.submittedBy}</span>
        </div>

        {mode === 'admin' && (
          <div className="uc-admin">
            <div className="uc-admin-row">
              <span className="uc-admin-label">Priorité</span>
              <div className="chip-group">
                {PRIORITES.map((p) => (
                  <button
                    key={p}
                    className={`chip ${uc.priorite === p ? 'active' : ''}`}
                    onClick={() => tagUseCase(uc.id, { priorite: uc.priorite === p ? undefined : (p as Priorite) })}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="uc-admin-row">
              <span className="uc-admin-label">Nature</span>
              <div className="chip-group">
                {NATURES.map((n) => (
                  <button
                    key={n}
                    className={`chip ${uc.nature === n ? 'active' : ''}`}
                    onClick={() => tagUseCase(uc.id, { nature: uc.nature === n ? undefined : (n as Nature) })}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="uc-admin-row">
              <span className="uc-admin-label">Modalités</span>
              <input
                className="uc-modalites"
                value={modalites}
                placeholder="Modalités de mise en œuvre (outil, périmètre, délai…)"
                onChange={(e) => setModalites(e.target.value)}
                onBlur={() => tagUseCase(uc.id, { modalites })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
