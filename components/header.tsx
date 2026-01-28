'use client'

import Link from 'next/link'
import { Button } from '../components/ui/button'
import { handleSmoothScroll, handleHomeClick } from '@/lib/smooth-scroll'

export function Header() {
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

          {/* Navigation */}
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

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-md"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
