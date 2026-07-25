import React from 'react'
import { Card } from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function StatCard({ title, value, change, trend = 'neutral', icon, description, className }: StatCardProps) {
  return (
    <Card className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700/60">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-slate-100">{value}</div>
        {(change || description) && (
          <div className="flex items-center gap-2 mt-2">
            {change && (
              <Badge variant={trend === 'up' ? 'emerald' : trend === 'down' ? 'rose' : 'slate'}>
                {change}
              </Badge>
            )}
            {description && <span className="text-xs text-slate-500">{description}</span>}
          </div>
        )}
      </div>
    </Card>
  )
}
