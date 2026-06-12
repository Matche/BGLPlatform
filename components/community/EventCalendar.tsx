'use client'

import { useData } from '@/components/data/DataProvider'
import { FORMAT_COLOR } from '@/lib/taxonomy'
import type { CommunityEvent } from '@/types/community'

function formatDay(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return {
    day: d.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
    full: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

export default function EventCalendar() {
  const { events } = useData()
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))

  if (!sorted.length) return <div className="placeholder-panel panel">Aucun événement programmé.</div>

  return (
    <div className="event-list">
      {sorted.map((ev) => (
        <EventRow key={ev.id} ev={ev} />
      ))}
    </div>
  )
}

function EventRow({ ev }: { ev: CommunityEvent }) {
  const d = formatDay(ev.date)
  const color = FORMAT_COLOR[ev.format]
  return (
    <div className="event-row">
      <div className="event-date" style={{ borderColor: color }}>
        <div className="event-date-day">{d.day}</div>
        <div className="event-date-month">{d.month}</div>
      </div>
      <div className="event-main">
        <div className="event-head">
          <span className="event-format" style={{ background: color }}>
            {ev.format}
          </span>
          <span className="event-when">
            {d.full} · {ev.time}
          </span>
        </div>
        <h3 className="event-title">{ev.title}</h3>
        <p className="event-desc">{ev.description}</p>
        <div className="event-meta">
          <span>📍 {ev.location}</span>
          <span>· Organisé par {ev.organizer}</span>
        </div>
      </div>
    </div>
  )
}
