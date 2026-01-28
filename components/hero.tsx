'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { handleSmoothScroll } from '@/lib/smooth-scroll'

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative curved shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <svg className="absolute top-0 left-0 h-full w-full" viewBox="0 0 500 800" preserveAspectRatio="none">
          <path
            d="M100,0 Q0,400 100,800 L500,800 L500,0 Z"
            fill="currentColor"
            className="text-secondary/50"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wide text-sm uppercase">Premium Nail Studio</p>
              <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.9]">
                Studio<br />
                <span className="font-script text-primary">Nailea</span>
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              We make your nails look beautiful and healthy. We provide you with many amazing services, try now.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="#services"
              onClick={(e) => handleSmoothScroll(e, '#services')}>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-md"
                >
                  Get Started
                </Button>
              </Link>
              <a href="https://wa.me/6282128228227" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/30 text-foreground hover:bg-primary/5 px-8 py-6 text-base rounded-md bg-transparent"
                >
                  Book Now
                </Button>
              </a>
            </div>
          </div>

          {/* Right - Image composition */}
          <div className="relative hidden lg:block h-[520px]">
            {/* Back image (right) */}
            <div className="absolute top-0 right-0 w-72 h-96 rounded-2xl overflow-hidden shadow-xl z-10">
              <Image
                src="/hero-nails2.png"
                alt="Elegant nail design"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Front image (left, overlapping and lower) */}
            <div className="absolute top-24 right-40 w-72 h-96 rounded-2xl overflow-hidden shadow-2xl z-20">
              <Image
                src="/hero-nails.png"
                alt="Beautiful peach colored nails"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 right-24 w-20 h-20 rounded-full bg-accent/40 z-0"></div>
            <div className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-primary/10 z-0"></div>
            <div className="absolute top-40 left-0 w-16 h-16 border-2 border-primary/30 rounded-full z-0"></div>
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="relative z-10 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
              We have a lot of benefit<br />
              <span className="font-script text-primary text-4xl md:text-5xl">you may like</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Affordable Price',
                desc: 'We give you exclusive and luxury design but also an affordable price so every person can afford.',
                icon: '💰'
              },
              {
                title: 'Easy Payment',
                desc: 'We work with many payment methods so you have many payment options.',
                icon: '💳'
              },
              {
                title: 'Best Service',
                desc: 'We never disappoint our customer because we give them our best service.',
                icon: '⭐'
              },
              {
                title: 'Great Location',
                desc: 'Our place is in the middle of city therefore you can reach us easily.',
                icon: '📍'
              }
            ].map((benefit, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-12 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
