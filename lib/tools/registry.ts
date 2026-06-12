import type { ToolKind } from '@/lib/tools/types'

export interface ToolRegistryEntry {
  slug: string
  title: string
  objective: string
  prio: 'P0' | 'P1' | 'P2' | 'à statuer'
  group: 'porteur' | 'ambassadeur'
  kind: ToolKind
}

export const TOOL_REGISTRY: ToolRegistryEntry[] = [
  {
    slug: 'kit-onboarding-poc',
    title: 'Kit d’onboarding POC',
    objective: 'Réussir ses POC et embarquer progressivement les premiers utilisateurs.',
    prio: 'P0',
    group: 'porteur',
    kind: 'guide',
  },
  {
    slug: 'kit-recueil-feedback',
    title: 'Kit de recueil de feedback',
    objective: 'Tracer les retours utilisateurs et alimenter l’optimisation continue.',
    prio: 'P0',
    group: 'porteur',
    kind: 'guide',
  },
  {
    slug: 'qualification-ai-act',
    title: 'Qualification conformité AI Act',
    objective: 'Qualifier un projet au regard de l’AI Act, indiquer l’accompagnement requis, poser des warnings.',
    prio: 'P0',
    group: 'porteur',
    kind: 'aiact',
  },
  {
    slug: 'bibliotheque-canevas',
    title: 'Bibliothèque de canevas',
    objective: '9 canevas remplissables calés sur les livrables des modules : PRD, DFD, ROI, RACI, deck sponsor…',
    prio: 'P1',
    group: 'porteur',
    kind: 'canvas-library',
  },
  {
    slug: 'parcours-jalons',
    title: 'Parcours par jalons (stage gate)',
    objective: 'Matérialiser les passages de cap de l’idée à la présentation sponsor : checklist et pièces par jalon.',
    prio: 'P1',
    group: 'porteur',
    kind: 'guide',
  },
  {
    slug: 'annuaire-conformite',
    title: 'Annuaire conformité',
    objective: 'DPO, référents règlement IA et points de contact à solliciter selon le sujet.',
    prio: 'P0',
    group: 'ambassadeur',
    kind: 'guide',
  },
  {
    slug: 'kit-ambassadeur',
    title: 'Kit ambassadeur clé en main',
    objective: 'Trames d’animation (Café IA…) et supports de partage pour acculturer ses collègues.',
    prio: 'P1',
    group: 'ambassadeur',
    kind: 'guide',
  },
]

export function getToolEntry(slug: string): ToolRegistryEntry | undefined {
  return TOOL_REGISTRY.find((t) => t.slug === slug)
}
