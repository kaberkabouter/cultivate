import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'emerald' | 'teal' | 'rose' | 'amber' | 'blue' | 'slate'
export type BadgeStyle = 'soft' | 'outline' | 'solid'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  badgeStyle?: BadgeStyle
  ref?: React.Ref<HTMLSpanElement>
}

const variantClasses: Record<BadgeVariant, Record<BadgeStyle, string>> = {
  emerald: {
    soft: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    outline: 'bg-transparent text-emerald-400 border border-emerald-500/40',
    solid: 'bg-emerald-500 text-slate-950 font-bold',
  },
  teal: {
    soft: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    outline: 'bg-transparent text-teal-400 border border-teal-500/40',
    solid: 'bg-teal-500 text-slate-950 font-bold',
  },
  rose: {
    soft: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    outline: 'bg-transparent text-rose-400 border border-rose-500/40',
    solid: 'bg-rose-500 text-slate-950 font-bold',
  },
  amber: {
    soft: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    outline: 'bg-transparent text-amber-400 border border-amber-500/40',
    solid: 'bg-amber-500 text-slate-950 font-bold',
  },
  blue: {
    soft: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    outline: 'bg-transparent text-blue-400 border border-blue-500/40',
    solid: 'bg-blue-500 text-slate-950 font-bold',
  },
  slate: {
    soft: 'bg-slate-800/80 text-slate-300 border border-slate-700',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
    solid: 'bg-slate-700 text-slate-100 font-bold',
  },
}

export function Badge({
  variant = 'emerald',
  badgeStyle = 'soft',
  className,
  children,
  ref,
  ...props
}: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors',
        variantClasses[variant][badgeStyle],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
