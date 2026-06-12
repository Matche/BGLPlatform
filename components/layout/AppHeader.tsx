'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/components/role/RoleProvider'
import { spacesForRole } from '@/lib/roles'
import RoleSwitcher from '@/components/role/RoleSwitcher'

export default function AppHeader() {
  const { role, ready } = useRole()
  const pathname = usePathname()
  const spaces = ready ? spacesForRole(role) : []

  return (
    <header className="top-header">
      <div className="brand">
        <Link href="/" className="brand-logo" style={{ textDecoration: 'none' }}>
          INS<span>KIP</span>
        </Link>
        <div className="brand-divider" />
        <div>
          <div className="brand-title">AI Facilitator Programme</div>
          <div className="brand-sub">BGL BNP · Coaching 2026</div>
        </div>
      </div>

      <nav className="top-nav">
        {spaces.map((s) => {
          const active = pathname === s.path || pathname.startsWith(s.path + '/')
          return (
            <Link key={s.key} href={s.path} className={`nav-btn ${active ? 'active' : ''}`}>
              <span className="dot" /> {s.label}
            </Link>
          )
        })}
      </nav>

      <RoleSwitcher />
    </header>
  )
}
