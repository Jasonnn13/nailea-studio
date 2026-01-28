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
    <section id="services" className="py-24 bg-background">
      {/* Price list section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide text-sm uppercase mb-4">Pricing</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Save your time by using<br />
            <span className="font-script text-primary text-4xl md:text-5xl">our service</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(dbServices).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/10 border-b border-border/50">
                  <th className="text-left py-4 px-6 font-heading text-foreground">Service</th>
                  <th className="text-left py-4 px-6 font-heading text-foreground hidden md:table-cell">Duration</th>
                  <th className="text-right py-4 px-6 font-heading text-foreground">Price</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dbServices).map(([category, items]) => (
                  <Fragment key={category}>
                    <tr className="bg-secondary/30">
                      <td colSpan={3} className="py-3 px-6">
                        <span className="font-heading text-lg text-primary">{category}</span>
                      </td>
                    </tr>
                    {items.map((item, idx) => (
                      <tr 
                        key={item.uid} 
                        className={`border-b border-border/30 hover:bg-secondary/20 transition-colors ${
                          idx === items.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <span className="text-foreground font-medium">{item.name}</span>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground hidden md:table-cell">
                          {item.duration ? `${item.duration} min` : '-'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-heading font-bold text-primary text-lg">
                            {item.price.toLocaleString('id-ID')}k
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
    </section>
  )
}
