import { fetchProjects } from '@/lib/notion'
import Dashboard from '@/components/Dashboard'

// Revalidation ISR : les mises à jour Notion apparaissent dans les 5 minutes (§9).
export const revalidate = 300

export default async function Home() {
  const payload = await fetchProjects()
  return <Dashboard payload={payload} />
}
