import type { BusinessUnit, Domaine, EventFormat, Nature, Priorite } from '@/lib/taxonomy'

export interface UseCase {
  id: string
  title: string
  description: string
  businessUnit: BusinessUnit
  domaine: Domaine
  votes: number
  submittedBy: string
  createdAt: string // ISO date
  // Tags posés par le facilitateur (optionnels tant que non qualifié)
  priorite?: Priorite
  nature?: Nature
  modalites?: string // modalités de mise en œuvre (qualification Quick Win)
}

export interface CommunityEvent {
  id: string
  title: string
  format: EventFormat
  date: string // ISO date (YYYY-MM-DD)
  time: string // "12:30"
  location: string
  description: string
  organizer: string
}

export interface Question {
  id: string
  text: string
  askedBy: string
  createdAt: string // ISO date
  answer?: string
}
