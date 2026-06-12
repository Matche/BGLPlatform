import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const barlow = Barlow_Condensed({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'INSKIP — AI Facilitator BGL BNP',
  description: 'Dashboard de reporting de coaching IA — programme AI Facilitator BGL BNP Paribas, coaché par INSKIP.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  )
}
