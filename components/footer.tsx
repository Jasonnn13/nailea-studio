'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-b from-secondary/10 via-background to-background border-t border-foreground/5">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-3xl" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-secondary/20 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14" data-animate="item">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-script text-3xl text-foreground hover:text-primary transition-colors">Nailea</span>
              <span className="block text-[10px] tracking-[0.3em] text-muted-foreground mt-0.5">NAIL STUDIO</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
              Where elegance meets artistry. Premium nail care that transforms your look.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <a href="https://www.instagram.com/naileastudiotangerang" className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com" className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-5 h-[2px] bg-primary/40 rounded-full" />
              About
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Gallery</Link></li>
              <li><Link href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Benefit</Link></li>
              <li><Link href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">FAQ</Link></li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-5 h-[2px] bg-primary/40 rounded-full" />
              Service
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#services" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Manicure</Link></li>
              <li><Link href="#services" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Pedicure</Link></li>
              <li><Link href="#services" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Nail Polish</Link></li>
              <li><Link href="#services" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Nail Art</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-5 h-[2px] bg-primary/40 rounded-full" />
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Jl. Taman Permata No.192<br />Binong, Tangerang</span>
              </li>
              <li><a href="https://wa.me/6282128228227" className="hover:text-primary transition-colors flex items-center gap-2"><svg className="w-4 h-4 text-primary/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>082128228227</a></li>
              <li><a href="https://www.instagram.com/naileastudiotangerang" className="hover:text-primary transition-colors flex items-center gap-2"><svg className="w-4 h-4 text-primary/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm5-4v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" /></svg>@NAILEASTUDIOTANGERANG</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-4" data-animate="item">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Nailea Studio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Crafted with care in Tangerang
          </p>
        </div>
      </div>
    </footer>
  )
}
