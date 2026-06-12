import type { Project } from '@/types/project'

/** Initiales (max 2) d'un nom complet, pour les avatars d'équipe. */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
}

/** Avancement moyen recalculé à partir des 3 objectifs (arrondi). */
export function avgPct(p: Project): number {
  const objs = p.objectives
  if (!objs.length) return 0
  return Math.round(objs.reduce((s, o) => s + (o.pct || 0), 0) / objs.length)
}

/** Classe CSS de la cellule d'axe selon le score 0–3. */
export function axisClass(v: number): 'ok' | 'mid' | 'ko' | 'none' {
  return v >= 3 ? 'ok' : v >= 2 ? 'mid' : v >= 1 ? 'ko' : 'none'
}

export const AX_KEYS = ['specs', 'gouv', 'budget', 'tests', 'conformiteScore'] as const
export const AX_LABELS = ['Spécifs', 'Gouver.', 'Budget', 'Tests', 'Conform.']
export const AX_SUB = ['Non initié', 'Faible', 'Partiel', 'Validé']
