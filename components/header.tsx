'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { handleSmoothScroll, handleHomeClick } from '@/lib/smooth-scroll'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId?: string) => {
    setMobileMenuOpen(false)
    if (targetId) {
      handleSmoothScroll(e, targetId)
    } else {
      handleHomeClick(e)
    }
  }

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
            <a 
              href="#"
              onClick={handleHomeClick}
              className="text-sm text-foreground hover:text-primary transition-colors relative group cursor-pointer"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#services"
              onClick={(e) => handleSmoothScroll(e, '#services')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors relative group cursor-pointer"
            >
              Service
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#faq"
              onClick={(e) => handleSmoothScroll(e, '#faq')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors relative group cursor-pointer"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors relative group cursor-pointer"
            >
              Contacts
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-md"
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-accent/20 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground my-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="bg-background/95 backdrop-blur-lg border-t border-accent/20 px-4 py-6 space-y-4">
          <a 
            href="#"
            onClick={(e) => handleMobileNavClick(e)}
            className="block py-3 px-4 text-foreground hover:text-primary hover:bg-accent/10 rounded-lg transition-colors font-medium"
          >
            Home
          </a>
          <a 
            href="#services"
            onClick={(e) => handleMobileNavClick(e, '#services')}
            className="block py-3 px-4 text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-lg transition-colors font-medium"
          >
            Service
          </a>
          <a 
            href="#faq"
            onClick={(e) => handleMobileNavClick(e, '#faq')}
            className="block py-3 px-4 text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-lg transition-colors font-medium"
          >
            FAQ
          </a>
          <a 
            href="#contact"
            onClick={(e) => handleMobileNavClick(e, '#contact')}
            className="block py-3 px-4 text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-lg transition-colors font-medium"
          >
            Contacts
          </a>
          <div className="pt-4 border-t border-accent/20">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
              >
                Login
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
