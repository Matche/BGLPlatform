// ── Annuaire IA (espace utilisateur) ────────────────────────────────────────
// Facilitateurs IA + référents AI Act / conformité. Données de démo : compléter
// avec les contacts internes réels BGL.

export interface DirectoryEntry {
  name: string
  role: string
  scope: string // sujets / périmètre
  unit: string
  contact?: string // email ou Teams — à compléter
}

export const FACILITATEURS: DirectoryEntry[] = [
  { name: 'Victor Dilion', role: 'Facilitateur IA', scope: 'Cartographie de procédures, RAG', unit: 'Transformation', contact: '— à compléter —' },
  { name: 'Pierre-Etienne Staes', role: 'Facilitateur IA', scope: 'Développement, graphes, RAG', unit: 'IT / Data', contact: '— à compléter —' },
  { name: 'Sylvain Sarda', role: 'Facilitateur IA', scope: 'Référent métier Transformation', unit: 'Transformation', contact: '— à compléter —' },
  { name: 'Yu-Ying Chap', role: 'Facilitateur IA', scope: 'Relation client, synthèse RM', unit: 'Banque de détail', contact: '— à compléter —' },
  { name: 'Najla Ben Salem', role: 'Facilitateur IA', scope: 'Conformité, AML, qualification d’alertes', unit: 'Risk & Compliance', contact: '— à compléter —' },
  { name: 'Samir Haddad', role: 'Facilitateur IA', scope: 'Crédit, scoring, aide à la décision', unit: 'Banque Privée / Wealth', contact: '— à compléter —' },
]

export const REFERENTS: DirectoryEntry[] = [
  { name: '— à compléter —', role: 'DPO', scope: 'Données personnelles, base légale, FRIA, GDPR', unit: 'BGL BNP', contact: '— à compléter —' },
  { name: '— à compléter —', role: 'Référent AI Act', scope: 'Classification (haut / limité), documentation technique', unit: 'Risk & Compliance', contact: '— à compléter —' },
  { name: '— à compléter —', role: 'Compliance Officer', scope: 'AML / CFT, CSSF, DORA', unit: 'Risk & Compliance', contact: '— à compléter —' },
  { name: '— à compléter —', role: 'CISO', scope: 'Sécurité des flux, injection de prompt', unit: 'IT Security', contact: '— à compléter —' },
  { name: '— à compléter —', role: 'Comité IA', scope: 'Arbitrage, validation des cas d’usage high-risk', unit: 'Direction', contact: '— à compléter —' },
]
