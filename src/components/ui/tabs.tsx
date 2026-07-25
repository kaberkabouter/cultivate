'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export function TabsList({ className, children, ref, ...props }: TabsListProps) {
  return (
    <div
      ref={ref}
      className={cn('inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

export function TabsTrigger({ isActive, className, children, ref, ...props }: TabsTriggerProps) {
  return (
    <button
      ref={ref}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer',
        isActive
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
          : 'text-slate-400 hover:text-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
