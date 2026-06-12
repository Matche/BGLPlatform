'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { AdminUser, Cohort, CohortStatus } from '@/types/cohort'
import type { Role } from '@/lib/roles'
import { SEED_COHORTS, SEED_USERS } from '@/lib/cohorts-seed'

interface NewCohort {
  name: string
  period: string
  description: string
  status: CohortStatus
}
interface NewUser {
  name: string
  email: string
  role: Role
  cohortId: string
}

interface AdminContextValue {
  cohorts: Cohort[]
  users: AdminUser[]
  ready: boolean
  addCohort: (c: NewCohort) => void
  addUser: (u: NewUser) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)
const STORAGE_KEY = 'bgl.admin.v1'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [cohorts, setCohorts] = useState<Cohort[]>(SEED_COHORTS)
  const [users, setUsers] = useState<AdminUser[]>(SEED_USERS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const p = JSON.parse(raw) as { cohorts?: Cohort[]; users?: AdminUser[] }
        // La cohorte live (isLive) reste pilotée par le seed (projets Notion) ;
        // on fusionne les cohortes mock ajoutées et les utilisateurs persistés.
        if (p.cohorts) {
          const live = SEED_COHORTS.filter((c) => c.isLive)
          const persisted = p.cohorts.filter((c) => !c.isLive)
          setCohorts([...live, ...persisted])
        }
        if (p.users) setUsers(p.users)
      }
    } catch {
      /* garde le seed */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    // On ne persiste pas la cohorte live (ses projets viennent de Notion).
    const persistable = cohorts.filter((c) => !c.isLive)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cohorts: persistable, users }))
  }, [ready, cohorts, users])

  const addCohort = useCallback((c: NewCohort) => {
    const id = `cohort-${Date.now().toString(36)}`
    setCohorts((prev) => [...prev, { id, ...c, projects: [] }])
  }, [])

  const addUser = useCallback((u: NewUser) => {
    const id = `u-${Date.now().toString(36)}`
    setUsers((prev) => [...prev, { id, ...u }])
  }, [])

  return (
    <AdminContext.Provider value={{ cohorts, users, ready, addCohort, addUser }}>{children}</AdminContext.Provider>
  )
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin doit être utilisé dans <AdminProvider>')
  return ctx
}
