// ── Bibliothèque de canevas (PRD §6.1) ──────────────────────────────────────
// Canevas remplissables calés sur les livrables des Modules 2 & 4 du certificat.
// Chaque champ porte un indice (hint) qui transmet le cadre méthodologique.

export interface CanvasField {
  label: string
  hint: string
  rows?: number
}

export interface CanvasDef {
  id: string
  title: string
  source: string // d'où vient le canevas (module)
  description: string
  fields: CanvasField[]
}

export const CANVASES: CanvasDef[] = [
  {
    id: 'prd',
    title: 'PRD — Product Requirements Document',
    source: 'Module 4 · Phase 1',
    description:
      'Document vivant, concis et opérationnel. Règle d’or : si un data scientist ne peut pas démarrer après l’avoir lu, il est trop vague ; si un compliance officer ne peut pas l’auditer, il est trop technique.',
    fields: [
      { label: '1. Quel problème résout-on, exactement ?', hint: 'Le point de douleur métier précis, en 2 phrases. Pas la solution.', rows: 2 },
      { label: '2. Pour qui ?', hint: 'L’utilisateur final (pas le sponsor) et sa tolérance à l’erreur.', rows: 2 },
      { label: '3. Avec quelles données ?', hint: 'Disponibles, accessibles, conformes. Identifier la donnée la plus fragile du flux.', rows: 2 },
      { label: '4. Quel flux de traitement ?', hint: 'Renvoyer au Data Flow Diagram (canevas dédié).', rows: 2 },
      { label: '5. Comment sait-on que ça marche ?', hint: '2 KPI métier + 1 KPI IA, mesurables. Sortie = brouillon, recommandation ou décision ?', rows: 3 },
    ],
  },
  {
    id: 'dfd',
    title: 'Data Flow Diagram',
    source: 'Module 4 · Phase 1',
    description:
      'Le voyage de la donnée, de la source à la sortie. Composant technique clé du PRD. Privacy by design (RGPD art. 25).',
    fields: [
      { label: '1. Source de données brute', hint: 'CRM, PDF, emails, bases structurées. Présence de PII ? Secret bancaire applicable ?', rows: 2 },
      { label: '2. Anonymisation', hint: 'Masquage des identifiants directs avant traitement.', rows: 1 },
      { label: '3. Traitement', hint: 'Parsing, chunking, indexation RAG si nécessaire. La qualité des données fait ou défait le projet.', rows: 2 },
      { label: '4. LLM privé', hint: 'Azure OpenAI EU ou Mistral. Données NON utilisées pour entraîner le modèle du fournisseur.', rows: 1 },
      { label: '5. Sortie structurée', hint: 'Brouillon, synthèse, recommandation — explicitement étiquetée « aide à la décision IA ».', rows: 2 },
      { label: '6. Validation humaine', hint: 'L’employé lit, modifie, approuve. Obligatoire pour toute décision affectant un client.', rows: 2 },
    ],
  },
  {
    id: 'prototype',
    title: 'Brief de prototype + critères go/no-go',
    source: 'Module 4 · Phase 1',
    description:
      'Un prototype coûte 2 jours, un mauvais développement 3 mois. Il répond à une seule question : produit-il la valeur attendue ?',
    fields: [
      { label: 'System prompt', hint: 'Rôle + Contexte + Instruction + Contrainte (format, ton, ce qui ne doit pas être inventé).', rows: 4 },
      { label: 'Donnée d’entrée (anonymisée)', hint: 'Un échantillon réel anonymisé pour tester maintenant.', rows: 2 },
      { label: 'Sortie attendue', hint: 'Format précis. L’utilisateur la lit en 30 s ou en 5 min ? Ça change tout.', rows: 2 },
      {
        label: 'Critères de sortie go/no-go',
        hint: 'Utilisabilité (≥60 % acceptés sans retouche) · Hallucinations (tolérance selon usage) · Cohérence (≥10 cas testés) · Adoption (NPS test > 0).',
        rows: 3,
      },
    ],
  },
  {
    id: 'roadmap',
    title: 'Roadmap 4 phases (horizon 18 mois)',
    source: 'Module 4 · Phase 2',
    description:
      '88 % des projets IA bancaires n’atteignent jamais la production. Le frein n’est pas technique : il est organisationnel. Lancer le Data Stream en Phase 0, pas Phase 1.',
    fields: [
      { label: 'Phase 0 — Cadrage & préparation données', hint: 'Durée, 2 livrables, 1 critère go/no-go. PRD validé + DFD signé, accès données validé, PO & champion nommés.', rows: 2 },
      { label: 'Phase 1 — MVP / POC technique', hint: 'Durée, livrables (prototype fonctionnel, rapport de test, sortie utilisable).', rows: 2 },
      { label: 'Phase 2 — Pilote', hint: 'NPS interne > 0, adoption > 40 %, KPI mesurés.', rows: 2 },
      { label: 'Phase 3 — Industrialisation', hint: 'Intégration systèmes, déploiement progressif, monitoring.', rows: 2 },
      { label: 'Premier bloquant identifié + responsable', hint: 'Quel risque peut tout bloquer en Phase 2 ? Qui le surveille ?', rows: 2 },
    ],
  },
  {
    id: 'roi',
    title: 'ROI — méthode en 4 étapes',
    source: 'Module 4 · Phase 3',
    description:
      'Si vous ne savez pas mesurer la valeur aujourd’hui, le cas d’usage n’est pas assez précis. Cible : ROI > 150 % sur 24 mois (BCG 2025). Honnêteté intellectuelle : n’inclure que ce qui est mesurable.',
    fields: [
      { label: '1. Valeur créée', hint: 'Gains de productivité (temps libéré × coût horaire × volume) + création de valeur directe (revenus, coûts évités).', rows: 3 },
      { label: '2. Coûts totaux', hint: 'Build (dev, intégration, formation) + Run annuel (tokens, hébergement, maintenance) + coûts cachés (conformité 10-20 %, données 15-25 %, conduite du changement 20-35 %).', rows: 3 },
      { label: '3. Calcul ROI', hint: 'ROI = (Valeur − Coût total) / Coût total × 100.', rows: 1 },
      { label: '4. Horizon de payback', hint: 'Banque : 12-18 mois typique. < 6 mois → souvent abandonné. Budgéter 30-50 % du Build annualisé en Run annuel.', rows: 2 },
    ],
  },
  {
    id: 'risques',
    title: 'Matrice des risques (7 risques, 4 niveaux)',
    source: 'Module 4 · Phase 3',
    description:
      'Les 7 risques de l’IA générative et leur mitigation. Tous gérables avec gouvernance, monitoring et mesures appropriées.',
    fields: [
      { label: 'Hallucination & conseil erroné', hint: 'Niveau ? Mitigation : human-in-the-loop obligatoire, prompt avec instruction de sourcing.', rows: 2 },
      { label: 'Fuite de données (PII / secret bancaire)', hint: 'Niveau ? Mitigation : usage exclusif d’une instance Azure OpenAI dédiée.', rows: 1 },
      { label: 'Injection de prompt', hint: 'Niveau ? Mitigation : validation des sources, system prompt défensif, red teaming.', rows: 1 },
      { label: 'Biais algorithmique & discrimination', hint: 'Niveau ? Mitigation : tests de biais (SHAP, LIME), FRIA pour high-risk.', rows: 1 },
      { label: 'Dépendance fournisseur, confidentialité prompt, sur-confiance', hint: 'Niveaux + mitigations (multi-modèle, hygiène prompt, formation esprit critique + KPI taux de modification).', rows: 3 },
    ],
  },
  {
    id: 'premortem',
    title: 'Pre-Mortem',
    source: 'Module 4 · Phase 3',
    description:
      'Imaginez : octobre 2026, le projet est officiellement un échec, le sponsor a coupé le budget. La question n’est pas « si » mais « pourquoi ». Identifions les causes maintenant.',
    fields: [
      { label: 'Cause d’échec technique probable', hint: 'Données indisponibles/mal structurées, hallucinations, connecteurs surchargés.', rows: 2 },
      { label: 'Cause d’échec humaine probable', hint: 'Non-adoption, départ du champion BU, formation insuffisante.', rows: 2 },
      { label: 'Cause données / juridique probable', hint: 'Format source changé, droits d’accès révoqués, classification AI Act revue à la hausse, FRIA non produite à temps.', rows: 2 },
      { label: '2 mesures préventives + responsable + indicateur d’alerte précoce', hint: 'Pour les 2 causes les plus probables.', rows: 3 },
    ],
  },
  {
    id: 'raci',
    title: 'Matrice RACI',
    source: 'Module 4 · Phase 4',
    description:
      'Principe immuable : un seul « A » (Accountable) par activité. Si tout le monde est responsable, personne ne l’est. R=Responsible, A=Accountable, C=Consulted, I=Informed.',
    fields: [
      { label: 'Cadrage & PRD', hint: 'Business Expert (RA), Data Scientist (C), PO (C), Compliance/DPO (C), Comité IA (I).', rows: 1 },
      { label: 'Développement & tests', hint: 'Qui est R ? A ? C ? I ?', rows: 1 },
      { label: 'Validation prototype', hint: 'Qui est R ? A ? C ? I ?', rows: 1 },
      { label: 'Classification AI Act', hint: 'Compliance/DPO généralement A ; PO co-porteur de la documentation réglementaire.', rows: 1 },
      { label: 'Déploiement pilote & monitoring production', hint: 'PO souvent A ; Data Scientist R.', rows: 2 },
    ],
  },
  {
    id: 'deck-sponsor',
    title: 'Deck sponsor (6 slides, 10 min)',
    source: 'Module 4 · Partie 2',
    description:
      'Les 3 slides qui gagnent ou perdent une décision € : Problème, Valeur, Ask. Le plus dur n’est pas d’expliquer — c’est de choisir quoi ne PAS dire. Plus de 90 s sur l’archi = attention perdue.',
    fields: [
      { label: 'Slide 1 — Le problème', hint: 'Douleur ressentie en 90 secondes. Quelle tâche prend combien de temps aujourd’hui ? Coût de l’erreur actuelle ?', rows: 2 },
      { label: 'Slide 2 — La valeur créée', hint: 'UN chiffre défendable, méthode de calcul visible. Pas cinq métriques optimistes.', rows: 2 },
      { label: 'Slide 3 — L’ask', hint: 'Budget, ressource, décision go/no-go. Une demande précise, pas un diagramme de Gantt.', rows: 2 },
      { label: 'Slides 4-6 (optionnelles)', hint: 'Roadmap, données/archi (< 90 s), gouvernance & risques. À n’utiliser que si le temps le permet.', rows: 2 },
    ],
  },
]

export function getCanvas(id: string): CanvasDef | undefined {
  return CANVASES.find((c) => c.id === id)
}
