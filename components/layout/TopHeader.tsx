'use client'

import type { ViewKey } from '@/components/Dashboard'

const NAV: { key: ViewKey; label: string }[] = [
  { key: 'macro', label: 'Vue macro' },
  { key: 'detail', label: 'Vue projet' },
  { key: 'chat', label: 'Chat' },
]

export default function TopHeader({
  view,
  onView,
  reportTag,
}: {
  view: ViewKey
  onView: (v: ViewKey) => void
  reportTag: string
}) {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="brand-logo">
          INS<span>KIP</span>
        </div>
        <div className="brand-divider" />
        <div>
          <div className="brand-title">AI Facilitator Programme</div>
          <div className="brand-sub">BGL BNP · Coaching 2026</div>
        </div>
      </div>
      <nav className="top-nav">
        {NAV.map((n) => (
          <button key={n.key} className={`nav-btn ${view === n.key ? 'active' : ''}`} onClick={() => onView(n.key)}>
            <span className="dot" /> {n.label}
          </button>
        ))}
      </nav>
      <span className="report-tag-pill">Reporting {reportTag}</span>
    </header>
  )
}
