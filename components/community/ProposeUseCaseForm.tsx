'use client'

import { useState } from 'react'
import { useData } from '@/components/data/DataProvider'
import { BUSINESS_UNITS, DOMAINES, type BusinessUnit, type Domaine } from '@/lib/taxonomy'

export default function ProposeUseCaseForm({ onDone }: { onDone: () => void }) {
  const { addUseCase } = useData()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | ''>('')
  const [domaine, setDomaine] = useState<Domaine | ''>('')
  const [submittedBy, setSubmittedBy] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Le titre et la description sont requis.')
      return
    }
    if (!businessUnit || !domaine) {
      setError('La Business Unit et le Domaine métier sont obligatoires pour enregistrer le cas d’usage.')
      return
    }
    addUseCase({ title, description, businessUnit, domaine, submittedBy })
    onDone()
  }

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Titre du cas d’usage *</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Assistant de réponse aux emails clients" />
      </label>

      <label className="field">
        <span className="field-label">Description *</span>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quel besoin métier ? Quelle tâche serait assistée par l’IA ?"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field-label">Business Unit * (obligatoire)</span>
          <select value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value as BusinessUnit)}>
            <option value="">— Sélectionner —</option>
            {BUSINESS_UNITS.map((bu) => (
              <option key={bu} value={bu}>
                {bu}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Domaine métier * (obligatoire)</span>
          <select value={domaine} onChange={(e) => setDomaine(e.target.value as Domaine)}>
            <option value="">— Sélectionner —</option>
            {DOMAINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field-label">Votre nom (optionnel)</span>
        <input value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} placeholder="Anonyme" />
      </label>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Annuler
        </button>
        <button type="submit" className="btn-primary">
          Enregistrer le cas d’usage
        </button>
      </div>
    </form>
  )
}
