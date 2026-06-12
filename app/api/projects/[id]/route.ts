import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updateProjectReporting, updateProjectValidation, type ReportingEdit } from '@/lib/notion'

// PATCH /api/projects/:id  — write-back Notion (§9). :id = notionPageId.
// Corps : { reporting: {...} }  et/ou  { validated: boolean }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const body = (await req.json()) as { reporting?: ReportingEdit; validated?: boolean }

    if (typeof body.validated === 'boolean') {
      await updateProjectValidation(id, body.validated)
    }
    if (body.reporting && typeof body.reporting === 'object') {
      await updateProjectReporting(id, body.reporting)
    }
    if (typeof body.validated !== 'boolean' && !body.reporting) {
      return NextResponse.json({ error: 'Corps invalide : { reporting } et/ou { validated } attendu' }, { status: 400 })
    }

    revalidatePath('/pilotage')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API PATCH /projects/:id]', err)
    const message = err instanceof Error ? err.message : 'Échec de la mise à jour Notion'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
