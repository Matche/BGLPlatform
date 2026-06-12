'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Role } from '@/lib/roles'

interface RoleContextValue {
  role: Role
  setRole: (r: Role) => void
  ready: boolean
}

const RoleContext = createContext<RoleContextValue | null>(null)
const STORAGE_KEY = 'bgl.role'

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('admin')
  const [ready, setReady] = useState(false)

  // Restaure le rôle depuis localStorage au montage (démo v1).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Role | null
    if (stored === 'admin' || stored === 'facilitateur' || stored === 'utilisateur') {
      setRoleState(stored)
    }
    setReady(true)
  }, [])

  function setRole(r: Role) {
    setRoleState(r)
    window.localStorage.setItem(STORAGE_KEY, r)
  }

  return <RoleContext.Provider value={{ role, setRole, ready }}>{children}</RoleContext.Provider>
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole doit être utilisé dans <RoleProvider>')
  return ctx
}
