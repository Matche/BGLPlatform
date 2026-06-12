import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { fetchProjects } from '@/lib/notion'
import type { Project } from '@/types/project'
import { avgPct } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  const { history } = (await req.json()) as { history: ChatMessage[] }
  const messages = Array.isArray(history) ? history : []
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''

  const { projects } = await fetchProjects()

  // Sans clé Anthropic : réponse locale déterministe (parité avec le prototype).
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ content: localAnswer(lastUser, projects), source: 'fallback' })
  }

  try {
    const client = new Anthropic()
    const systemPrompt = `Tu es l'assistant du dashboard de coaching IA INSKIP pour le programme AI Facilitator BGL BNP.
Tu connais les ${projects.length} projets du programme en temps réel.

DONNÉES ACTUELLES :
${JSON.stringify(projects, null, 2)}

Réponds en français, de façon concise et précise. Tu peux faire référence aux projets par leur nom ou leur ID (UC1, UC2...).
Quand tu cites un avancement ou un score, utilise les données ci-dessus. Pour les listes, utilise des puces commençant par "- ".`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ content, source: 'anthropic' })
  } catch (err) {
    console.error('[API /chat]', err)
    return NextResponse.json({ content: localAnswer(lastUser, projects), source: 'fallback' })
  }
}

// ── Repli local (texte simple, puces "- ") ──────────────────────────────────

function normalize(s: string): string {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function localAnswer(text: string, projects: Project[]): string {
  const nt = normalize(text)
  const hit = projects.filter((p) => nt.includes(normalize(p.name)) || nt.includes(p.id.toLowerCase()))

  if (hit.length === 1) {
    const p = hit[0]
    if (/warning|risque|alerte|blocage/.test(nt))
      return `${p.name} — warnings :\n${p.warnings.map((w) => `- ${w}`).join('\n')}`
    if (/next|prochaine|etape/.test(nt))
      return `${p.name} — prochaines étapes :\n${p.nextSteps.map((s) => `- ${s}`).join('\n')}`
    if (/conform|dpo/.test(nt))
      return `${p.name} — DPO : ${p.conformite.dpo}, risque ${p.conformite.risk}. ${p.conformite.notes[0] ?? ''}`
    return `${p.name} (${p.status}) — avancement ${avgPct(p)}%, confiance ${p.confidence}.\n${p.vp}`
  }

  if (/plus avance|top/.test(nt)) {
    const s = [...projects].sort((a, b) => avgPct(b) - avgPct(a))
    return `Projets les plus avancés :\n${s.slice(0, 3).map((p) => `- ${p.name} — ${avgPct(p)}%`).join('\n')}`
  }
  if (/blocage|critique/.test(nt)) {
    const l = projects.filter((p) => p.warnings.some((w) => /bloquant|critique/.test(w.toLowerCase())))
    return `Projets avec blocages critiques :\n${l.map((p) => `- ${p.name} : ${p.warnings[0]}`).join('\n')}`
  }
  if (/sponsor/.test(nt)) {
    const l = projects.filter((p) => p.gouv === 0)
    return `${l.length} projet(s) sans sponsor : ${l.map((p) => p.name).join(', ')}.`
  }
  if (/conform|dpo/.test(nt))
    return `État conformité :\n${projects
      .map((p) => `- ${p.name} — DPO : ${p.conformite.dpo}, risque ${p.conformite.risk}`)
      .join('\n')}`
  if (/prototype/.test(nt)) {
    const l = projects.filter((p) => p.status === 'PROTOTYPE')
    return `${l.length} projet(s) en prototype : ${l.map((p) => p.name).join(', ')}.`
  }
  if (/retard|moins/.test(nt)) {
    const s = [...projects].sort((a, b) => avgPct(a) - avgPct(b))
    return `Projets les moins avancés :\n${s.slice(0, 3).map((p) => `- ${p.name} — ${avgPct(p)}%`).join('\n')}`
  }

  return 'Je peux répondre sur les projets BGL BNP. Exemples : "warnings de RM Briefing", "projets sans sponsor", "état de la conformité".'
}
