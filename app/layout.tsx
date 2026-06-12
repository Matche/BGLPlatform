import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { RoleProvider } from '@/components/role/RoleProvider'
import AppHeader from '@/components/layout/AppHeader'

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
      <body>
        <RoleProvider>
          <AppHeader />
          {children}
          <div className="footer">
            Reporting Coaching INSKIP — AI Facilitator Programme BGL BNP · Mis à jour mensuellement à partir des
            sessions de coaching et des transcripts Notion.
          </div>
        </RoleProvider>
      </body>
    </html>
  )
}
