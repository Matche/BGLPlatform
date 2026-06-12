# INSKIP — AI Facilitator Dashboard BGL BNP
## Handover document pour Claude Code

**Date** : juin 2026  
**Auteur** : INSKIP / Matthieu Chéreau  
**Destinataire** : Claude Code  
**Fichier de référence** : `inskip-bgl-dashboard.html` (prototype HTML complet, dans le même dossier)

---

## 1. Contexte projet

### Ce qu'on construit

Un dashboard de reporting de coaching IA pour le programme **AI Facilitator** de BGL BNP Paribas.
7 projets IA internes sont coachés par INSKIP sur l'année 2026. Le dashboard sert à :

- Suivre l'avancement de chaque projet sur 5 axes : Spécifications, Gouvernance, Budget, Tests utilisateurs, Conformité
- Produire un reporting mensuel structuré pour le comité de pilotage
- Donner au coach (Matthieu Chéreau, INSKIP) une vue opérationnelle par projet avant chaque session

### Ce qui existe déjà

Le fichier `inskip-bgl-dashboard.html` est un **prototype HTML/JS standalone et fonctionnel** avec :

- 3 vues navigables : Vue macro / Vue projet / Chat
- Sidebar avec recherche et filtres
- Vue macro : 4 KPI cards, bar chart horizontal (avancement), bar chart horizontal (score axes), project grid
- Vue projet : panneau gauche cyan (VP, conformité, équipe, stakeholders), panneau droit (5 axes, objectifs avec marqueur triangle, achievements, utilisateurs internes, warnings, next steps)
- Chat : interface avec réponses locales (fallback)
- Design system BGL BNP appliqué : `#00915A` vert primaire, `#27455C` ardoise, `#101010` nav, `#EC9A00` ambre, `#E07818` orange alerte, Barlow Condensed + Inter, tags rectangulaires, ombres BGL

**Les données sont actuellement hardcodées dans le JS.** L'objectif de ce handover est de construire l'application réelle connectée à Notion.

---

## 2. Stack technique recommandée

```
Framework     : Next.js 15 (App Router)
Styling       : Tailwind CSS v4 + CSS variables BGL (voir section 6)
Charts        : Chart.js 4 via react-chartjs-2
Notion        : @notionhq/client (SDK officiel)
Fonts         : next/font avec Barlow Condensed + Inter (Google Fonts)
Déploiement   : Vercel
Runtime       : Node.js 20+
```

Justifications :
- Next.js App Router permet le rendu serveur (SSR) pour le premier chargement + ISR pour le cache
- L'API Notion est appelée côté serveur uniquement (clé API jamais exposée au client)
- Vercel s'intègre nativement avec Next.js et supporte les cron jobs pour le cache

---

## 3. Source de données : Notion

### Base de données

```
URL     : https://www.notion.so/inskip/3761a4a44e9681698138cbf5e1d0c090
ID      : 3761a4a4-4e96-8169-8138-cbf5e1d0c090
Espace  : inskip
```

### Variables d'environnement requises

```bash
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=3761a4a44e9681698138cbf5e1d0c090

# Optionnel : protection de l'accès au dashboard
DASHBOARD_PASSWORD=xxxxxxxx
```

