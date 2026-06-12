// ── Contrat de données partagé client/serveur ──────────────────────────────
// Voir HANDOVER.md §4 pour le mapping Notion → application.

export interface TeamMember {
  name: string
  role: string
  org: string
}

export interface Objective {
  cat: string
  desc: string
  pct: number
}

export interface Conformite {
  dpo: string
  risk: string
  perso: boolean
  notes: string[]
}

export type ProjectStatus = 'PROTOTYPE' | 'IDEATION' | 'INDUSTRIALISÉ' | 'CLOSED'
export type Confidence = 'high' | 'medium' | 'low'

export interface Project {
  notionPageId: string
  id: string
  name: string
  status: ProjectStatus
  nextSession: string
  confidence: Confidence
  avancement: number
  vp: string
  conformite: Conformite
  team: TeamMember[]
  stakeholders: TeamMember[]
  specs: number
  gouv: number
  budget: number
  tests: number
  conformiteScore: number
  objectives: [Objective, Objective, Objective]
  achievements: string[]
  utilisateurs: string[]
  warnings: string[]
  nextSteps: string[]
  notesMeta: string
  module: string
  typeIA: string
  prioriteBudget: string
  coach: string
  lastUpdated: string
}

/** Métadonnées de source pour la bannière (titre de la base, fraîcheur). */
export interface ProjectsPayload {
  projects: Project[]
  source: 'notion' | 'mock'
  lastSync: string
}
