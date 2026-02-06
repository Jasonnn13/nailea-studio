'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { Button } from '../components/ui/button'
import { handleSmoothScroll, handleHomeClick } from '@/lib/smooth-scroll'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<HTMLAnchorElement[]>([])
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  const navItems = [
    { label: 'Home', href: '#', targetId: undefined },
    { label: 'Service', href: '#services', targetId: '#services' },
    { label: 'FAQ', href: '#faq', targetId: '#faq' },
    { label: 'Contacts', href: '#contact', targetId: '#contact' },
  ]

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId?: string) => {
    setMobileMenuOpen(false)
    if (targetId) {
      handleSmoothScroll(e, targetId)
    } else {
      handleHomeClick(e)
    }
  }

  useLayoutEffect(() => {
    if (!overlayRef.current || !panelRef.current) return

    gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' })
    gsap.set(panelRef.current, { yPercent: -6, scale: 1.02, autoAlpha: 0 })
    gsap.set(itemRefs.current, { y: 18, autoAlpha: 0 })
    if (closeButtonRef.current) {
      gsap.set(closeButtonRef.current, { autoAlpha: 0, scale: 0.9 })
    }
  }, [])

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return

    const overlay = overlayRef.current
    const panel = panelRef.current
    const items = itemRefs.current
    const closeButton = closeButtonRef.current

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlay, { pointerEvents: 'auto' })
      gsap.to(overlay, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
      gsap.to(panel, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: 'power3.out' })
      if (closeButton) {
        gsap.to(closeButton, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out', delay: 0.1 })
      }
      gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.08, delay: 0.12 })
      return
    }

    document.body.style.overflow = ''
    gsap.to(items, { autoAlpha: 0, y: 14, duration: 0.2, ease: 'power2.in' })
    if (closeButton) {
      gsap.to(closeButton, { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: 'power2.in' })
    }
    gsap.to(panel, { yPercent: -6, scale: 1.02, autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => { gsap.set(overlay, { pointerEvents: 'none' }) },
    })
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-script text-2xl text-foreground hover:text-primary transition-colors">
              Nailea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => (item.targetId ? handleSmoothScroll(e, item.targetId) : handleHomeClick(e))}
                className="text-sm text-foreground hover:text-primary transition-colors relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Link href="/login">
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-md"
              >
                Login
              </Button>
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-accent/20 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-overlay-nav"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground my-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Overlay */}
      <div
        id="mobile-overlay-nav"
        ref={overlayRef}
        className="md:hidden fixed inset-0 z-40"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div
          ref={panelRef}
          className="absolute inset-0 bg-background/98 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]"></div>
          <div className="relative h-full px-6 pt-24 pb-12 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-script text-2xl text-foreground">Nailea</span>
              <button
                ref={closeButtonRef}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-accent/40 text-foreground hover:bg-accent/20 transition-colors"
                aria-label="Close menu"
              >
                <span className="block w-4 h-0.5 bg-foreground rotate-45 translate-y-0.5"></span>
                <span className="block w-4 h-0.5 bg-foreground -rotate-45 -translate-y-0.5 -ml-4"></span>
              </button>
            </div>

            <nav className="mt-16 flex-1 flex flex-col justify-center gap-8">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  ref={(el) => {
                    if (el) itemRefs.current[index] = el
                  }}
                  href={item.href}
                  onClick={(e) => handleMobileNavClick(e, item.targetId)}
                  className="text-3xl sm:text-4xl font-heading text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-3">
              {pathname !== '/' && (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md">
                    Login
                  </Button>
                </Link>
              )}
              <a href="https://wa.me/6282128228227" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="w-full border-primary/30 text-foreground hover:bg-primary/5 rounded-md bg-transparent"
                >
                  Book Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
