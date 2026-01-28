import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Great_Vibes } from 'next/font/google'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-heading' });
const _greatVibes = Great_Vibes({ subsets: ["latin"], weight: '400', variable: '--font-script' });

export const metadata: Metadata = {
  title: 'Nailea Studio - Premium Nail Art Salon',
  description: 'Elegant nail art and beauty services at Nailea Studio',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
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
