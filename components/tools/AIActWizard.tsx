'use client'

import { useMemo, useState } from 'react'

type Answer = 'oui' | 'non' | null

interface QuestionDef {
  key: string
  label: string
  help?: string
}

const QUESTIONS: QuestionDef[] = [
  {
    key: 'interdit',
    label: 'Le système relève-t-il d’une pratique interdite par l’AI Act ?',
    help: 'Notation sociale généralisée, manipulation subliminale, exploitation de vulnérabilités, catégorisation biométrique de données sensibles, reconnaissance des émotions au travail.',
  },
  {
    key: 'annexe3',
    label: 'Évalue-t-il des personnes physiques dans un domaine à haut risque (Annexe III) ?',
    help: 'Recrutement / évaluation de candidats, évaluation de solvabilité ou scoring crédit, accès à des services essentiels.',
  },
  {
    key: 'decision',
    label: 'Produit-il une décision ou recommandation à fort impact sur un client, sans validation humaine systématique ?',
    help: 'Ex. recommandation d’offre de crédit présentée directement au client.',
  },
  {
    key: 'interaction',
    label: 'Y a-t-il interaction directe avec une personne (chatbot) ou génération de contenu présenté à un client / au public ?',
  },
  {
    key: 'pii',
    label: 'Le système traite-t-il des données personnelles (PII) ?',
    help: 'Données clients, candidats, collaborateurs.',
  },
]

type Level = 'prohibited' | 'high' | 'limited' | 'minimal'

interface Result {
  level: Level
  label: string
  color: string
  obligations: string[]
  accompagnement: string
}

function classify(a: Record<string, Answer>): Result | null {
  // On exige au moins les 2 premières réponses pour conclure.
  if (a.interdit == null || a.annexe3 == null) return null

  if (a.interdit === 'oui') {
    return {
      level: 'prohibited',
      label: 'Pratique interdite',
      color: 'var(--magenta)',
      obligations: [
        'Arrêt immédiat : le système ne peut pas être développé ni déployé.',
        'Documenter la décision et notifier la Compliance.',
      ],
      accompagnement:
        'Stop. Reformuler le cas d’usage pour sortir du périmètre interdit, ou abandonner. Solliciter le DPO / Compliance sans délai.',
    }
  }

  const high = a.annexe3 === 'oui' || a.decision === 'oui'
  if (high) {
    return {
      level: 'high',
      label: 'Haut risque (Annexe III)',
      color: 'var(--magenta)',
      obligations: [
        'Documentation technique complète',
        'FRIA (analyse d’impact sur les droits fondamentaux)',
        'Supervision humaine continue (human-in-the-loop obligatoire)',
        'Explicabilité des décisions',
        'Enregistrement au registre UE des systèmes high-risk',
        ...(a.pii === 'oui' ? ['GDPR : base légale, privacy by design (art. 25), droit à explication (art. 22)'] : []),
      ],
      accompagnement:
        'Accompagnement renforcé Compliance + DPO dès le cadrage. Passage obligatoire en Comité IA avant déploiement. Prévoir le coût et le délai de la documentation réglementaire dans la roadmap (Jalon 0).',
    }
  }

  if (a.interaction === 'oui') {
    return {
      level: 'limited',
      label: 'Risque limité',
      color: 'var(--amber)',
      obligations: [
        'Transparence : mention explicite « assistance IA » en cas d’interaction client directe',
        'Human-in-the-loop fortement recommandé',
        ...(a.pii === 'oui' ? ['GDPR : base légale et privacy by design'] : []),
      ],
      accompagnement:
        'Obligations légères. Valider la mention de transparence avec la Compliance. Documenter le human-in-the-loop dans le PRD.',
    }
  }

  return {
    level: 'minimal',
    label: 'Risque minimal',
    color: 'var(--green)',
    obligations: [
      'Pas d’obligation spécifique au titre de l’AI Act',
      'Bonnes pratiques : hygiène des prompts, usage d’une instance dédiée pour toute donnée sensible',
      ...(a.pii === 'oui' ? ['GDPR applicable si données personnelles : base légale, minimisation'] : []),
    ],
    accompagnement:
      'Outil interne non décisionnel : accompagnement standard. Rester vigilant si le périmètre évolue vers une décision client.',
  }
}

export default function AIActWizard() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [warnings, setWarnings] = useState('')
  const [copied, setCopied] = useState(false)
  const result = useMemo(() => classify(answers), [answers])

  function set(key: string, val: Answer) {
    setAnswers((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }))
  }

  function copyResult() {
    if (!result) return
    const txt = `Qualification AI Act : ${result.label}\n\nObligations :\n${result.obligations
      .map((o) => `- ${o}`)
      .join('\n')}\n\nAccompagnement : ${result.accompagnement}\n\nWarnings / points d’attention :\n${warnings || '—'}`
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="aiact">
      <div className="aiact-questions">
        {QUESTIONS.map((q, i) => (
          <div className="aiact-q" key={q.key}>
            <div className="aiact-q-text">
              <span className="aiact-q-num">{i + 1}</span>
              <div>
                <div className="aiact-q-label">{q.label}</div>
                {q.help && <div className="aiact-q-help">{q.help}</div>}
              </div>
            </div>
            <div className="aiact-q-answers">
              <button className={`chip ${answers[q.key] === 'oui' ? 'active' : ''}`} onClick={() => set(q.key, 'oui')}>
                Oui
              </button>
              <button className={`chip ${answers[q.key] === 'non' ? 'active' : ''}`} onClick={() => set(q.key, 'non')}>
                Non
              </button>
            </div>
          </div>
        ))}
      </div>

      {result ? (
        <div className="aiact-result" style={{ borderColor: result.color }}>
          <div className="aiact-result-head" style={{ background: result.color }}>
            Qualification : {result.label}
          </div>
          <div className="aiact-result-body">
            <div className="aiact-result-section">
              <h4>Obligations</h4>
              <ul className="list-clean bullets">
                {result.obligations.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
            <div className="aiact-result-section">
              <h4>Accompagnement requis</h4>
              <p>{result.accompagnement}</p>
            </div>
            <div className="aiact-result-section">
              <h4>Warnings & points d’attention sur le projet</h4>
              <textarea
                className="aiact-warnings"
                rows={3}
                value={warnings}
                onChange={(e) => setWarnings(e.target.value)}
                placeholder="Notez ici les points de vigilance à porter au projet (bloquants, dépendances, conditions DPO…)."
              />
            </div>
            <button className="btn-primary sm" onClick={copyResult}>
              {copied ? 'Copié ✓' : 'Copier la qualification'}
            </button>
          </div>
        </div>
      ) : (
        <div className="aiact-pending">Répondez au moins aux 2 premières questions pour obtenir la qualification.</div>
      )}
    </div>
  )
}
