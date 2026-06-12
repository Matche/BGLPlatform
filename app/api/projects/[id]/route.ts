import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updateProjectReporting, type ReportingEdit } from '@/lib/notion'

// PATCH /api/projects/:id  — write-back du reporting micro dans Notion (§9).
// :id = notionPageId. Corps : { reporting: { vp?, achievements?[], utilisateurs?[], warnings?[], nextSteps?[], notesMeta? } }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const body = (await req.json()) as { reporting?: ReportingEdit }
    if (!body.reporting || typeof body.reporting !== 'object') {
      return NextResponse.json({ error: 'Corps invalide : { reporting } attendu' }, { status: 400 })
    }
    await updateProjectReporting(id, body.reporting)
    // Rafraîchit le cache ISR pour refléter la mise à jour côté serveur.
    revalidatePath('/pilotage')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API PATCH /projects/:id]', err)
    const message = err instanceof Error ? err.message : 'Échec de la mise à jour Notion'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
