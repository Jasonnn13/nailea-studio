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
    <section
      id="faq"
      className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-background to-secondary/15"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-3xl animate-float" />
        <div className="absolute bottom-10 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-secondary/25 via-primary/10 to-transparent blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      {/* Subtle ring decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-foreground/[0.03] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-foreground/[0.04] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered header */}
        <div className="text-center mb-16" data-animate="item">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Got Questions?
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            Frequently Asked
          </h2>
          <p className="font-script text-primary text-5xl md:text-6xl">Questions</p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-8" />
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4" data-animate="item">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`group bg-background/60 backdrop-blur-xl border border-foreground/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${openFaq === index ? 'ring-1 ring-primary/20 bg-background/80' : ''}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left p-6"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-heading text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                </div>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-foreground/5 text-primary text-sm transition-all duration-300 ${openFaq === index ? 'rotate-180 bg-primary/15' : ''}`}>
                  ▼
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}>
                <p className="px-6 pb-6 pl-20 text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14 pt-8" data-animate="item">
          <p className="text-muted-foreground text-sm">
            Still have questions?
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-primary hover:underline ml-2 font-medium transition-colors"
            >
              Contact us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
