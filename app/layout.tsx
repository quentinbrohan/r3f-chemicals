import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '@/components/Header'
import { inter } from './fonts'
import { GSAP } from '@/components/GSAP'

export const metadata: Metadata = {
  title: 'Chemicals',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-inter dark ${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}>
        <Header />
        <GSAP />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
