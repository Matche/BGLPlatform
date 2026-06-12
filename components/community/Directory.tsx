'use client'

import { FACILITATEURS, REFERENTS, type DirectoryEntry } from '@/lib/directory'
import { getInitials } from '@/lib/utils'

function Card({ e, accent }: { e: DirectoryEntry; accent: string }) {
  const known = e.name !== '— à compléter —'
  return (
    <div className="dir-card">
      <div className="dir-avatar" style={{ background: accent }}>
        {known ? getInitials(e.name) : '?'}
      </div>
      <div className="dir-body">
        <div className="dir-name">{known ? e.name : e.role}</div>
        <div className="dir-role">{known ? e.role : 'Référent à désigner'}</div>
        <div className="dir-scope">{e.scope}</div>
        <div className="dir-meta">
          {e.unit}
          {e.contact && ` · ${e.contact}`}
        </div>
      </div>
    </div>
  )
}

export default function Directory() {
  return (
    <div>
      <section style={{ marginBottom: 22 }}>
        <div className="section-title">Facilitateurs IA</div>
        <p className="section-intro">
          Collègues formés pour porter des cas d’usage et accompagner l’acculturation IA. Sollicitez-les pour cadrer une
          idée ou être accompagné.
        </p>
        <div className="dir-grid">
          {FACILITATEURS.map((e, i) => (
            <Card key={i} e={e} accent="var(--green)" />
          ))}
        </div>
      </section>

      <section>
        <div className="section-title">Référents AI Act & conformité</div>
        <p className="section-intro">
          À solliciter selon le sujet : données personnelles, classification AI Act, AML / DORA, sécurité.
        </p>
        <div className="dir-grid">
          {REFERENTS.map((e, i) => (
            <Card key={i} e={e} accent="var(--slate)" />
          ))}
        </div>
      </section>
    </div>
  )
}
