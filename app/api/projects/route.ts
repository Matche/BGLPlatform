import { NextResponse } from 'next/server'
import { fetchProjects } from '@/lib/notion'

export const revalidate = 300 // cache 5 minutes (ISR)

export async function GET() {
  try {
    const payload = await fetchProjects()
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[API /projects]', err)
    return NextResponse.json({ error: 'Erreur Notion' }, { status: 500 })
  }
}
