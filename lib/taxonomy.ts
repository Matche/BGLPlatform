// ── Taxonomies communautaires (PRD §7-8) ────────────────────────────────────
// Tags obligatoires à la soumission d'un cas d'usage : Business Unit + Domaine métier.

export const BUSINESS_UNITS = [
  'Banque de détail',
  'Banque Privée / Wealth',
  'Corporate & Institutional Banking',
  'Risk & Compliance',
  'Opérations',
  'IT / Data',
  'Ressources Humaines',
  'Marketing & Communication',
  'Finance',
  'Juridique',
] as const

export const DOMAINES = [
  'Relation client',
  'Crédit & Financement',
  'Conformité & AML',
  'Recrutement & RH',
  'Back-office & Opérations',
  'Reporting & Data',
  'Juridique & Réglementaire',
  'Marketing & Acquisition',
  'Productivité interne',
] as const

export type BusinessUnit = (typeof BUSINESS_UNITS)[number]
export type Domaine = (typeof DOMAINES)[number]

// Tags de priorisation et de nature posés par le facilitateur (PRD §7 face facilitateur).
export const PRIORITES = ['Prioritaire', 'Pas prioritaire'] as const
export const NATURES = ['Quick Win Copilot', 'Quick Win Mistral', 'Solution custom'] as const
export type Priorite = (typeof PRIORITES)[number]
export type Nature = (typeof NATURES)[number]

// Formats d'événements (PRD §9).
export const EVENT_FORMATS = [
  'Café IA',
  'Lunch & Learn',
  'Démo trimestrielle',
  'Polytechnique Executive Education',
] as const
export type EventFormat = (typeof EVENT_FORMATS)[number]

/** Couleur d'accent par format (réutilise la palette BGL). */
export const FORMAT_COLOR: Record<EventFormat, string> = {
  'Café IA': 'var(--green)',
  'Lunch & Learn': 'var(--amber)',
  'Démo trimestrielle': 'var(--slate)',
  'Polytechnique Executive Education': 'var(--magenta)',
}
