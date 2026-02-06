'use client'

import { useState, useEffect, Fragment } from 'react'

type ServiceItem = {
  uid: string
  name: string
  description: string | null
  price: number
  duration: number | null
}

type ServicesByCategory = Record<string, ServiceItem[]>

export function Services() {
  const [dbServices, setDbServices] = useState<ServicesByCategory>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services')
        if (res.ok) {
          const data = await res.json()
          setDbServices(data)
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <section
      id="services"
      className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-background to-secondary/15"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-secondary/30 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
      </div>

      {/* Price list section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-animate="item">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Signature Treatments
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Curated Services for
            <span className="font-script text-primary text-4xl md:text-5xl lg:text-6xl ml-3">Beautiful Nails</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From classic care to statement art, each service is crafted with precision and premium products.
          </p>
        </div>

        <div data-animate="item">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading services...</p>
            </div>
          ) : Object.keys(dbServices).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No services available at the moment.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-foreground/5 bg-background/70 backdrop-blur-xl shadow-xl shadow-foreground/5">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border-b border-foreground/5">
                    <th className="text-left py-5 px-6 font-heading text-foreground/90">Service</th>
                    <th className="text-left py-5 px-6 font-heading text-foreground/90 hidden md:table-cell">Duration</th>
                    <th className="text-right py-5 px-6 font-heading text-foreground/90">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dbServices).map(([category, items]) => (
                    <Fragment key={category}>
                      <tr className="bg-secondary/20">
                        <td colSpan={3} className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                            <span className="font-heading text-lg text-primary">{category}</span>
                          </div>
                        </td>
                      </tr>
                      {items.map((item, idx) => (
                        <tr 
                          key={item.uid} 
                          className={`border-b border-foreground/5 hover:bg-secondary/10 transition-colors ${
                            idx === items.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="py-5 px-6">
                            <div className="space-y-1">
                              <span className="text-foreground font-medium tracking-tight">{item.name}</span>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-5 px-6 text-muted-foreground hidden md:table-cell">
                            {item.duration ? `${item.duration} minutes` : '-'}
                          </td>
                          <td className="py-5 px-6 text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-foreground font-medium">
                              {item.price.toLocaleString('id-ID')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
