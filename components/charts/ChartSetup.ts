'use client'

// Enregistrement global des éléments Chart.js utilisés par les graphiques.
// Importé une seule fois ; react-chartjs-2 réutilise l'instance enregistrée.
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

export { ChartJS }
