// Jeton d'accès dérivé du mot de passe partagé (gate de démo, §V2 auth basique).
// SHA-256 — disponible côté edge (proxy) et node (route). Le mot de passe brut
// n'est jamais stocké dans le cookie.

export const AUTH_COOKIE = 'bgl_auth'

export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`bgl-gate::${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
