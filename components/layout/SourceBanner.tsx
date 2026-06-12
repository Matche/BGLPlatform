'use client'

import type { ProjectsPayload } from '@/types/project'

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function SourceBanner({ source, lastSync }: Pick<ProjectsPayload, 'source' | 'lastSync'>) {
  const label =
    source === 'notion'
      ? 'Reporting consolidé BGL BNP — Coaching INSKIP'
      : 'Données de démonstration (NOTION_API_KEY non configurée)'

  return (
    <div className="source-banner">
      <div>
        <span className="dot-status" />
        Source : <strong>{label}</strong>
      </div>
      <span>
        Mise à jour : <strong>{formatDate(lastSync)}</strong>
      </span>
    </div>
  )
}
