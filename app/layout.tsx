import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '@/components/Header'
import { inter } from './fonts'
import { GSAP } from '@/components/GSAP'

export const metadata: Metadata = {
  title: 'Chemicals',
  description: 'Real-time visualization of hormones with procedural shaders. R3F.',
  authors: [
    {
      name: 'Quentin Brohan',
      url: 'https://www.quentinbrohan.fr/'
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-inter dark ${inter.variable}`}>
        <Header />
        <GSAP />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
