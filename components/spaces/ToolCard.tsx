'use client'

export interface Tool {
  title: string
  objective: string
  prio: 'P0' | 'P1' | 'P2' | 'à statuer'
}

const PRIO_CLASS: Record<Tool['prio'], string> = {
  P0: 'p0',
  P1: 'p1',
  P2: 'p2',
  'à statuer': 'todo',
}

/** Carte d'outil de la boîte à outils facilitateur. Cliquable → ouvre l'outil. */
export default function ToolCard({ tool, onOpen }: { tool: Tool; onOpen?: () => void }) {
  return (
    <button className="tool-card" onClick={onOpen} disabled={!onOpen}>
      <div className="tool-card-head">
        <h3>{tool.title}</h3>
        <span className={`prio-badge ${PRIO_CLASS[tool.prio]}`}>{tool.prio}</span>
      </div>
      <p className="tool-card-obj">{tool.objective}</p>
      <div className="tool-card-foot">
        <span className="tool-card-open">Ouvrir →</span>
      </div>
    </button>
  )
}
