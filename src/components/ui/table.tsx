import React from 'react'
import { cn } from '@/lib/utils'

export function Table({
  className,
  children,
  ref,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }) {
  return (
    <div className="overflow-x-auto">
      <table ref={ref} className={cn('w-full text-left text-sm text-slate-300', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }) {
  return (
    <thead ref={ref} className={cn('border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }) {
  return (
    <tbody ref={ref} className={cn('divide-y divide-slate-800/60', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { ref?: React.Ref<HTMLTableRowElement> }) {
  return (
    <tr ref={ref} className={cn('hover:bg-slate-800/40 transition', className)} {...props}>
      {children}
    </tr>
  )
}

export function TableHead({
  className,
  children,
  ref,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    <th ref={ref} className={cn('pb-3 px-3 font-semibold text-slate-400', className)} {...props}>
      {children}
    </th>
  )
}

export function TableCell({
  className,
  children,
  ref,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    <td ref={ref} className={cn('py-3 px-3', className)} {...props}>
      {children}
    </td>
  )
}
