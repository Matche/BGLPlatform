import type { ToolGuide } from '@/lib/tools/types'

// ── Contenu des outils-guides ────────────────────────────────────────────────
// Prolonge les Modules 2 & 4 du certificat. Ancrage Luxembourg (CSSF, AI Act,
// DORA, GDPR) + playbooks actionnables. FR.

const KIT_ONBOARDING_POC: ToolGuide = {
  slug: 'kit-onboarding-poc',
  title: 'Kit d’onboarding POC',
  subtitle: 'Réussir son POC et embarquer progressivement les premiers utilisateurs',
  intro:
    'Seuls 5 à 15 % des POC bancaires deviennent des outils industriels (Module 2). Le « POC syndrome » tue les projets qui restent au laboratoire. Ce kit vise une chose : un POC qui produit de la valeur démontrable et qui réunit ses premiers utilisateurs dès le départ.',
  sections: [
    {
      type: 'callout',
      variant: 'rule',
      title: 'Règle d’or',
      body:
        'Un prototype coûte 2 jours, un mauvais développement 3 mois. Le POC répond à une seule question : produit-il la valeur attendue ? On ne construit la suite qu’après l’avoir prouvé.',
    },
    {
      type: 'steps',
      heading: 'Les 4 étapes de cadrage',
      steps: [
        { title: '1. Périmètre', detail: 'Une tâche, un format de sortie, un type de donnée. Trop large = jamais fini. Exclure explicitement ce qui n’est pas dans le POC.' },
        { title: '2. Objectif & critères de réussite', detail: 'Définir AVANT de commencer : ≥ 60 % de sorties acceptées sans retouche, NPS test > 0 sur ≥ 10 cas réels anonymisés.' },
        { title: '3. Durée', detail: 'Mockup fonctionnel : 1-2 jours. Prototype prompt : 2-3 jours. POC technique : 1-2 semaines. Pas plus pour un premier cycle.' },
        { title: '4. Jalons de suivi', detail: 'Un point go/no-go à mi-parcours et un à la fin. Documenter ce qui marche, ce qui bloque, et la décision.' },
      ],
    },
    {
      type: 'canvasRef',
      heading: 'Canevas associé',
      canvasId: 'prototype',
      note: 'Remplir le brief de prototype (system prompt + sortie attendue + critères go/no-go) avant de lancer le POC.',
    },
    {
      type: 'steps',
      heading: 'Sélection des premiers utilisateurs, puis montée en charge',
      steps: [
        { title: 'Cercle 1 — Pionniers (2-3 volontaires)', detail: 'Les plus curieux et respectés. Ils testent, remontent les bugs, sont visibles dans l’usage. C’est ici que se construit la preuve de valeur.' },
        { title: 'Cercle 2 — Pragmatiques (30-40 %)', detail: 'Adoptent une fois la valeur validée par les pionniers. Objectif : atteindre la masse critique, normaliser l’usage.' },
        { title: 'Cercle 3 — Suiveurs', detail: 'Adoptent quand tout le monde utilise l’outil. Objectif : couverture complète.' },
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Ce qu’il ne faut PAS faire',
      body:
        'Déployer à tous d’un coup (résistance massive), imposer sans démontrer la valeur (rejet), laisser les résistants monopoliser la parole (l’influence négative se propage).',
    },
    {
      type: 'template',
      heading: 'Support de communication — message d’embarquement',
      label: 'À adapter et envoyer aux premiers utilisateurs',
      body:
        'Objet : Tu es invité·e à tester [nom de l’outil]\n\nBonjour [Prénom],\n\nTu fais partie des premiers à tester [outil], qui vise à [bénéfice concret : ex. te faire gagner 1h30/semaine sur la synthèse client].\n\nCe que je te demande : l’utiliser sur [tâche précise] pendant [2 semaines] et me dire, sans filtre, ce qui marche et ce qui ne marche pas. Tu as explicitement le droit de te tromper et de critiquer — c’est même l’objectif.\n\nRappel important : l’IA rédige, c’est toi qui valides et signes. La responsabilité reste humaine.\n\nUn point de 15 min après 2 semaines pour mesurer ensemble. Merci !',
    },
    {
      type: 'checklist',
      heading: 'Checklist de lancement du POC',
      items: [
        'Périmètre écrit en 2 phrases, avec ce qui est exclu',
        'Critères de réussite chiffrés définis AVANT de commencer',
        'Données anonymisées disponibles pour tester maintenant',
        '2-3 utilisateurs pionniers identifiés et volontaires',
        'Validation humaine intégrée dans le flux testé (human-in-the-loop)',
        'Un sponsor/champion visible qui soutient le test',
        'Date de point go/no-go fixée',
      ],
    },
  ],
}

const KIT_FEEDBACK: ToolGuide = {
  slug: 'kit-recueil-feedback',
  title: 'Kit de recueil de feedback',
  subtitle: 'Tracer les retours utilisateurs et alimenter l’optimisation continue',
  intro:
    'Un prompt parfait aujourd’hui peut produire des sorties dégradées dans 6 mois si les données ou les usages changent. Le feedback n’est pas une formalité de fin de pilote : c’est le carburant de l’amélioration continue et l’indicateur de santé de l’adoption.',
  sections: [
    {
      type: 'callout',
      variant: 'tip',
      title: 'L’indicateur central',
      body:
        'Le NPS interne à 3 mois. S’il est négatif, le problème est la qualité de l’outil, la qualité de la formation, ou les deux. Cible : > 0 à 6 mois, > +30 à 12 mois.',
    },
    {
      type: 'steps',
      heading: 'Le mécanisme de signalement (à la main de l’utilisateur)',
      steps: [
        { title: 'Simple et immédiat', detail: 'Un bouton « 👍 / 👎 » sur chaque sortie de l’IA, optionnellement suivi d’un champ libre. L’utilisateur signale en 2 secondes sans quitter sa tâche.' },
        { title: 'Capturer le contexte', detail: 'Enregistrer automatiquement l’entrée (anonymisée), la sortie et le type de problème (faux, incomplet, mal formaté, hallucination).' },
        { title: 'Boucler', detail: 'Chaque signalement doit avoir un responsable de traitement et un délai. Un feedback sans suite décourage les suivants.' },
      ],
    },
    {
      type: 'template',
      heading: 'Formulaire de retour structuré',
      label: 'Questions à poser après 2 semaines d’usage',
      body:
        '1. Sur 10, à quel point recommanderais-tu cet outil à un collègue ? (NPS)\n2. Combien de temps estimes-tu gagner par semaine grâce à l’outil ?\n3. Quelle proportion des sorties utilises-tu sans modification majeure ?\n4. Cite 1 cas où l’outil t’a clairement aidé.\n5. Cite 1 cas où il s’est trompé ou t’a fait perdre du temps.\n6. Qu’est-ce qui te ferait l’utiliser tous les jours ?',
    },
    {
      type: 'table',
      heading: 'Tableau de suivi des retours et incohérences',
      columns: ['Date', 'Utilisateur', 'Type', 'Description', 'Gravité', 'Action', 'Responsable', 'Statut'],
      rows: [
        ['JJ/MM', 'RM pilote', 'Hallucination', 'Montant inventé dans la synthèse', 'Élevée', 'Renforcer contrainte de sourcing dans le prompt', 'PO', 'En cours'],
        ['JJ/MM', 'Analyste', 'Format', 'Sortie trop longue, non scannable en 30 s', 'Moyenne', 'Imposer format en 5 puces', 'Data Scientist', 'Résolu'],
      ],
    },
    {
      type: 'callout',
      variant: 'rule',
      title: 'KPI à suivre en continu',
      body:
        'Taux de modification des sorties (signal de sur-confiance ou de qualité), taux d’adoption (> 40 % en pilote), NPS interne. Ces trois indicateurs racontent l’histoire de l’adoption mieux que n’importe quelle démo.',
    },
  ],
}

const PARCOURS_JALONS: ToolGuide = {
  slug: 'parcours-jalons',
  title: 'Parcours par jalons (stage gate)',
  subtitle: 'De l’idée à la présentation sponsor — checklist et pièces attendues par jalon',
  intro:
    'Un projet IA n’est pas une séquence de tâches mais 4 flux parallèles (Tech/Produit, Données, Conduite du changement, Conformité) qui se conditionnent. Si un flux prend du retard, tout le projet prend du retard. Le Data Stream est systématiquement sous-estimé : il se lance en premier.',
  sections: [
    {
      type: 'steps',
      heading: 'Les 5 jalons (horizon 18-24 mois)',
      steps: [
        { title: 'Jalon 0 — Cadrage & données (1-2 mois)', detail: 'Sortie : PRD validé + DFD signé, accès aux données validé, PO & champion nommés.' },
        { title: 'Jalon 1 — MVP / POC technique (1-2 mois)', detail: 'Sortie : prototype fonctionnel, rapport de test, sortie utilisable. Décision go/no-go avant d’investir.' },
        { title: 'Jalon 2 — Pilote (2-3 mois)', detail: 'Sortie : NPS interne > 0, adoption > 40 %, KPI mesurés sur le terrain.' },
        { title: 'Jalon 3 — Industrialisation (3-4 mois)', detail: 'Sortie : intégration aux systèmes, déploiement progressif, monitoring en place.' },
        { title: 'Jalon 4 — Scale & Run (continu)', detail: 'Amélioration continue, ré-entraînement périodique, piste d’audit.' },
      ],
    },
    {
      type: 'checklist',
      heading: 'Checklist — passage du Jalon 0 au Jalon 1',
      items: [
        'PRD complet (5 questions) validé par toutes les parties prenantes',
        'Data Flow Diagram signé, donnée la plus fragile identifiée',
        'Accès aux données source confirmé (pas promis : confirmé)',
        'Classification AI Act soumise à la Compliance',
        'Sponsor C-level identifié et actif',
        'Champion terrain désigné (le plus respecté, pas le manager)',
      ],
    },
    {
      type: 'checklist',
      heading: 'Checklist — passage du Jalon 1 au Jalon 2 (pilote)',
      items: [
        '≥ 60 % de sorties acceptées sans retouche substantielle',
        'Taux d’hallucination acceptable pour l’usage (zéro tolérance si client-facing)',
        'Test sur ≥ 10 cas réels anonymisés, résultat reproductible',
        'NPS de test > 0 : l’utilisateur VEUT utiliser l’outil',
        'Budget Run estimé (30-50 % du Build annualisé)',
        'Pre-Mortem réalisé, 2 mesures préventives assignées',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Lien avec le pilotage',
      body:
        'Ce parcours alimente la vue micro de l’espace pilotage : chaque jalon franchi met à jour l’avancement et les scores du projet. Les pièces attendues (PRD, DFD, ROI…) sont les canevas de la bibliothèque.',
    },
    {
      type: 'canvasRef',
      heading: 'Pièces attendues',
      canvasId: 'roadmap',
      note: 'La roadmap 4 phases est la pièce maîtresse du passage de jalon. Voir aussi PRD, DFD, ROI, Pre-Mortem, RACI dans la bibliothèque.',
    },
  ],
}

const ANNUAIRE_CONFORMITE: ToolGuide = {
  slug: 'annuaire-conformite',
  title: 'Annuaire conformité',
  subtitle: 'DPO, référents règlement IA et points de contact à solliciter selon le sujet',
  intro:
    'La responsabilité d’une décision IA erronée incombe au déployeur — BGL — et non au fournisseur du modèle (Microsoft, Mistral). Savoir qui solliciter, et quand, est la première compétence de conformité du facilitateur. Cet annuaire est un gabarit : à compléter avec les contacts internes BGL.',
  sections: [
    {
      type: 'callout',
      variant: 'warning',
      title: 'Réflexe à ancrer',
      body:
        'Impliquer la Compliance dès le PRD, jamais à la veille du déploiement (barrière n°2 des projets IA). Une classification AI Act revue à la hausse en fin de parcours peut tout bloquer.',
    },
    {
      type: 'table',
      heading: 'Qui solliciter selon le sujet',
      columns: ['Sujet', 'Interlocuteur', 'Quand le solliciter'],
      rows: [
        ['Classification AI Act (high / limited risk)', 'DPO / Compliance', 'Dès la phase de cadrage (Jalon 0)'],
        ['Accès à des données personnelles clients', 'DPO', 'Avant tout prototype utilisant des PII'],
        ['Base légale / consentement (ex. emails clients)', 'Juridique + DPO', 'Au cadrage du flux de données'],
        ['Sécurité du flux & injection de prompt', 'CISO', 'À la conception du Data Flow'],
        ['DORA — registre tiers, clauses contractuelles', 'Compliance / Risk', 'Avant contractualisation Azure/Mistral'],
        ['FRIA (high-risk Annexe III)', 'DPO / Compliance', 'Avant industrialisation d’un projet high-risk'],
        ['Hébergement & résidence des données (EU)', 'IT / DevOps + DPO', 'Au choix de l’infrastructure'],
      ],
    },
    {
      type: 'table',
      heading: 'Référents internes BGL (à compléter)',
      columns: ['Rôle', 'Nom', 'Périmètre', 'Contact'],
      rows: [
        ['DPO', '— à compléter —', 'GDPR, données personnelles, FRIA', '—'],
        ['Référent AI Act', '— à compléter —', 'Classification, documentation technique', '—'],
        ['Compliance Officer', '— à compléter —', 'AML/CFT, CSSF, DORA', '—'],
        ['CISO', '— à compléter —', 'Sécurité, injection de prompt', '—'],
        ['Comité IA', '— à compléter —', 'Arbitrage, validation high-risk', '—'],
      ],
    },
    {
      type: 'callout',
      variant: 'rule',
      title: 'Cadre réglementaire luxembourgeois',
      body:
        'AI Act (UE 2024/1689) : high-risk dès août 2026. DORA en vigueur depuis janvier 2025 : registre des tiers, incidents ICT majeurs notifiés sous 24 h. CSSF : autorité de tutelle. GDPR art. 22 (décision automatisée) et art. 25 (privacy by design).',
    },
  ],
}

const KIT_AMBASSADEUR: ToolGuide = {
  slug: 'kit-ambassadeur',
  title: 'Kit ambassadeur clé en main',
  subtitle: 'Trames d’animation et supports de partage pour acculturer ses collègues',
  intro:
    'La résistance au changement n’est pas de la mauvaise volonté : c’est une réaction normale à une menace perçue sur le territoire, la compétence ou l’identité professionnelle. Le rôle d’ambassadeur consiste à transformer cette résistance en adoption, par la preuve et l’écoute — pas par l’injonction.',
  sections: [
    {
      type: 'steps',
      heading: 'Désamorcer les 3 peurs les plus courantes',
      steps: [
        { title: '« Je vais être remplacé »', detail: 'Réalité : les cas d’usage BGL libèrent du temps sur des tâches à faible valeur, ils ne suppriment pas les rôles. Montrer le temps regagné, pas la machine.' },
        { title: '« Je ne saurai pas l’utiliser »', detail: 'Réalité : un bon prototype s’utilise sans formation technique. Donner un droit explicite à l’erreur pendant l’onboarding.' },
        { title: '« Si l’IA se trompe, je serai responsable »', detail: 'Réalité : c’est vrai, et c’est pourquoi le human-in-the-loop est essentiel. L’IA rédige, le professionnel signe.' },
      ],
    },
    {
      type: 'table',
      heading: 'Adapter son approche au profil de résistance',
      columns: ['Profil', 'Ce qu’il dit', 'Comment l’embarquer'],
      rows: [
        ['Le sceptique rationnel', '« Ça ne marchera pas avec nos données / systèmes »', 'En faire un testeur critique officiel. Démontrer avec de vraies données BGL anonymisées, pas des benchmarks externes.'],
        ['L’anxieux identitaire', '« 20 ans d’expérience, l’IA ne remplace pas ça »', 'Recadrer en outil d’amplification. Lui donner un rôle de validateur senior — prestige, pas rétrogradation.'],
      ],
    },
    {
      type: 'template',
      heading: 'Trame d’animation — Café IA (45 min)',
      label: 'Format informel d’acculturation entre pairs',
      body:
        '0-5 min — Accueil, tour de table express : « un usage IA que tu as testé cette semaine ».\n5-20 min — Démo d’un cas d’usage BGL réel (le vôtre ou celui d’un pair), sur données anonymisées.\n20-35 min — Atelier : chacun note 1 tâche chronophage de son quotidien ; on identifie ensemble lesquelles sont des candidats IA.\n35-43 min — Rappel des règles d’or (human-in-the-loop, données via instance dédiée, validation DPO).\n43-45 min — Prochaine étape : proposer son cas d’usage dans l’espace utilisateur.',
    },
    {
      type: 'template',
      heading: 'Support de partage — message d’acculturation',
      label: 'Pour un canal interne (Teams, intranet)',
      body:
        '💡 Cette semaine en IA chez BGL\n\nUn cas d’usage qui avance : [nom] — [bénéfice en 1 phrase chiffrée].\n\nLe réflexe conformité du mois : [ex. toute donnée client passe par une instance dédiée, jamais un LLM public].\n\nUne idée de cas d’usage ? Proposez-la et votez dans l’espace utilisateur de la plateforme. Les plus soutenues sont qualifiées par les facilitateurs.\n\nProchain Café IA : [date].',
    },
    {
      type: 'callout',
      variant: 'rule',
      title: 'La règle du champion',
      body:
        'Chaque projet a besoin d’un champion visible — pas le manager, mais l’expert terrain le plus respecté, converti en premier utilisateur et ambassadeur. Respecté par ses pairs, early adopter, actif.',
    },
  ],
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  'kit-onboarding-poc': KIT_ONBOARDING_POC,
  'kit-recueil-feedback': KIT_FEEDBACK,
  'parcours-jalons': PARCOURS_JALONS,
  'annuaire-conformite': ANNUAIRE_CONFORMITE,
  'kit-ambassadeur': KIT_AMBASSADEUR,
}
