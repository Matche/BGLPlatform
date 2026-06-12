// ── Rôles & espaces (PRD §5) ────────────────────────────────────────────────
// v1 : gating démo côté client via un sélecteur de rôle (pas de sécurité réelle).

export type Role = 'admin' | 'facilitateur' | 'utilisateur'

export interface SpaceDef {
  key: string
  path: string
  label: string
  /** Rôles autorisés à accéder à l'espace. */
  roles: Role[]
}

export const ROLES: { key: Role; label: string }[] = [
  { key: 'admin', label: 'Admin' },
  { key: 'facilitateur', label: 'Facilitateur IA' },
  { key: 'utilisateur', label: 'Utilisateur' },
]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  facilitateur: 'Facilitateur IA',
  utilisateur: 'Utilisateur',
}

// Matrice d'accès du PRD §5.
export const SPACES: SpaceDef[] = [
  { key: 'pilotage', path: '/pilotage', label: 'Pilotage', roles: ['admin'] },
  { key: 'facilitateur', path: '/facilitateur', label: 'Espace Facilitateur IA', roles: ['admin', 'facilitateur'] },
  { key: 'utilisateur', path: '/utilisateur', label: 'Espace utilisateur', roles: ['admin', 'utilisateur'] },
]

export function spacesForRole(role: Role): SpaceDef[] {
  return SPACES.filter((s) => s.roles.includes(role))
}

export function canAccess(role: Role, spaceKey: string): boolean {
  const s = SPACES.find((sp) => sp.key === spaceKey)
  return !!s && s.roles.includes(role)
}

/** Première route accessible pour un rôle (cible de redirection depuis `/`). */
export function defaultPathForRole(role: Role): string {
  return spacesForRole(role)[0]?.path ?? '/utilisateur'
}
