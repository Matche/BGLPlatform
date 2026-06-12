# INSKIP — AI Facilitator Dashboard · BGL BNP

Dashboard de reporting de coaching IA pour le programme **AI Facilitator** de BGL BNP Paribas
(7 projets IA internes coachés par INSKIP, 2026). Construit avec Next.js 16 (App Router),
Tailwind v4, Chart.js et le SDK Notion. Source de données : base Notion (live), chat connecté
à l'API Anthropic.

Voir `HANDOVER.md` pour le contexte complet et `inskip-bgl-dashboard.html` pour la référence visuelle.

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés
npm run dev                  # http://localhost:3000
```

### Mode démonstration

Sans `NOTION_API_KEY`, l'app sert un **jeu de données de démonstration** (voir `lib/mock.ts`)
et le chat utilise un moteur de réponses local. Dès que les clés sont configurées, l'app bascule
automatiquement sur Notion et l'API Anthropic — aucun changement de code.

## Variables d'environnement

| Variable | Rôle | Sans elle |
|---|---|---|
| `NOTION_API_KEY` | Intégration Notion (lecture base) | données de démo |
| `NOTION_DATABASE_ID` | ID de la base (prérempli) | — |
| `NOTION_DATA_SOURCE_ID` | *(optionnel)* data source (API v5) | résolu automatiquement |
| `ANTHROPIC_API_KEY` | Chat IA | repli local |

> SDK Notion v5 : la base est interrogée via `dataSources.query` (API `2025-09-03`).
> Le data source est résolu automatiquement depuis la base si non fourni.

## Architecture

```
app/
  page.tsx              # SSR — fetchProjects() → <Dashboard>
  api/projects/route.ts # GET  — payload projets (revalidate 300s)
  api/projects/[id]     # PATCH — édition inline (write-back Notion, à venir)
  api/chat/route.ts     # POST — chat Anthropic + repli local
components/
  Dashboard.tsx         # orchestrateur (vue / projet courant / filtre / recherche)
  layout/               # TopHeader, SourceBanner, Sidebar
  views/                # MacroView, ProjectDetail, ChatView
  charts/               # ProgressChart, AxesChart (react-chartjs-2)
lib/
  notion.ts             # client Notion + mapper + fallback démo
  mock.ts               # jeu de démonstration
  utils.ts              # avgPct, getInitials, axisClass, constantes axes
types/project.ts        # contrat de données Project
```

## Déploiement

Vercel + variables d'environnement (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `ANTHROPIC_API_KEY`).