La clé API Notion doit avoir accès en lecture (et écriture pour les futures fonctions d'édition) à la base ci-dessus. L'intégration Notion doit être partagée sur la base depuis les paramètres Notion.

---

## 4. Schéma Notion — contrat de données

### Table de mapping complète

Chaque page Notion correspond à un projet. Voici le mapping exact propriété Notion → champ JS :

| Propriété Notion        | Type Notion | Propriété JS           | Transformation                                        |
|-------------------------|-------------|------------------------|-------------------------------------------------------|
| `Projet`                | title       | `p.name`               | `.title[0]?.plain_text ?? ''`                        |
| `ID`                    | text        | `p.id`                 | `.rich_text[0]?.plain_text ?? ''`                    |
| `Statut`                | select      | `p.status`             | `.select?.name ?? 'IDEATION'`                        |
| `Prochaine session`     | text        | `p.nextSession`        | `.rich_text[0]?.plain_text ?? ''`                    |
| `Confidence`            | select      | `p.confidence`         | `.select?.name?.toLowerCase() ?? 'medium'`           |
| `Avancement moyen`      | number      | `p.avancement`         | `.number ?? 0`                                       |
| `Value Proposition`     | text        | `p.vp`                 | `.rich_text[0]?.plain_text ?? ''`                    |
| `Statut DPO`            | select      | `p.conformite.dpo`     | `.select?.name ?? 'Non initié'`                      |
| `Risque conformité`     | select      | `p.conformite.risk`    | `.select?.name ?? 'Moyen'`                           |
| `Données personnelles`  | checkbox    | `p.conformite.perso`   | `.checkbox ?? false`                                 |
| `Notes conformité`      | text        | `p.conformite.notes[]` | `.rich_text[0]?.plain_text.split('\n').filter(Boolean) ?? []` |
| `Equipe`                | text        | `p.team[]`             | `parseMembers(.rich_text[0]?.plain_text)`            |
| `Stakeholders`          | text        | `p.stakeholders[]`     | `parseMembers(.rich_text[0]?.plain_text)`            |
| `Score Spécifications`  | number      | `p.specs`              | `.number ?? 0`                                       |
| `Score Gouvernance`     | number      | `p.gouv`               | `.number ?? 0`                                       |
| `Score Budget`          | number      | `p.budget`             | `.number ?? 0`                                       |
| `Score Tests`           | number      | `p.tests`              | `.number ?? 0`                                       |
| `Score Conformité`      | number      | `p.conformiteScore`    | `.number ?? 0`                                       |
| `Obj1 Categorie`        | text        | `p.objectives[0].cat`  | `.rich_text[0]?.plain_text ?? ''`                    |
| `Obj1 Description`      | text        | `p.objectives[0].desc` | `.rich_text[0]?.plain_text ?? ''`                    |
| `Obj1 Pct`              | number      | `p.objectives[0].pct`  | `.number ?? 0`                                       |
| `Obj2 Categorie`        | text        | `p.objectives[1].cat`  | idem                                                  |
| `Obj2 Description`      | text        | `p.objectives[1].desc` | idem                                                  |
| `Obj2 Pct`              | number      | `p.objectives[1].pct`  | idem                                                  |
| `Obj3 Categorie`        | text        | `p.objectives[2].cat`  | idem                                                  |
| `Obj3 Description`      | text        | `p.objectives[2].desc` | idem                                                  |
| `Obj3 Pct`              | number      | `p.objectives[2].pct`  | idem                                                  |
| `Achievements`          | text        | `p.achievements[]`     | `.rich_text[0]?.plain_text.split('\n').filter(Boolean) ?? []` |
| `Utilisateurs internes` | text        | `p.utilisateurs[]`     | idem                                                  |
| `Warnings`              | text        | `p.warnings[]`         | idem                                                  |
| `Next Steps`            | text        | `p.nextSteps[]`        | idem                                                  |
| `Notes meta`            | text        | `p.notesMeta`          | `.rich_text[0]?.plain_text ?? ''`                    |
| `Module programme`      | select      | `p.module`             | `.select?.name ?? ''`                                |
| `Type de projet IA`     | select      | `p.typeIA`             | `.select?.name ?? ''`                                |
| `Coach`                 | person      | `p.coach`              | `.people[0]?.name ?? ''`                             |
| `Derniere mise a jour`  | date        | `p.lastUpdated`        | `.date?.start ?? ''`                                 |

### Format des champs texte structurés

Les champs `Equipe` et `Stakeholders` utilisent le format suivant dans Notion :

```
Prénom Nom|Rôle|Organisation
Prénom Nom|Rôle|Organisation
```

Exemple réel :
```
Victor Dilion|Porteur principal|BGL BNP
Pierre-Etienne Staes|Développement|BGL BNP
Sylvain Sarda|Référent métier|BGL BNP
```

---

## 5. Code de mapping Notion → Application

Coller ce code dans `lib/notion.ts` :

```typescript
import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DATABASE_ID = process.env.NOTION_DATABASE_ID!

// ── Types ─────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string
  role: string
  org: string
}

export interface Objective {
  cat: string
  desc: string
  pct: number
}

export interface Conformite {
  dpo: string
  risk: string
  perso: boolean
  notes: string[]
}

export interface Project {
  notionPageId: string
  id: string
  name: string
  status: 'PROTOTYPE' | 'IDEATION' | 'INDUSTRIALISÉ' | 'CLOSED'
  nextSession: string
  confidence: 'high' | 'medium' | 'low'
  avancement: number
  vp: string
  conformite: Conformite
  team: TeamMember[]
  stakeholders: TeamMember[]
  specs: number
  gouv: number
  budget: number
  tests: number
  conformiteScore: number
  objectives: [Objective, Objective, Objective]
  achievements: string[]
  utilisateurs: string[]
  warnings: string[]
  nextSteps: string[]
  notesMeta: string
  module: string
  typeIA: string
  coach: string
  lastUpdated: string
}

// ── Helpers ───────────────────────────────────────────────────────────────

function getText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? ''
}

function getLines(prop: any): string[] {
  return getText(prop).split('\n').filter(Boolean)
}

function getSelect(prop: any, fallback = ''): string {
  return prop?.select?.name ?? fallback
}

function getNumber(prop: any): number {
  return prop?.number ?? 0
}

function parseMembers(raw: string): TeamMember[] {
  return raw
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [name = '', role = '', org = ''] = line.split('|')
      return { name: name.trim(), role: role.trim(), org: org.trim() }
    })
    .filter(m => m.name)
}

// ── Mapper principal ──────────────────────────────────────────────────────

function mapPage(page: PageObjectResponse): Project {
  const p = page.properties as any

  return {
    notionPageId: page.id,
    id:           getText(p['ID']),
    name:         p['Projet']?.title?.[0]?.plain_text ?? '',
    status:       getSelect(p['Statut'], 'IDEATION') as Project['status'],
    nextSession:  getText(p['Prochaine session']),
    confidence:   getSelect(p['Confidence'], 'medium').toLowerCase() as Project['confidence'],
    avancement:   getNumber(p['Avancement moyen']),
    vp:           getText(p['Value Proposition']),

    conformite: {
      dpo:   getSelect(p['Statut DPO'], 'Non initié'),
      risk:  getSelect(p['Risque conformité'], 'Moyen'),
      perso: p['Données personnelles']?.checkbox ?? false,
      notes: getLines(p['Notes conformité']),
    },

    team:         parseMembers(getText(p['Equipe'])),
    stakeholders: parseMembers(getText(p['Stakeholders'])),

    specs:          getNumber(p['Score Spécifications']),
    gouv:           getNumber(p['Score Gouvernance']),
    budget:         getNumber(p['Score Budget']),
    tests:          getNumber(p['Score Tests']),
    conformiteScore: getNumber(p['Score Conformité']),

    objectives: [
      { cat: getText(p['Obj1 Categorie']), desc: getText(p['Obj1 Description']), pct: getNumber(p['Obj1 Pct']) },
      { cat: getText(p['Obj2 Categorie']), desc: getText(p['Obj2 Description']), pct: getNumber(p['Obj2 Pct']) },
      { cat: getText(p['Obj3 Categorie']), desc: getText(p['Obj3 Description']), pct: getNumber(p['Obj3 Pct']) },
    ],

    achievements: getLines(p['Achievements']),
    utilisateurs: getLines(p['Utilisateurs internes']),
    warnings:     getLines(p['Warnings']),
    nextSteps:    getLines(p['Next Steps']),
    notesMeta:    getText(p['Notes meta']),

    module:      getSelect(p['Module programme']),
    typeIA:      getSelect(p['Type de projet IA']),
    coach:       p['Coach']?.people?.[0]?.name ?? '',
    lastUpdated: p['Derniere mise a jour']?.date?.start ?? '',
  }
}

// ── Fetch principal (avec cache ISR) ─────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: 'Avancement moyen', direction: 'descending' }],
      start_cursor: cursor,
    })
    pages.push(...(response.results as PageObjectResponse[]))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return pages.map(mapPage)
}

// ── Mise à jour d'un champ (pour édition inline future) ──────────────────

export async function updateProjectField(
  pageId: string,
  field: string,
  value: number
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: { [field]: { number: value } },
  })
}
```

---

## 6. Design system BGL — tokens CSS

Coller dans `app/globals.css` (ou le fichier CSS global de l'app) :

```css
:root {
  /* ── Couleurs BGL BNP ── */
  --green:          #00915A;
  --green-dark:     #006640;
  --green-soft:     rgba(0, 145, 90, 0.10);
  --lime:           #7FC800;
  --amber:          #EC9A00;
  --amber-soft:     rgba(236, 154, 0, 0.12);
  --slate:          #27455C;
  --navy:           #101010;
  --orange-alert:   #E07818;
  --orange-soft:    #FEF3E6;

  /* ── Texte ── */
  --text-primary:   rgba(0, 0, 0, 0.87);
  --text-secondary: rgba(0, 0, 0, 0.54);
  --text-inactive:  #A7A7A7;
  --text-card:      #363636;

  /* ── Surfaces ── */
  --surface:        #FFFFFF;
  --surface-alt:    #F2F2F0;
  --surface-nav:    #F3F2F1;
  --surface-footer: #F3F3F3;

  /* ── Bordures ── */
  --border:         #DDDDDD;
  --border-input:   #D1D1D1;

  /* ── Ombres ── */
  --shadow-card:    rgba(161, 163, 184, 0.3) 0px 8px 10px 0px;
  --shadow-lg:      rgba(161, 163, 184, 0.4) 0px 12px 18px 0px;

  /* ── Radius ── */
  --r-card:         5px;
  --r-btn:          20px;
  --r-pill:         23px;
  --r-input:        50px;

  /* ── Typographie ── */
  --font-cond:      'Barlow Condensed', 'bnpp-sans-cond', sans-serif;
  --font-body:      'Inter', 'bnpp-type-light', Helvetica, sans-serif;
}
```

### Règles typographiques

```css
/* Titres de section, KPI, noms projets, badges */
.heading { font-family: var(--font-cond); text-transform: uppercase; letter-spacing: 0.4px; }

/* Corps de texte, descriptions */
.body { font-family: var(--font-body); font-weight: 300; }

/* Boutons */
.btn-primary {
  background: var(--green);
  color: #fff;
  border-radius: var(--r-btn);
  font-family: var(--font-body);
  font-weight: 500;
  padding: 8px 24px;
  border: none;
}

/* Tags (statuts, badges) — rectangulaires style BGL */
.tag { border-radius: 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: var(--font-cond); font-size: 10px; font-weight: 600; }
```

---

## 7. Architecture de l'application

### Structure des fichiers

```
inskip-bgl-dashboard/
├── app/
│   ├── layout.tsx              # Layout global + fonts next/font
│   ├── page.tsx                # Dashboard principal (SSR)
│   ├── globals.css             # Tokens BGL + reset
│   └── api/
│       ├── projects/
│       │   └── route.ts        # GET /api/projects → fetch Notion
│       └── projects/[id]/
│           └── route.ts        # PATCH /api/projects/:id → update Notion
├── components/
│   ├── layout/
│   │   ├── TopHeader.tsx       # Barre noire BGL, nav 3 boutons, logo
│   │   ├── SourceBanner.tsx    # Bandeau vert teinté + last update
│   │   └── Sidebar.tsx         # Liste projets, search, filter chips
│   ├── views/
│   │   ├── MacroView.tsx       # KPIs + charts + project grid
│   │   ├── ProjectView.tsx     # Panneau détail (left cyan + right)
│   │   └── ChatView.tsx        # Chat IA connecté à l'API Anthropic
│   ├── macro/
│   │   ├── KpiCard.tsx
│   │   ├── ProgressChart.tsx   # Bar chart horizontal Chart.js
│   │   ├── AxesChart.tsx       # Bar chart horizontal axes
│   │   └── ProjectCard.tsx     # Card header cyan, progress bar
│   ├── detail/
│   │   ├── LeftPanel.tsx       # Fond vert, VP, conformité, team
│   │   ├── AxesGrid.tsx        # 5 cellules colorées 0-3
│   │   ├── ObjectiveBar.tsx    # Barre avec marqueur triangle double
│   │   ├── TeamMember.tsx      # Avatar initiales + nom + rôle
│   │   └── RightPanel.tsx      # Axes, objectifs, two-col, warnings
│   └── ui/
│       ├── StatusPip.tsx       # Badge rectangulaire PROTO/IDÉATION
│       ├── AxisCell.tsx        # Cellule colorée score 0-3
│       └── ProgressBar.tsx     # Barre dégradé vert→ardoise
├── lib/
│   ├── notion.ts               # Client Notion + fetchProjects + mapPage
│   └── utils.ts                # avgPct, getInitials, axisClass...
├── types/
│   └── project.ts              # Interface Project + types associés
├── public/
│   └── (assets BGL si fournis)
├── inskip-bgl-dashboard.html   # RÉFÉRENCE VISUELLE — ne pas modifier
├── HANDOVER.md                 # Ce fichier
├── .env.local                  # NOTION_API_KEY + NOTION_DATABASE_ID
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### Route API principale

```typescript
// app/api/projects/route.ts
import { NextResponse } from 'next/server'
import { fetchProjects } from '@/lib/notion'

export const revalidate = 300 // cache 5 minutes (ISR)

export async function GET() {
  try {
    const projects = await fetchProjects()
    return NextResponse.json(projects)
  } catch (err) {
    console.error('[API /projects]', err)
    return NextResponse.json({ error: 'Erreur Notion' }, { status: 500 })
  }
}
```

### Page principale

```typescript
// app/page.tsx
import { fetchProjects } from '@/lib/notion'
import Dashboard from '@/components/Dashboard'

export const revalidate = 300

export default async function Home() {
  const projects = await fetchProjects()
  return <Dashboard projects={projects} />
}
```

---

## 8. Chat IA — connexion API Anthropic

Le chat dans le dashboard doit passer de réponses locales à une vraie connexion Anthropic.

```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { fetchProjects } from '@/lib/notion'

const client = new Anthropic()

export async function POST(req: Request) {
  const { message, history } = await req.json()
  const projects = await fetchProjects()

  const systemPrompt = `Tu es l'assistant du dashboard de coaching IA INSKIP pour le programme AI Facilitator BGL BNP.
Tu connais les ${projects.length} projets du programme en temps réel.

DONNÉES ACTUELLES :
${JSON.stringify(projects, null, 2)}

Réponds en français, de façon concise et précise. Tu peux faire référence aux projets par leur nom ou leur ID (UC1, UC2...).
Quand tu cites un avancement ou un score, utilise les données ci-dessus.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: systemPrompt,
    messages: [
      ...history,
      { role: 'user', content: message }
    ]
  })

  return Response.json({
    content: response.content[0].type === 'text' ? response.content[0].text : ''
  })
}
```

Variable d'environnement supplémentaire :
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

---

## 9. Périmètre V1 (livrable initial)

### Must have

- [ ] Application Next.js opérationnelle localement
- [ ] Connexion Notion fonctionnelle : les 7 projets se chargent depuis la vraie base
- [ ] Les 3 vues du dashboard (Macro / Projet / Chat) correspondent exactement au HTML de référence
- [ ] Le chat est connecté à l'API Anthropic avec le contexte des projets en live
- [ ] Déploiement sur Vercel accessible par URL publique
- [ ] Revalidation du cache toutes les 5 minutes (les mises à jour Notion apparaissent dans les 5 min)
- [ ] Responsive : le dashboard est utilisable sur tablette (iPad landscape minimum)

### Should have

- [ ] Édition inline des pourcentages d'objectifs directement depuis le dashboard → write-back Notion
- [ ] Indicateur de dernière synchronisation Notion visible dans la source banner
- [ ] Lien direct vers la page Notion de chaque projet (bouton dans la vue détail)
- [ ] Mode impression / export PDF de la vue macro (pour les COPIL)

### Nice to have (V2)

- [ ] Authentification basique (mot de passe ou lien magique) pour protéger l'accès
- [ ] Webhook Notion → revalidation instantanée à chaque mise à jour
- [ ] Envoi automatique d'un digest mensuel par email (Resend)
- [ ] Vue historique : visualiser les évolutions d'avancement dans le temps
- [ ] Vue timeline par module programme

---

## 10. Référence visuelle — composants clés à reproduire fidèlement

Ces éléments sont distinctifs du design et doivent être reproduits à l'identique :

### Marqueur triangle double sur les barres d'objectif

```css
/* La barre de progression utilise un marqueur double (triangle haut vert + triangle bas ardoise) */
.obj-bar-track {
  flex: 1;
  height: 2px;
  background: var(--slate);
  position: relative;
}
.obj-bar-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid var(--green); /* triangle pointe vers le haut */
}
.obj-bar-marker::after {
  content: '';
  position: absolute;
  top: 8px; left: -6px;
  width: 0; height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--slate); /* triangle pointe vers le bas */
}
```

### Panneau gauche de la vue détail

- Fond : `#00915A` (vert primaire BGL)
- Contient : date prochaine session, nom projet (Barlow Condensed uppercase), VP box semi-transparente, section Conformité & Risques, équipe avec avatars initiales, stakeholders en grille 2 colonnes
- La lettre "TEAM" s'affiche en écriture verticale, opacité 28%, en arrière-plan

### Cellules axes d'évaluation (5 colonnes)

```
Score 3 → fond #E0F4E0, texte #2E7D32 (vert)
Score 2 → fond #FFF4D6, texte #B8770C (ambre)
Score 1 → fond #FEF3E6, texte #E07818 (orange alerte)
Score 0 → fond #F3F2F1, texte #A7A7A7 (gris inactif)
```

### Tags statuts — rectangulaires (border-radius: 0)

Conforme au style tags éditoriaux BGL (section 7 du design system).

---

## 11. Déploiement Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Depuis la racine du projet
vercel

# 3. Variables d'environnement à configurer dans le dashboard Vercel
NOTION_API_KEY=...
NOTION_DATABASE_ID=3761a4a44e9681698138cbf5e1d0c090
ANTHROPIC_API_KEY=...

# 4. Domaine personnalisé optionnel
# bgl-coaching.inskip.fr ou similaire
```

Configuration `next.config.ts` :

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    // Requis pour les Server Actions si édition inline activée
    serverActions: { allowedOrigins: ['*.vercel.app', 'bgl-coaching.inskip.fr'] }
  }
}

export default config
```

---

## 12. Instructions de démarrage pour Claude Code

```bash
# 1. Créer le projet
npx create-next-app@latest inskip-bgl-dashboard \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd inskip-bgl-dashboard

# 2. Installer les dépendances
npm install @notionhq/client @anthropic-ai/sdk react-chartjs-2 chart.js

# 3. Copier les fichiers de référence dans la racine
# (inskip-bgl-dashboard.html + HANDOVER.md)

# 4. Créer .env.local
echo "NOTION_API_KEY=your_key_here" >> .env.local
echo "NOTION_DATABASE_ID=3761a4a44e9681698138cbf5e1d0c090" >> .env.local
echo "ANTHROPIC_API_KEY=your_key_here" >> .env.local

# 5. Lancer en dev
npm run dev
```

**Point de départ recommandé** : commencer par `lib/notion.ts` + l'API route `GET /api/projects`, tester que les données Notion arrivent correctement, puis construire les composants en s'appuyant sur le HTML de référence comme spécification visuelle exacte.

---

## 13. Contacts et ressources

| Ressource | Détail |
|---|---|
| Prototype HTML de référence | `inskip-bgl-dashboard.html` (dans ce dossier) |
| Base Notion | https://www.notion.so/inskip/3761a4a44e9681698138cbf5e1d0c090 |
| Design system BGL | Document fourni (sections 1–16) |
| Coach / Product Owner | Matthieu Chéreau — INSKIP |
| Programme | AI Facilitator BGL BNP 2026 |
