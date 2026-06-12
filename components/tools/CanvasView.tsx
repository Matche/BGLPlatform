'use client'

import { useEffect, useState } from 'react'
import type { CanvasDef } from '@/lib/tools/canvases'

/** Canevas remplissable, persisté en localStorage, copiable. */
export default function CanvasView({ canvas, onBack }: { canvas: CanvasDef; onBack: () => void }) {
  const storageKey = `bgl.canvas.${canvas.id}`
  const [values, setValues] = useState<string[]>(() => canvas.fields.map(() => ''))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const arr = JSON.parse(raw) as string[]
        setValues(canvas.fields.map((_, i) => arr[i] ?? ''))
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  function update(i: number, v: string) {
    setValues((prev) => {
      const next = [...prev]
      next[i] = v
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  function copy() {
    const txt = `${canvas.title}\n\n${canvas.fields
      .map((f, i) => `## ${f.label}\n${values[i] || '—'}`)
      .join('\n\n')}`
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="canvas-view">
      <button className="detail-back" onClick={onBack}>
        ← Bibliothèque de canevas
      </button>
      <div className="canvas-head">
        <div>
          <h2 className="canvas-title">{canvas.title}</h2>
          <div className="canvas-source">{canvas.source}</div>
        </div>
        <button className="btn-primary sm" onClick={copy}>
          {copied ? 'Copié ✓' : 'Copier le canevas'}
        </button>
      </div>
      <p className="canvas-desc">{canvas.description}</p>

      <div className="canvas-fields">
        {canvas.fields.map((f, i) => (
          <div className="canvas-field" key={i}>
            <label className="field-label">{f.label}</label>
            <div className="canvas-field-hint">{f.hint}</div>
            <textarea rows={f.rows ?? 2} value={values[i]} onChange={(e) => update(i, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  )
}
