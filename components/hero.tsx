'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { handleSmoothScroll } from '@/lib/smooth-scroll'

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-transparent blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/30 via-primary/10 to-transparent blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-accent/20 via-primary/5 to-transparent blur-2xl animate-float" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 lg:space-y-10">
            <div data-animate="item">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Premium Nail Studio
              </span>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.95] tracking-tight">
                <span className="relative">
                  <span className="font-script text-primary text-6xl sm:text-7xl md:text-8xl lg:text-9xl">Nailea</span>
                  <span className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10" />
                </span>
                <br />
                <span className="text-foreground/90">Studio</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed" data-animate="item">
              Where elegance meets artistry. Experience premium nail care that transforms your look and elevates your confidence.
            </p>

            <div className="flex flex-wrap gap-4" data-animate="item">
              <Link href="#services" onClick={(e) => handleSmoothScroll(e, '#services')}>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Services
                </Button>
              </Link>
              <a href="https://wa.me/6282128228227" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-foreground/20 text-foreground hover:bg-foreground/5 px-8 py-6 text-base rounded-full bg-background/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Book Appointment
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4" data-animate="item">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background flex items-center justify-center text-xs font-medium text-foreground/70">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">500+ Happy Clients</p>
                <p className="text-muted-foreground">Trust our expertise</p>
              </div>
            </div>
          </div>

          {/* Right - Image composition */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px]" data-animate="item">
            {/* Glow behind images */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-3xl" />
            </div>

            {/* Main featured image */}
            <div className="relative w-72 h-[420px] rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10 ring-1 ring-foreground/5 z-20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/hero-nails.png"
                alt="Beautiful nail art design"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 288px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
            </div>
            
            {/* Secondary image */}
            <div className="absolute top-8 -right-4 w-56 h-72 rounded-2xl overflow-hidden shadow-xl shadow-foreground/10 ring-1 ring-foreground/5 z-10 -rotate-6 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/hero-nails2.png"
                alt="Elegant nail design"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 224px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />
            </div>

            {/* Floating glass cards */}
            <div className="absolute -left-8 top-20 px-4 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-foreground/10 shadow-lg z-30 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Premium Quality</p>
                  <p className="text-xs text-muted-foreground">Top-tier products</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-32 px-4 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-foreground/10 shadow-lg z-30 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                  <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">5.0 Rating</p>
                  <p className="text-xs text-muted-foreground">200+ Reviews</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-3 h-3 rounded-full bg-primary/60 animate-pulse" />
            <div className="absolute bottom-20 left-0 w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-0 w-4 h-4 rounded-full border-2 border-primary/30 animate-float" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-current animate-bounce" />
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="relative z-10 border-t border-border/30 bg-gradient-to-b from-transparent via-secondary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16" data-animate="item">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Why Choose
              <span className="font-script text-primary text-4xl md:text-5xl lg:text-6xl ml-3">Nailea?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Experience the difference with our premium services and dedicated care
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" data-animate="item">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Affordable Luxury',
                desc: 'Premium quality at prices that respect your budget.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: 'Easy Payment',
                desc: 'Multiple payment options for your convenience.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Expert Care',
                desc: 'Skilled professionals dedicated to perfection.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Prime Location',
                desc: 'Easy to reach in the heart of the city.',
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="group relative p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-foreground/5 hover:border-primary/20 hover:bg-background/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="font-heading text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
