'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BglLogo from '@/components/BglLogo'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Mot de passe incorrect.')
        setLoading(false)
        return
      }
      router.replace('/')
      router.refresh()
    } catch {
      setError('Erreur de connexion. Réessayez.')
      setLoading(false)
    }
  }

  return (
    <main className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo-wrap">
          <BglLogo height={46} />
        </div>
        <div className="login-title">AI Facilitator Programme</div>
        <p className="login-sub">Cet espace est protégé. Saisissez le mot de passe d’accès.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          autoFocus
        />
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Connexion…' : 'Accéder'}
        </button>
      </form>
    </main>
  )
}
