'use client'

import { useState } from 'react'
import { useData } from '@/components/data/DataProvider'

export default function AskQuestionForm({ onDone }: { onDone: () => void }) {
  const { addQuestion } = useData()
  const [text, setText] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    addQuestion(text)
    onDone()
  }

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Votre question</span>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Une interrogation sur l’IA, un outil, un usage, la conformité… ?"
          autoFocus
        />
      </label>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Annuler
        </button>
        <button type="submit" className="btn-primary">
          Envoyer ma question
        </button>
      </div>
    </form>
  )
}
