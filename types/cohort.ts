import type { Project } from '@/types/project'
import type { Role } from '@/lib/roles'

export type CohortStatus = 'active' | 'closed' | 'upcoming'

export interface Cohort {
  id: string
  name: string
  period: string
  description: string
  status: CohortStatus
  /** true → les projets proviennent de Notion (cohorte courante, live). */
  isLive?: boolean
  /** Projets pour les cohortes mock (ignoré si isLive). */
  projects?: Project[]
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  cohortId: string
}
