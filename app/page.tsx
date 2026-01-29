'use client'

import { Header } from '@/components/header'
import { Services } from '@/components/services'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <Hero />
      <Services />
      <FAQ />
      <Footer />
    </main>
  )
}
