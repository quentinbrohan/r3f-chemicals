import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '@/components/Header'
import { inter } from './fonts'
import { GSAP } from '@/components/GSAP'

export const viewport: Viewport = {
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://chemicals.quentinbrohan.fr'),
  title: 'Chemicals',
  description: 'Real-time visualization of hormones with procedural shaders. Built with React Three Fiber and GSAP.',
  authors: [{ name: 'Quentin Brohan', url: 'https://www.quentinbrohan.fr/' }],
  openGraph: {
    title: 'Chemicals',
    description: 'Real-time visualization of hormones with procedural shaders. Built with React Three Fiber and GSAP.',
    url: 'https://chemicals.quentinbrohan.fr/',
    siteName: 'Chemicals',
    images: [{ url: '/og.jpg', width: 1200, height: 628, alt: 'Chemicals — WebGL hormone visualization' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chemicals',
    description: 'Real-time visualization of hormones with procedural shaders. Built with React Three Fiber and GSAP.',
    images: ['/og.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-inter dark ${inter.variable}`} suppressHydrationWarning>
        <Header />
        <GSAP />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
