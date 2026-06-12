'use client'

import { useState } from 'react'
import { useData } from '@/components/data/DataProvider'
import { EVENT_FORMATS, type EventFormat } from '@/lib/taxonomy'

export default function CreateEventForm({ onDone }: { onDone: () => void }) {
  const { addEvent } = useData()
  const [title, setTitle] = useState('')
  const [format, setFormat] = useState<EventFormat>('Café IA')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:30')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) {
      setError('Le titre et la date sont requis.')
      return
    }
    addEvent({
      title: title.trim(),
      format,
      date,
      time,
      location: location.trim() || 'À préciser',
      description: description.trim(),
      organizer: organizer.trim() || 'Facilitateur',
    })
    onDone()
  }

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Titre *</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Café IA #6 — Retours pilotes" />
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field-label">Format</span>
          <select value={format} onChange={(e) => setFormat(e.target.value as EventFormat)}>
            {EVENT_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Date *</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Heure</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Lieu</span>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Luxembourg — Atrium / Distanciel" />
      </label>

      <label className="field">
        <span className="field-label">Description</span>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Objet et déroulé de l’événement" />
      </label>

      <label className="field">
        <span className="field-label">Organisateur</span>
        <input value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Votre nom" />
      </label>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Annuler
        </button>
        <button type="submit" className="btn-primary">
          Créer l’événement
        </button>
      </div>
    </form>
  )
}
