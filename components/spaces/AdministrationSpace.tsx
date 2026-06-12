'use client'

import { useState } from 'react'
import RoleGate from '@/components/role/RoleGate'
import Modal from '@/components/ui/Modal'
import { useAdmin } from '@/components/data/AdminProvider'
import { ROLES, type Role } from '@/lib/roles'
import type { CohortStatus } from '@/types/cohort'

type Tab = 'cohortes' | 'utilisateurs'

const STATUS_LABEL: Record<CohortStatus, string> = {
  active: 'En cours',
  closed: 'Clôturée',
  upcoming: 'À venir',
}

export default function AdministrationSpace() {
  const { cohorts, users, addCohort, addUser } = useAdmin()
  const [tab, setTab] = useState<Tab>('cohortes')
  const [modal, setModal] = useState<null | 'cohort' | 'user'>(null)

  return (
    <RoleGate allow={['admin']}>
      <main className="main space-main">
        <div className="space-header">
          <h1>Administration</h1>
          <p>Gérez les cohortes du programme et les utilisateurs et leurs accès.</p>
        </div>

        <div className="detail-tabs" style={{ marginBottom: 18 }}>
          <button className={`detail-tab ${tab === 'cohortes' ? 'active' : ''}`} onClick={() => setTab('cohortes')}>
            Cohortes<span className="tab-count">{cohorts.length}</span>
          </button>
          <button className={`detail-tab ${tab === 'utilisateurs' ? 'active' : ''}`} onClick={() => setTab('utilisateurs')}>
            Utilisateurs<span className="tab-count">{users.length}</span>
          </button>
        </div>

        {tab === 'cohortes' && (
          <section>
            <div className="section-bar">
              <div className="section-title" style={{ margin: 0 }}>
                Cohortes du programme
              </div>
              <button className="btn-primary sm" onClick={() => setModal('cohort')}>
                + Ajouter une cohorte
              </button>
            </div>
            <div className="tool-table-wrap">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th>Cohorte</th>
                    <th>Période</th>
                    <th>Statut</th>
                    <th>Source</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.name}</strong>
                      </td>
                      <td>{c.period}</td>
                      <td>
                        <span className={`cohort-status ${c.status}`}>{STATUS_LABEL[c.status]}</span>
                      </td>
                      <td>{c.isLive ? 'Notion (live)' : 'Démo'}</td>
                      <td>{c.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'utilisateurs' && (
          <section>
            <div className="section-bar">
              <div className="section-title" style={{ margin: 0 }}>
                Utilisateurs &amp; accès
              </div>
              <button className="btn-primary sm" onClick={() => setModal('user')}>
                + Créer un utilisateur
              </button>
            </div>
            <div className="tool-table-wrap">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Cohorte</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{ROLES.find((r) => r.key === u.role)?.label}</span>
                      </td>
                      <td>{cohorts.find((c) => c.id === u.cohortId)?.name ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {modal === 'cohort' && (
        <Modal title="Ajouter une cohorte" onClose={() => setModal(null)}>
          <CohortForm onDone={() => setModal(null)} onAdd={addCohort} />
        </Modal>
      )}
      {modal === 'user' && (
        <Modal title="Créer un utilisateur" onClose={() => setModal(null)}>
          <UserForm onDone={() => setModal(null)} onAdd={addUser} cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))} />
        </Modal>
      )}
    </RoleGate>
  )
}

function CohortForm({
  onDone,
  onAdd,
}: {
  onDone: () => void
  onAdd: (c: { name: string; period: string; description: string; status: CohortStatus }) => void
}) {
  const [name, setName] = useState('')
  const [period, setPeriod] = useState('')
  const [status, setStatus] = useState<CohortStatus>('upcoming')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Le nom de la cohorte est requis.')
      return
    }
    onAdd({ name: name.trim(), period: period.trim(), description: description.trim(), status })
    onDone()
  }

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Nom de la cohorte *</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Promotion 2028" />
      </label>
      <div className="field-row">
        <label className="field">
          <span className="field-label">Période</span>
          <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2028" />
        </label>
        <label className="field">
          <span className="field-label">Statut</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as CohortStatus)}>
            <option value="upcoming">À venir</option>
            <option value="active">En cours</option>
            <option value="closed">Clôturée</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span className="field-label">Description</span>
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Objet de la cohorte" />
      </label>
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Annuler
        </button>
        <button type="submit" className="btn-primary">
          Ajouter la cohorte
        </button>
      </div>
    </form>
  )
}

function UserForm({
  onDone,
  onAdd,
  cohorts,
}: {
  onDone: () => void
  onAdd: (u: { name: string; email: string; role: Role; cohortId: string }) => void
  cohorts: { id: string; name: string }[]
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('utilisateur')
  const [cohortId, setCohortId] = useState(cohorts[0]?.id ?? '')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Le nom et l’email sont requis.')
      return
    }
    onAdd({ name: name.trim(), email: email.trim(), role, cohortId })
    onDone()
  }

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Nom complet *</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom Nom" />
      </label>
      <label className="field">
        <span className="field-label">Email *</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@bgl.lu" />
      </label>
      <div className="field-row">
        <label className="field">
          <span className="field-label">Rôle</span>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Cohorte</span>
          <select value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Annuler
        </button>
        <button type="submit" className="btn-primary">
          Créer l’utilisateur
        </button>
      </div>
    </form>
  )
}
