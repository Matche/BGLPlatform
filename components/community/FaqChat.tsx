'use client'

import { useRef, useState } from 'react'
import { FAQ, matchFaq } from '@/lib/faq'

interface Msg {
  role: 'user' | 'bot'
  text: string
}

const GREETING: Msg = {
  role: 'bot',
  text: 'Bonjour 👋 Je réponds aux questions fréquentes sur le programme IA, les cas d’usage, les événements et la conformité. Choisissez une question ci-dessous ou tapez la vôtre.',
}

const FALLBACK =
  'Je n’ai pas de réponse toute prête à cette question. Pour un besoin précis, contactez un facilitateur ou un référent via l’onglet « Annuaire », ou proposez un cas d’usage. Vous pouvez aussi reformuler avec un mot-clé (cas d’usage, conformité, AI Act, événement…).'

// 5 suggestions mises en avant
const SUGGESTIONS = FAQ.slice(0, 5)

export default function FaqChat() {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  function scrollDown() {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    })
  }

  function ask(text: string) {
    const t = text.trim()
    if (!t) return
    const match = matchFaq(t)
    setMessages((prev) => [...prev, { role: 'user', text: t }, { role: 'bot', text: match ? match.answer : FALLBACK }])
    setInput('')
    scrollDown()
  }

  return (
    <div className="chat-wrap">
      <div className="chat-header">
        <div>
          <h2>Assistant FAQ</h2>
          <p>Réponses aux questions fréquentes sur le programme IA BGL.</p>
        </div>
        <div className="chat-ctx-pill">{FAQ.length} réponses</div>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div className={`chat-msg ${m.role === 'user' ? 'user' : 'assistant'}`} key={i}>
            <div className="chat-avatar">{m.role === 'user' ? 'U' : 'IA'}</div>
            <div className="chat-bubble">
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="suggestion-row">
        {SUGGESTIONS.map((s) => (
          <button className="suggestion" key={s.id} onClick={() => ask(s.question)}>
            {s.question}
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
              ask(input)
            }
          }}
        />
        <button className="chat-send" onClick={() => ask(input)}>
          Envoyer
        </button>
      </div>
    </div>
  )
}
