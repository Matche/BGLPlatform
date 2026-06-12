'use client'

import { getToolEntry } from '@/lib/tools/registry'
import { TOOL_GUIDES } from '@/lib/tools/content'
import ToolDetail from '@/components/tools/ToolDetail'
import AIActWizard from '@/components/tools/AIActWizard'
import CanvasLibrary from '@/components/tools/CanvasLibrary'

export default function ToolHost({ slug, onBack }: { slug: string; onBack: () => void }) {
  const entry = getToolEntry(slug)
  if (!entry) return null

  return (
    <div>
      <button className="detail-back" onClick={onBack}>
        ← Retour à la boîte à outils
      </button>
      <div className="space-header" style={{ marginTop: 4 }}>
        <h1>{entry.title}</h1>
        <p>{entry.objective}</p>
      </div>

      {entry.kind === 'guide' && TOOL_GUIDES[slug] && <ToolDetail guide={TOOL_GUIDES[slug]} />}
      {entry.kind === 'aiact' && <AIActWizard />}
      {entry.kind === 'canvas-library' && <CanvasLibrary />}
    </div>
  )
}
