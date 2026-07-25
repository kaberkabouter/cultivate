'use client'

import { deleteTransactionAction } from '@/app/actions'
import { TransactionWithTopic } from '@/lib/dal/transactions'
import { DbTopic } from '@/db/schema'
import { CreateTransactionModal } from './CreateTransactionModal'
import { ArrowUpRight, ArrowDownRight, Repeat, Trash2, Receipt } from 'lucide-react'
import { useDialog } from '@/components/ui/DialogProvider'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Button,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: TransactionWithTopic[]
  topics: DbTopic[]
  activeTopicFilter: string
}

export function TransactionTable({ transactions, topics, activeTopicFilter }: TransactionTableProps) {
  const dialog = useDialog()

  async function handleDelete(id: string) {
    const confirmed = await dialog.confirm({
      title: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction entry? This action cannot be undone.',
      confirmText: 'Delete Transaction',
      cancelText: 'Cancel',
      variant: 'destructive',
    })

    if (confirmed) {
      await deleteTransactionAction(id)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  return (
    <Card>
      <CardHeader className="flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 space-y-0">
        <div>
          <CardTitle>
            <Receipt className="w-5 h-5 text-emerald-400" /> Transactions
          </CardTitle>
          <CardDescription className="mt-0.5">
            {activeTopicFilter === 'all'
              ? 'Showing all income and expense entries'
              : `Filtered by selected topic`}
          </CardDescription>
        </div>

        <CreateTransactionModal topics={topics} defaultTopicId={activeTopicFilter} />
      </CardHeader>

      {transactions.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
          <p className="text-slate-400 text-sm font-medium">No transactions recorded yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click &quot;Add Transaction&quot; above to create your first entry.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Recurrence</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              const isIncome = t.type === 'income'
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    <Badge variant={isIncome ? 'emerald' : 'rose'}>
                      {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {t.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium text-slate-100">
                    <div>{t.description}</div>
                    <div className="text-[11px] text-slate-500">{t.category}</div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 font-medium">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.topic?.color || '#3b82f6' }}
                      />
                      {t.topic?.name || 'General'}
                    </span>
                  </TableCell>

                  <TableCell className="text-slate-400 text-xs">{t.date}</TableCell>

                  <TableCell className="text-xs">
                    {t.recurrence !== 'once' ? (
                      <Badge variant="teal">
                        <Repeat className="w-3 h-3" /> {t.recurrence}
                      </Badge>
                    ) : (
                      <span className="text-slate-500">One-off</span>
                    )}
                  </TableCell>

                  <TableCell className={cn('text-right font-semibold', isIncome ? 'text-emerald-400' : 'text-rose-400')}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(t.id)}
                      title="Delete Transaction"
                      aria-label="Delete Transaction"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
