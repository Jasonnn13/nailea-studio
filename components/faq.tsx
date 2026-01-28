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
    <section id="faq" className="py-24 bg-gradient-to-b from-background via-background to-accent/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/10 rounded-full"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest text-sm uppercase mb-4">Got Questions?</p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            Frequently Asked
          </h2>
          <p className="font-script text-primary text-5xl md:text-6xl">Questions</p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-8"></div>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`group bg-card/50 backdrop-blur-sm border border-accent/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${openFaq === index ? 'ring-1 ring-primary/20' : ''}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left p-6"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-heading text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                </div>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-primary text-sm transition-all duration-300 ${openFaq === index ? 'rotate-180 bg-primary/20' : ''}`}>
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
        <div className="text-center mt-12 pt-8">
          <p className="text-muted-foreground text-sm">
            Still have questions? 
            <a href="#contact" className="text-primary hover:underline ml-2 font-medium">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  )
}
