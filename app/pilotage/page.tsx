import { fetchProjects } from '@/lib/notion'
import PilotageDashboard from '@/components/PilotageDashboard'

// Revalidation ISR : les mises à jour Notion apparaissent dans les 5 minutes (§9).
export const revalidate = 300

export default async function PilotagePage() {
  const payload = await fetchProjects()
  return <PilotageDashboard payload={payload} />
}
