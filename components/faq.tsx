'use client'

import { useState } from 'react'

const faqItems = [
  { q: 'How to book a service?', a: 'You can book via WhatsApp or visit our studio directly.' },
  { q: 'Payment method?', a: 'We accept cash, bank transfer, and e-wallets.' },
  { q: 'Opening Hours?', a: 'Monday - Sunday, 10:00 AM - 8:00 PM' },
  { q: 'How much the cost?', a: 'Starting from 50k for basic services. Check our full price list.' },
]

export function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - FAQ */}
          <div>
            <p className="text-primary font-medium tracking-wide text-sm uppercase mb-4">FAQ</p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-10">
              Frequently asked<br />
              <span className="font-script text-primary text-4xl md:text-5xl">question</span>
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className="border-b border-border/50 pb-4"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left py-2 group"
                  >
                    <span className="font-heading text-foreground group-hover:text-primary transition-colors">
                      {item.q}
                    </span>
                    <span className={`text-primary transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {openFaq === index && (
                    <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary/30">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image placeholder */}
          <div className="relative hidden lg:block">
            <div className="aspect-square bg-gradient-to-br from-secondary to-accent/30 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">💅</span>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/20 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
