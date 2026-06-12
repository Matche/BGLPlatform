'use client'

import type { ToolGuide, ToolSection } from '@/lib/tools/types'
import { getCanvas } from '@/lib/tools/canvases'

export default function ToolDetail({ guide }: { guide: ToolGuide }) {
  return (
    <div className="tool-detail">
      <p className="tool-detail-intro">{guide.intro}</p>
      {guide.sections.map((s, i) => (
        <Section key={i} section={s} />
      ))}
    </div>
  )
}

function Section({ section: s }: { section: ToolSection }) {
  switch (s.type) {
    case 'text':
      return (
        <section className="tool-section">
          {s.heading && <div className="section-title">{s.heading}</div>}
          {s.body.map((p, i) => (
            <p className="tool-p" key={i}>
              {p}
            </p>
          ))}
        </section>
      )
    case 'steps':
      return (
        <section className="tool-section">
          {s.heading && <div className="section-title">{s.heading}</div>}
          <div className="step-list">
            {s.steps.map((st, i) => (
              <div className="step" key={i}>
                <div className="step-title">{st.title}</div>
                <div className="step-detail">{st.detail}</div>
              </div>
            ))}
          </div>
        </section>
      )
    case 'checklist':
      return (
        <section className="tool-section">
          {s.heading && <div className="section-title">{s.heading}</div>}
          <ul className="check-list">
            {s.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </section>
      )
    case 'callout':
      return (
        <section className={`callout callout-${s.variant}`}>
          {s.title && <div className="callout-title">{s.title}</div>}
          <p>{s.body}</p>
        </section>
      )
    case 'template':
      return (
        <section className="tool-section">
          {s.heading && <div className="section-title">{s.heading}</div>}
          <div className="template-box">
            <div className="template-label">{s.label}</div>
            <pre className="template-body">{s.body}</pre>
          </div>
        </section>
      )
    case 'table':
      return (
        <section className="tool-section">
          {s.heading && <div className="section-title">{s.heading}</div>}
          <div className="tool-table-wrap">
            <table className="tool-table">
              <thead>
                <tr>
                  {s.columns.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )
    case 'canvasRef': {
      const canvas = getCanvas(s.canvasId)
      return (
        <section className="tool-section">
          {s.heading && <div className="section-title">{s.heading}</div>}
          <div className="canvas-ref">
            <span className="canvas-ref-icon">▦</span>
            <div>
              <div className="canvas-ref-title">{canvas?.title ?? s.canvasId}</div>
              {s.note && <div className="canvas-ref-note">{s.note}</div>}
              <div className="canvas-ref-hint">Disponible dans l’outil « Bibliothèque de canevas ».</div>
            </div>
          </div>
        </section>
      )
    }
    default:
      return null
  }
}
