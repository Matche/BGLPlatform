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
    validated:   p['Validation coach']?.checkbox ?? false,
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
 *
 * Ordre de priorité :
 *  1. NOTION_DATA_SOURCE_ID (override explicite)
 *  2. Base mensuelle « Data reporting YYYY-MM » strictement plus récente que la
 *     base configurée (sélection automatique du mois courant)
 *  3. Data source de la base configurée (NOTION_DATABASE_ID)
 *
 * Le point 2 ne bascule QUE vers un mois strictement supérieur, ce qui évite de
 * choisir par erreur un doublon du mois courant à la place de la base de référence.
 */
async function resolveDataSourceId(notion: Client): Promise<string> {
  if (process.env.NOTION_DATA_SOURCE_ID) return process.env.NOTION_DATA_SOURCE_ID

  const db = (await notion.databases.retrieve({ database_id: DATABASE_ID })) as any
  const configuredDsId: string | undefined = db?.data_sources?.[0]?.id
  if (!configuredDsId) throw new Error('Aucune data source trouvée pour la base Notion')
  const configuredMonth = monthOf(titleText(db))

  try {
    const later = await findLaterMonthlyDataSource(notion, configuredMonth)
    if (later) return later
  } catch (err) {
    console.warn('[notion] détection de la base mensuelle échouée, base configurée utilisée:', err)
  }
  return configuredDsId
}

function titleText(obj: any): string {
  const t = obj?.title
  if (Array.isArray(t)) return t.map((x: any) => x?.plain_text ?? '').join('')
  if (typeof obj?.name === 'string') return obj.name
  return ''
}

/** Extrait « YYYY-MM » d'un titre type « Data reporting 2026-06 ». */
function monthOf(title: string): string {
  const m = /(\d{4}-\d{2})/.exec(title || '')
  return m ? m[1] : ''
}

/**
 * Cherche une base « Data reporting YYYY-MM » dont le mois est strictement plus
 * récent que `afterMonth`. Renvoie son data source id, ou null si aucune.
 */
async function findLaterMonthlyDataSource(notion: Client, afterMonth: string): Promise<string | null> {
  const res = (await notion.search({ query: 'Data reporting', page_size: 100 })) as any
  let bestMonth = afterMonth
  let best: { obj: any; edited: string } | null = null

  for (const r of res.results ?? []) {
    if (r.object !== 'database' && r.object !== 'data_source') continue
    const month = monthOf(titleText(r))
    if (!month || month <= afterMonth) continue
    const edited: string = r.last_edited_time ?? ''
    if (month > bestMonth || (month === bestMonth && best && edited > best.edited)) {
      bestMonth = month
      best = { obj: r, edited }
    }
  }

  if (!best) return null
  if (best.obj.object === 'data_source') return best.obj.id
  // database → récupérer sa première data source
  const ds = best.obj.data_sources?.[0]?.id
  if (ds) return ds
  const full = (await notion.databases.retrieve({ database_id: best.obj.id })) as any
  return full?.data_sources?.[0]?.id ?? null
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

/** Met à jour la case « Validation coach » d'un projet dans Notion. */
export async function updateProjectValidation(pageId: string, validated: boolean): Promise<void> {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY manquante')
  const notion = new Client({ auth: apiKey })
  await notion.pages.update({
    page_id: pageId,
    properties: { 'Validation coach': { checkbox: validated } },
  })
}

// ── Write-back du reporting micro (édition inline admin, §9) ─────────────────

/** Champs texte éditables du reporting et leur propriété Notion. */
export interface ReportingEdit {
  vp?: string
  achievements?: string[]
  utilisateurs?: string[]
  warnings?: string[]
  nextSteps?: string[]
  notesMeta?: string
}

/** Découpe en blocs ≤ 2000 caractères (limite Notion par objet rich_text). */
function richText(content: string): { text: { content: string } }[] {
  if (!content) return []
  const chunks: { text: { content: string } }[] = []
  let s = content
  while (s.length > 0) {
    chunks.push({ text: { content: s.slice(0, 2000) } })
    s = s.slice(2000)
  }
  return chunks
}

const TEXT_PROP: Record<string, string> = {
  vp: 'Value Proposition',
  notesMeta: 'Notes meta',
}
const LIST_PROP: Record<string, string> = {
  achievements: 'Achievements',
  utilisateurs: 'Utilisateurs internes',
  warnings: 'Warnings',
  nextSteps: 'Next Steps',
}

/** Met à jour les champs texte d'un projet dans Notion. */
export async function updateProjectReporting(pageId: string, edit: ReportingEdit): Promise<void> {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY manquante')
  const notion = new Client({ auth: apiKey })

  const properties: Record<string, { rich_text: { text: { content: string } }[] }> = {}
  for (const [key, prop] of Object.entries(TEXT_PROP)) {
    const val = (edit as Record<string, unknown>)[key]
    if (typeof val === 'string') properties[prop] = { rich_text: richText(val) }
  }
  for (const [key, prop] of Object.entries(LIST_PROP)) {
    const val = (edit as Record<string, unknown>)[key]
    if (Array.isArray(val)) properties[prop] = { rich_text: richText((val as string[]).join('\n')) }
  }

  if (Object.keys(properties).length === 0) return
  await notion.pages.update({ page_id: pageId, properties })
}
