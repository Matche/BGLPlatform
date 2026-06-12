'use client'

import './ChartSetup'
import { Bar } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import type { Project } from '@/types/project'
import { avgPct } from '@/lib/utils'

/** Bar chart horizontal : avancement (%) par projet, trié décroissant. */
export default function ProgressChart({ projects }: { projects: Project[] }) {
  const sorted = [...projects].sort((a, b) => avgPct(b) - avgPct(a))
  const values = sorted.map(avgPct)

  const data = {
    labels: sorted.map((p) => p.name),
    datasets: [
      {
        data: values,
        backgroundColor: values.map((v) => (v >= 40 ? '#00915A' : v >= 20 ? '#27455C' : '#E07818')),
        borderRadius: 5,
        borderSkipped: false as const,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, max: 100, ticks: { font: { size: 9 }, callback: (v) => v + '%' } },
      y: { ticks: { font: { size: 10 }, color: '#27455C' } },
    },
  }

  return <Bar data={data} options={options} />
}
