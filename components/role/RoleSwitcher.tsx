'use client'

import { useRouter } from 'next/navigation'
import { useRole } from '@/components/role/RoleProvider'
import { ROLES, defaultPathForRole, type Role } from '@/lib/roles'

/** Sélecteur de rôle démo (v1). À remplacer par une vraie auth en prod. */
export default function RoleSwitcher() {
  const { role, setRole } = useRole()
  const router = useRouter()

  function onChange(next: Role) {
    setRole(next)
    // Redirige vers un espace accessible si le rôle courant perd l'accès.
    router.push(defaultPathForRole(next))
  }

  return (
    <label className="role-switcher" title="Rôle (démo)">
      <span className="role-switcher-label">Rôle</span>
      <select value={role} onChange={(e) => onChange(e.target.value as Role)}>
        {ROLES.map((r) => (
          <option key={r.key} value={r.key}>
            {r.label}
          </option>
        ))}
      </select>
    </label>
  )
}
