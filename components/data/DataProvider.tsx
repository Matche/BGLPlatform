'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import type { CommunityEvent, Question, UseCase } from '@/types/community'
import { SEED_EVENTS, SEED_QUESTIONS, SEED_USE_CASES } from '@/lib/seed'
import type { BusinessUnit, Domaine, Nature, Priorite } from '@/lib/taxonomy'

interface NewUseCase {
  title: string
  description: string
  businessUnit: BusinessUnit
  domaine: Domaine
  submittedBy?: string
}

interface UseCaseTagging {
  priorite?: Priorite
  nature?: Nature
  modalites?: string
}

interface DataContextValue {
  useCases: UseCase[]
  events: CommunityEvent[]
  questions: Question[]
  votedIds: string[]
  ready: boolean
  addUseCase: (uc: NewUseCase) => void
  toggleVote: (id: string) => void
  tagUseCase: (id: string, tags: UseCaseTagging) => void
  addEvent: (ev: Omit<CommunityEvent, 'id'>) => void
  addQuestion: (text: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)
const STORAGE_KEY = 'bgl.community.v1'

interface Persisted {
  useCases: UseCase[]
  events: CommunityEvent[]
  questions: Question[]
  votedIds: string[]
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [useCases, setUseCases] = useState<UseCase[]>(SEED_USE_CASES)
  const [events, setEvents] = useState<CommunityEvent[]>(SEED_EVENTS)
  const [questions, setQuestions] = useState<Question[]>(SEED_QUESTIONS)
  const [votedIds, setVotedIds] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  // Miroir synchrone de votedIds pour lire l'état courant dans toggleVote
  // sans imbriquer d'effet de bord dans un updater (impur → double-invoqué en Strict Mode).
  const votedRef = useRef<string[]>([])
  useEffect(() => {
    votedRef.current = votedIds
  }, [votedIds])

  // Restaure depuis localStorage au montage (mock-first).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const p = JSON.parse(raw) as Persisted
        if (p.useCases) setUseCases(p.useCases)
        if (p.events) setEvents(p.events)
        if (p.questions) setQuestions(p.questions)
        if (p.votedIds) setVotedIds(p.votedIds)
      }
    } catch {
      /* ignore données corrompues, on garde le seed */
    }
    setReady(true)
  }, [])

  // Persiste à chaque changement (une fois prêt).
  useEffect(() => {
    if (!ready) return
    const payload: Persisted = { useCases, events, questions, votedIds }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [ready, useCases, events, questions, votedIds])

  const addUseCase = useCallback((uc: NewUseCase) => {
    const id = `uc-${Date.now().toString(36)}`
    const created: UseCase = {
      id,
      title: uc.title.trim(),
      description: uc.description.trim(),
      businessUnit: uc.businessUnit,
      domaine: uc.domaine,
      votes: 1,
      submittedBy: uc.submittedBy?.trim() || 'Anonyme',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setUseCases((prev) => [created, ...prev])
    setVotedIds((prev) => [...prev, id]) // l'auteur soutient son propre cas
  }, [])

  const toggleVote = useCallback((id: string) => {
    const has = votedRef.current.includes(id)
    const delta = has ? -1 : 1
    // Deux updaters purs et indépendants (sûrs vis-à-vis du double-invoke Strict Mode).
    setVotedIds((prev) => (has ? prev.filter((v) => v !== id) : [...prev, id]))
    setUseCases((prev) => prev.map((u) => (u.id === id ? { ...u, votes: u.votes + delta } : u)))
  }, [])

  const tagUseCase = useCallback((id: string, tags: UseCaseTagging) => {
    setUseCases((prev) => prev.map((u) => (u.id === id ? { ...u, ...tags } : u)))
  }, [])

  const addEvent = useCallback((ev: Omit<CommunityEvent, 'id'>) => {
    const id = `ev-${Date.now().toString(36)}`
    setEvents((prev) => [...prev, { ...ev, id }])
  }, [])

  const addQuestion = useCallback((text: string) => {
    const id = `q-${Date.now().toString(36)}`
    setQuestions((prev) => [
      { id, text: text.trim(), askedBy: 'Anonyme', createdAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
  }, [])

  return (
    <DataContext.Provider
      value={{ useCases, events, questions, votedIds, ready, addUseCase, toggleVote, tagUseCase, addEvent, addQuestion }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans <DataProvider>')
  return ctx
}
