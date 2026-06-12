import type { Project } from '@/types/project'
import type { AdminUser, Cohort } from '@/types/cohort'

// Données de démo (mock) — cohortes non-live + utilisateurs. Persistées via AdminProvider.

/** Fabrique un projet mock minimal mais valide pour les cohortes de démo. */
function mk(
  id: string,
  name: string,
  status: Project['status'],
  avancement: number,
  vp: string,
  scores: [number, number, number, number, number],
): Project {
  const [specs, gouv, budget, tests, conformiteScore] = scores
  return {
    notionPageId: `mock-${id}`,
    id,
    name,
    status,
    nextSession: '',
    confidence: 'medium',
    avancement,
    vp,
    conformite: { dpo: 'Non initié', risk: 'Moyen', perso: false, notes: [] },
    team: [],
    stakeholders: [],
    specs,
    gouv,
    budget,
    tests,
    conformiteScore,
    objectives: [
      { cat: '', desc: '', pct: avancement },
      { cat: '', desc: '', pct: avancement },
      { cat: '', desc: '', pct: avancement },
    ],
    achievements: [],
    utilisateurs: [],
    warnings: [],
    nextSteps: [],
    notesMeta: '',
    module: '',
    typeIA: '',
    prioriteBudget: '',
    coach: 'Matthieu Chéreau',
    lastUpdated: '2025-12-15',
  }
}

const COHORT_2025: Project[] = [
  mk('C25-1', 'Assistant crédit PME', 'INDUSTRIALISÉ', 90, 'Pré-analyse des dossiers de crédit PME.', [3, 3, 3, 3, 3]),
  mk('C25-2', 'Détection de fraude carte', 'INDUSTRIALISÉ', 85, 'Scoring temps réel des transactions suspectes.', [3, 3, 2, 3, 3]),
  mk('C25-3', 'Synthèse des réunions conseil', 'CLOSED', 100, 'Comptes-rendus automatiques du comité.', [3, 3, 3, 3, 3]),
  mk('C25-4', 'Chatbot support interne', 'INDUSTRIALISÉ', 75, 'Réponses aux questions IT/RH internes.', [3, 2, 3, 2, 3]),
]

const COHORT_2027: Project[] = [
  mk('C27-1', 'Copilote conformité', 'IDEATION', 10, 'Assistance à la veille réglementaire CSSF.', [2, 1, 1, 0, 1]),
  mk('C27-2', 'Analyse ESG de portefeuille', 'IDEATION', 5, 'Notation ESG automatisée des positions.', [1, 0, 1, 0, 0]),
  mk('C27-3', 'Assistant onboarding client', 'IDEATION', 0, 'Guidage du parcours d’entrée en relation.', [1, 0, 0, 0, 0]),
]

export const SEED_COHORTS: Cohort[] = [
  {
    id: 'cohort-2026',
    name: 'Promotion 2026',
    period: '2026',
    description: 'Cohorte en cours — 7 projets IA coachés, données en temps réel depuis Notion.',
    status: 'active',
    isLive: true,
  },
  {
    id: 'cohort-2025',
    name: 'Promotion 2025',
    period: '2025',
    description: 'Cohorte clôturée — projets industrialisés ou clôturés.',
    status: 'closed',
    projects: COHORT_2025,
  },
  {
    id: 'cohort-2027',
    name: 'Promotion 2027',
    period: '2027',
    description: 'Cohorte à venir — cadrage des premiers cas d’usage.',
    status: 'upcoming',
    projects: COHORT_2027,
  },
]

export const SEED_USERS: AdminUser[] = [
  { id: 'u-1', name: 'Matthieu Chéreau', email: 'matthieu.chereau@inskip.fr', role: 'admin', cohortId: 'cohort-2026' },
  { id: 'u-2', name: 'Victor Dilion', email: 'victor.dilion@bgl.lu', role: 'facilitateur', cohortId: 'cohort-2026' },
  { id: 'u-3', name: 'Yu-Ying Chap', email: 'yuying.chap@bgl.lu', role: 'facilitateur', cohortId: 'cohort-2026' },
  { id: 'u-4', name: 'Najla Ben Salem', email: 'najla.bensalem@bgl.lu', role: 'facilitateur', cohortId: 'cohort-2026' },
  { id: 'u-5', name: 'Camille Lefèvre', email: 'camille.lefevre@bgl.lu', role: 'utilisateur', cohortId: 'cohort-2026' },
]
