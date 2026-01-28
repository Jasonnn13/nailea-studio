'use client'

import { Card } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string
  icon: string
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/60 mb-2 tracking-wide uppercase">{title}</p>
          <p className="font-heading text-3xl text-primary font-bold">{value}</p>
        </div>
        <span className="text-4xl opacity-40">{icon}</span>
      </div>
    </Card>
  )
}
