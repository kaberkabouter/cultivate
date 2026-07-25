import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
}

export function Input({
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  className,
  id,
  ref,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startAdornment && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {startAdornment}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition',
            'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30',
            startAdornment && 'pl-10',
            endAdornment && 'pr-10',
            className
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  )
}
