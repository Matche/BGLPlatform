'use client'

import type { Project, ProjectStatus } from '@/types/project'
import { avgPct } from '@/lib/utils'

type Filter = 'all' | 'PROTOTYPE' | 'IDEATION'

const FILTERS: { key: Filter; label: string; cls: string }[] = [
  { key: 'all', label: 'Tous', cls: 'all' },
  { key: 'PROTOTYPE', label: 'Prototype', cls: 'proto' },
  { key: 'IDEATION', label: 'Idéation', cls: 'idea' },
]

export default function Sidebar({
  projects,
  curId,
  filter,
  search,
  onSelect,
  onFilter,
  onSearch,
}: {
  projects: Project[]
  curId: string
  filter: Filter
  search: string
  onSelect: (id: string) => void
  onFilter: (f: Filter) => void
  onSearch: (q: string) => void
}) {
  const list = projects.filter(
    (p) =>
      (filter === 'all' || p.status === (filter as ProjectStatus)) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Projets</div>
        <div className="sidebar-count">{list.length}</div>
      </div>

      <div className="search-box">
        <input type="text" placeholder="Rechercher…" value={search} onChange={(e) => onSearch(e.target.value)} />
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${f.cls} ${filter === f.key ? 'active' : ''}`}
            onClick={() => onFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="project-list">
        {list.map((p) => (
          <li
            key={p.id}
            className={`project-item ${p.id === curId ? 'active' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <div className="pi-name">
              {p.name}
              <span className={`status-pip ${p.status === 'PROTOTYPE' ? 'proto' : 'idea'}`}>
                {p.status === 'PROTOTYPE' ? 'PROTO' : 'IDÉA'}
              </span>
            </div>
            <div className="pi-meta">
              {avgPct(p)}% · Conf. {p.confidence}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
