// ── FAQ dynamique (assistant chat de l'espace utilisateur) ──────────────────
// Chat branché UNIQUEMENT sur cette liste de réponses curées (pas de LLM).

export interface FaqEntry {
  id: string
  question: string // libellé affiché en suggestion
  keywords: string[] // termes déclencheurs (sans accents)
  answer: string
}

export const FAQ: FaqEntry[] = [
  {
    id: 'proposer',
    question: 'Comment proposer un cas d’usage ?',
    keywords: ['proposer', 'soumettre', 'idee', 'cas usage', 'besoin', 'suggestion'],
    answer:
      'Depuis l’onglet « Cas d’usage » ou le bouton « Proposer un cas d’usage ». Décrivez le besoin métier, puis choisissez obligatoirement votre Business Unit et le domaine métier concerné. La communauté pourra ensuite voter pour soutenir votre idée.',
  },
  {
    id: 'voter',
    question: 'Comment voter pour un cas d’usage ?',
    keywords: ['voter', 'vote', '+1', 'soutenir', 'classement'],
    answer:
      'Dans l’onglet « Cas d’usage », cliquez sur la flèche ▲ à gauche d’un cas pour le soutenir (un vote par personne, réversible). Les cas les plus votés remontent en tête : c’est ce qui aide les facilitateurs à prioriser.',
  },
  {
    id: 'donnees-clients',
    question: 'Puis-je utiliser ChatGPT ou Copilot avec des données clients ?',
    keywords: ['chatgpt', 'copilot', 'donnees clients', 'pii', 'public', 'confidentiel', 'rgpd', 'gdpr'],
    answer:
      'Jamais sur un outil grand public. Toute donnée client (PII) doit passer par une instance dédiée (Azure OpenAI EU ou Mistral), avec une base légale validée par le DPO. Les données n’y sont pas utilisées pour entraîner le modèle du fournisseur. En cas de doute, consultez l’annuaire et sollicitez le DPO.',
  },
  {
    id: 'securite',
    question: 'Mes données sont-elles en sécurité ?',
    keywords: ['securite', 'securise', 'heberge', 'hebergement', 'cloud', 'entrainement', 'fuite'],
    answer:
      'Oui, dans le cadre prévu : hébergement en région UE (Azure OpenAI EU ou Mistral en France), instances dédiées, aucune donnée utilisée pour entraîner les modèles des fournisseurs. La responsabilité d’une décision IA incombe à BGL en tant que déployeur — d’où la validation humaine obligatoire.',
  },
  {
    id: 'aiact',
    question: 'Qu’est-ce que l’AI Act et mon projet est-il « à haut risque » ?',
    keywords: ['ai act', 'aiact', 'reglement', 'haut risque', 'high risk', 'annexe', 'fria', 'classification'],
    answer:
      'L’AI Act (règlement UE 2024/1689) classe les systèmes par niveau de risque. Sont à haut risque (Annexe III) les systèmes évaluant des personnes : recrutement, solvabilité/crédit… Ils imposent documentation, FRIA, supervision humaine et explicabilité. Un facilitateur peut qualifier votre projet via l’outil de qualification AI Act.',
  },
  {
    id: 'remplace',
    question: 'L’IA va-t-elle remplacer mon poste ?',
    keywords: ['remplacer', 'remplace', 'emploi', 'poste', 'job', 'peur', 'metier menace'],
    answer:
      'Non : les cas d’usage du programme visent à libérer du temps sur des tâches à faible valeur, pas à supprimer des rôles. L’IA rédige ou propose, le professionnel valide et signe — la responsabilité et le jugement restent humains.',
  },
  {
    id: 'facilitateur',
    question: 'Qu’est-ce qu’un facilitateur IA et comment en contacter un ?',
    keywords: ['facilitateur', 'influenceur', 'referent', 'contacter', 'qui', 'aide', 'accompagnement'],
    answer:
      'Un facilitateur IA (ou influenceur IA) est un collègue formé pour porter des cas d’usage et accompagner l’acculturation IA. Retrouvez-les, ainsi que les référents AI Act et le DPO, dans l’onglet « Annuaire ».',
  },
  {
    id: 'evenements',
    question: 'Quand a lieu le prochain Café IA ?',
    keywords: ['cafe ia', 'evenement', 'lunch', 'demo', 'prochain', 'calendrier', 'date', 'inscrire'],
    answer:
      'Les prochaines dates (Café IA, Lunch & Learn, démos trimestrielles, formations Polytechnique) sont visibles sur le tableau de bord d’accueil et dans l’onglet « Événements ».',
  },
  {
    id: 'demarrer',
    question: 'Comment démarrer un projet IA ?',
    keywords: ['demarrer', 'commencer', 'lancer', 'projet', 'poc', 'prototype', 'comment faire'],
    answer:
      'Commencez par proposer le cas d’usage ici. S’il est priorisé, un facilitateur vous accompagne : cadrage (PRD), qualification conformité, prototype rapide, puis pilote. La règle d’or : un prototype répond d’abord à une question — produit-il la valeur attendue ?',
  },
  {
    id: 'conformite',
    question: 'Qui contacter pour une question de conformité ou le DPO ?',
    keywords: ['conformite', 'dpo', 'juridique', 'compliance', 'contact', 'cssf', 'dora'],
    answer:
      'Selon le sujet : le DPO pour les données personnelles, le référent AI Act pour la classification, la Compliance pour AML/CFT/DORA. Tous figurent dans l’onglet « Annuaire ».',
  },
]

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Trouve la meilleure réponse FAQ par recouvrement de mots-clés. null si rien de pertinent. */
export function matchFaq(input: string): FaqEntry | null {
  const n = normalize(input)
  if (!n.trim()) return null
  let best: FaqEntry | null = null
  let bestScore = 0
  for (const entry of FAQ) {
    let score = 0
    for (const kw of entry.keywords) {
      if (n.includes(normalize(kw))) score += 2
    }
    // bonus si des mots de la question apparaissent
    for (const word of normalize(entry.question).split(/\W+/).filter((w) => w.length > 3)) {
      if (n.includes(word)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  return bestScore >= 2 ? best : null
}
