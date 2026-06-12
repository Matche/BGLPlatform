// Modèle de contenu des outils-guides de la boîte à outils facilitateur.

export type ToolSection =
  | { type: 'text'; heading?: string; body: string[] }
  | { type: 'steps'; heading?: string; steps: { title: string; detail: string }[] }
  | { type: 'checklist'; heading?: string; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'rule'; title?: string; body: string }
  | { type: 'template'; heading?: string; label: string; body: string }
  | { type: 'table'; heading?: string; columns: string[]; rows: string[][] }
  | { type: 'canvasRef'; heading?: string; canvasId: string; note?: string }

export interface ToolGuide {
  slug: string
  title: string
  subtitle: string
  intro: string
  sections: ToolSection[]
}

/** Type d'outil : guide structuré, wizard interactif, ou bibliothèque de canevas. */
export type ToolKind = 'guide' | 'aiact' | 'canvas-library'

export interface ToolEntry {
  slug: string
  title: string
  kind: ToolKind
  guide?: ToolGuide
}
