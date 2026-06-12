import { NextResponse } from 'next/server'
import { updateProjectNumber } from '@/lib/notion'

// PATCH /api/projects/:id  — édition inline future (§9 should-have).
// :id = notionPageId. Corps attendu : { field: "Obj1 Pct", value: 80 }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const { field, value } = await req.json()
    if (typeof field !== 'string' || typeof value !== 'number') {
      return NextResponse.json({ error: 'Paramètres invalides (field: string, value: number)' }, { status: 400 })
    }
    await updateProjectNumber(id, field, value)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API PATCH /projects/:id]', err)
    return NextResponse.json({ error: 'Échec de la mise à jour Notion' }, { status: 500 })
  }
}
