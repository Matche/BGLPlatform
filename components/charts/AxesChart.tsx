'use client'

import './ChartSetup'
import { Bar } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import type { Project } from '@/types/project'
import { AX_KEYS, AX_LABELS } from '@/lib/utils'

/** Bar chart horizontal : score moyen (%) par axe d'évaluation. */
export default function AxesChart({ projects }: { projects: Project[] }) {
  const axAvg = AX_KEYS.map((k) =>
    Math.round((projects.reduce((s, p) => s + (p[k] as number), 0) / projects.length / 3) * 100),
  )

  const data = {
    labels: AX_LABELS,
    datasets: [
      {
        data: axAvg,
        backgroundColor: axAvg.map((v) => (v >= 70 ? '#00915A' : v >= 40 ? '#27455C' : '#E07818')),
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
      y: { ticks: { font: { size: 9 } } },
    },
  }

  return <Bar data={data} options={options} />
}
