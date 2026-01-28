import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Great_Vibes } from 'next/font/google'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-heading' });
const _greatVibes = Great_Vibes({ subsets: ["latin"], weight: '400', variable: '--font-script' });

export const metadata: Metadata = {
  title: 'Nailea Studio - Premium Nail Art Salon',
  description: 'Elegant nail art and beauty services at Nailea Studio',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_playfair.variable} ${_greatVibes.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
