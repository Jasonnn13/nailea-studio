'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from '@/components/header'
import { Services } from '@/components/services'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'

export default function Home() {
  const sectionRefs = useRef<HTMLDivElement[]>([])

  const addSectionRef = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el)
    }
  }

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section) => {
        const items = section.querySelectorAll('[data-animate="item"]')
        if (items.length > 0) {
          gsap.set(items, { y: 24, autoAlpha: 0 })
          gsap.to(items, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          })
        } else {
          gsap.fromTo(
            section,
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <div ref={addSectionRef}>
        <Hero />
      </div>
      <div ref={addSectionRef}>
        <Services />
      </div>
      <div ref={addSectionRef}>
        <FAQ />
      </div>
      <div ref={addSectionRef}>
        <Footer />
      </div>
    </main>
  )
}
