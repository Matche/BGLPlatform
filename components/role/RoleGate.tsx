'use client'

import Link from 'next/link'
import { useRole } from '@/components/role/RoleProvider'
import { defaultPathForRole, ROLE_LABELS, type Role } from '@/lib/roles'

/**
 * Garde d'accès côté client (démo v1). Affiche le contenu si le rôle courant
 * est autorisé, sinon un message d'accès réservé.
 */
export default function RoleGate({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { role, ready } = useRole()

  if (!ready) return null // évite le flash avant restauration du rôle

  if (!allow.includes(role)) {
    return (
      <div className="access-denied">
        <div className="access-denied-card">
          <div className="access-denied-title">Accès réservé</div>
          <p>
            Cet espace est réservé aux rôles : <strong>{allow.map((r) => ROLE_LABELS[r]).join(', ')}</strong>.
            <br />
            Vous êtes actuellement connecté en tant que <strong>{ROLE_LABELS[role]}</strong>.
          </p>
          <Link className="access-denied-link" href={defaultPathForRole(role)}>
            ← Aller à mon espace
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
