import 'server-only'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Project, ProjectsPayload, TeamMember } from '@/types/project'
import { MOCK_PROJECTS } from '@/lib/mock'

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? '3761a4a44e9681698138cbf5e1d0c090'

// ── Helpers d'extraction ────────────────────────────────────────────────────

function getText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? ''
}

/**
 * Découpe un champ texte multi-lignes en items.
 * Parser défensif : gère le retour à la ligne réel (`\n`, attendu via le SDK
 * REST) ET le `<br>` littéral (au cas où la donnée aurait été saisie ainsi).
 */
function getLines(prop: any): string[] {
  return getText(prop)
    .split(/\r?\n|<br\s*\/?>/i)
    .map((l) => l.trim())
    .filter(Boolean)
}

function getSelect(prop: any, fallback = ''): string {
  return prop?.select?.name ?? fallback
}

function getNumber(prop: any): number {
  return prop?.number ?? 0
}

/**
 * Parse une liste de membres au format `Prénom Nom|Rôle|Organisation`.
 * Tolère les pipes échappés (`\|`) et les séparateurs `<br>`.
 */
function parseMembers(raw: string): TeamMember[] {
  return raw
    .split(/\r?\n|<br\s*\/?>/i)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '', role = '', org = ''] = line
        .replace(/\\\|/g, '|') // déséchappe les pipes
        .split('|')
      return { name: name.trim(), role: role.trim(), org: org.trim() }
    })
    .filter((m) => m.name)
}

// ── Mapper Notion → Project ─────────────────────────────────────────────────

function mapPage(page: PageObjectResponse): Project {
  const p = page.properties as any

  return {
    notionPageId: page.id,
    id: getText(p['ID']),
    name: p['Projet']?.title?.[0]?.plain_text ?? '',
    status: getSelect(p['Statut'], 'IDEATION') as Project['status'],
    nextSession: getText(p['Prochaine session']),
    confidence: getSelect(p['Confidence'], 'medium').toLowerCase() as Project['confidence'],
    avancement: getNumber(p['Avancement moyen']),
    vp: getText(p['Value Proposition']),

    conformite: {
      dpo: getSelect(p['Statut DPO'], 'Non initié'),
      risk: getSelect(p['Risque conformité'], 'Moyen'),
      perso: p['Données personnelles']?.checkbox ?? false,
      notes: getLines(p['Notes conformité']),
    },

    team: parseMembers(getText(p['Equipe'])),
    stakeholders: parseMembers(getText(p['Stakeholders'])),

    specs: getNumber(p['Score Spécifications']),
    gouv: getNumber(p['Score Gouvernance']),
    budget: getNumber(p['Score Budget']),
    tests: getNumber(p['Score Tests']),
    conformiteScore: getNumber(p['Score Conformité']),

    objectives: [
      { cat: getText(p['Obj1 Categorie']), desc: getText(p['Obj1 Description']), pct: getNumber(p['Obj1 Pct']) },
      { cat: getText(p['Obj2 Categorie']), desc: getText(p['Obj2 Description']), pct: getNumber(p['Obj2 Pct']) },
      { cat: getText(p['Obj3 Categorie']), desc: getText(p['Obj3 Description']), pct: getNumber(p['Obj3 Pct']) },
    ],

    achievements: getLines(p['Achievements']),
    utilisateurs: getLines(p['Utilisateurs internes']),
    warnings: getLines(p['Warnings']),
    nextSteps: getLines(p['Next Steps']),
    notesMeta: getText(p['Notes meta']),

    module: getSelect(p['Module programme']),
    typeIA: getSelect(p['Type de projet IA']),
    prioriteBudget: getSelect(p['Priorite budget']),
    coach: p['Coach']?.people?.[0]?.name ?? '',
    lastUpdated: p['Derniere mise a jour']?.date?.start ?? '',
  }
}

// ── Fetch principal ──────────────────────────────────────────────────────────

/**
 * Récupère les projets depuis Notion. En l'absence de `NOTION_API_KEY`,
 * bascule automatiquement sur un jeu de démonstration pour que l'app reste
 * fonctionnelle en développement.
 */
export async function fetchProjects(): Promise<ProjectsPayload> {
  const apiKey = process.env.NOTION_API_KEY

  if (!apiKey) {
    return {
      projects: MOCK_PROJECTS,
      source: 'mock',
      lastSync: MOCK_PROJECTS[0]?.lastUpdated || '',
    }
  }

  try {
    const notion = new Client({ auth: apiKey })
    const dataSourceId = await resolveDataSourceId(notion)
    const pages: PageObjectResponse[] = []
    let cursor: string | undefined

    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        sorts: [{ property: 'Avancement moyen', direction: 'descending' }],
        start_cursor: cursor,
      })
      pages.push(...(response.results as PageObjectResponse[]))
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
    } while (cursor)

    const projects = pages
      .filter((pg) => 'properties' in pg)
      .map(mapPage)
      .sort((a, b) => b.avancement - a.avancement)

    const lastSync = projects
      .map((p) => p.lastUpdated)
      .filter(Boolean)
      .sort()
      .pop() ?? ''

    return { projects, source: 'notion', lastSync }
  } catch (err) {
    console.error('[notion] échec du fetch, bascule sur les données de démo:', err)
    return { projects: MOCK_PROJECTS, source: 'mock', lastSync: MOCK_PROJECTS[0]?.lastUpdated || '' }
  }
}

/**
 * Résout l'ID de data source à interroger (API Notion 2025-09-03 / SDK v5).
 * Priorité à NOTION_DATA_SOURCE_ID, sinon récupéré depuis la base.
 */
async function resolveDataSourceId(notion: Client): Promise<string> {
  if (process.env.NOTION_DATA_SOURCE_ID) return process.env.NOTION_DATA_SOURCE_ID
  const db = (await notion.databases.retrieve({ database_id: DATABASE_ID })) as any
  const dsId: string | undefined = db?.data_sources?.[0]?.id
  if (!dsId) throw new Error('Aucune data source trouvée pour la base Notion')
  return dsId
}

// ── Mise à jour d'un champ numérique (édition inline future, §9 should-have) ──

export async function updateProjectNumber(pageId: string, field: string, value: number): Promise<void> {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY manquante')
  const notion = new Client({ auth: apiKey })
  await notion.pages.update({
    page_id: pageId,
    properties: { [field]: { number: value } },
  })
}
