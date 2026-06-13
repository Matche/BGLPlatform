'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/components/role/RoleProvider'
import { spacesForRole } from '@/lib/roles'
import RoleSwitcher from '@/components/role/RoleSwitcher'
import BglLogo from '@/components/BglLogo'

export default function AppHeader() {
  const { role, ready } = useRole()
  const pathname = usePathname()
  const spaces = ready ? spacesForRole(role) : []

  return (
    <header className="top-header">
      <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
        <div>
          <div className="brand-title">AI Facilitator Programme</div>
          <div className="brand-sub">BGL BNP · Coaching 2026</div>
        </div>
      </Link>

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

      <div className="header-right">
        <RoleSwitcher />
        <BglLogo height={26} textColor="#ffffff" />
      </div>
    </header>
  )
}
