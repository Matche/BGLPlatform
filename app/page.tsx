'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/components/role/RoleProvider'
import { defaultPathForRole } from '@/lib/roles'

// Page d'entrée : redirige vers le premier espace accessible au rôle courant.
export default function Home() {
  const { role, ready } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (ready) router.replace(defaultPathForRole(role))
  }, [ready, role, router])

  return null
}
