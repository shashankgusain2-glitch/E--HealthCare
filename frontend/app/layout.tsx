import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SessionProviders from '@/providers/SessionProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'HealthCare+ | Book OPD Appointments at Uttarakhand Government Hospitals',
  description: 'Book OPD appointments online at verified government hospitals across Uttarakhand. Skip queues, consult specialists, and manage your health digitally — all in one platform.',
  keywords: ['OPD booking', 'Uttarakhand hospitals', 'government hospital appointment', 'online doctor consultation', 'healthcare Uttarakhand'],
  authors: [{ name: 'HealthCare+ Team' }],
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProviders>
          {children}
        </SessionProviders>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
