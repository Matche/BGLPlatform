'use client'

import { useRef, useState } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    'Bonjour, je suis votre assistant pour le Reporting Coaching BGL BNP 2026. Je connais les projets du programme — statuts, avancements, axes, warnings et prochaines étapes.',
}

const SUGGESTIONS = [
  'Projets les plus avancés ?',
  'Blocages critiques',
  'Projets sans sponsor',
  'État de la conformité',
  'Warnings de RM Briefing',
]

/** Rendu texte minimal et sûr : paragraphes + listes à puces, sans HTML brut. */
function renderContent(content: string) {
  const lines = content.split('\n').filter((l) => l.trim())
  const blocks: React.ReactNode[] = []
  let bullets: string[] = []

  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>,
      )
      bullets = []
    }
  }

  for (const line of lines) {
    const t = line.trim()
    if (/^[-•*]\s+/.test(t)) {
      bullets.push(t.replace(/^[-•*]\s+/, ''))
    } else {
      flush()
      blocks.push(<p key={`p-${blocks.length}`}>{t}</p>)
    }
  }
  flush()
  return blocks
}

export default function ChatView({ projectCount }: { projectCount: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  function scrollDown() {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    })
  }

  async function send(text: string) {
    const t = text.trim()
    if (!t || loading) return
    const next = [...messages, { role: 'user' as const, content: t }]
    setMessages(next)
    setInput('')
    setLoading(true)
    scrollDown()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: next.slice(1) }), // on retire le message d'accueil
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.content || 'Désolé, aucune réponse.' }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Erreur de connexion à l’assistant. Réessayez.' }])
    } finally {
      setLoading(false)
      scrollDown()
    }
  }

  return (
    <section className="view-section active">
      <div className="chat-wrap">
        <div className="chat-header">
          <div>
            <h2>Chat reporting — BGL BNP</h2>
            <p>Posez vos questions sur les {projectCount} projets coachés.</p>
          </div>
          <div className="chat-ctx-pill">{projectCount} projets en contexte</div>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div className={`chat-msg ${m.role}`} key={i}>
              <div className="chat-avatar">{m.role === 'user' ? 'M' : 'I'}</div>
              <div className="chat-bubble">{renderContent(m.content)}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg assistant">
              <div className="chat-avatar">I</div>
              <div className="chat-bubble">
                <div className="thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="suggestion-row">
          {SUGGESTIONS.map((s) => (
            <button className="suggestion" key={s} onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <textarea
            value={input}
            placeholder="Votre question…"
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
          />
          <button className="chat-send" onClick={() => send(input)} disabled={loading}>
            Envoyer
          </button>
        </div>
      </div>
    </section>
  )
}
