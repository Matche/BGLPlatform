'use client'

import { useState } from 'react'
import { CANVASES } from '@/lib/tools/canvases'
import CanvasView from '@/components/tools/CanvasView'

export default function CanvasLibrary() {
  const [openId, setOpenId] = useState<string | null>(null)
  const canvas = CANVASES.find((c) => c.id === openId)

  if (canvas) return <CanvasView canvas={canvas} onBack={() => setOpenId(null)} />

  return (
    <div className="canvas-grid">
      {CANVASES.map((c) => (
        <button className="canvas-card" key={c.id} onClick={() => setOpenId(c.id)}>
          <div className="canvas-card-source">{c.source}</div>
          <h3 className="canvas-card-title">{c.title}</h3>
          <p className="canvas-card-desc">{c.description}</p>
          <span className="canvas-card-open">Ouvrir & remplir →</span>
        </button>
      ))}
    </div>
  )
}
