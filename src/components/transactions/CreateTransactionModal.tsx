'use client'

import { useState } from 'react'
import { createTransactionAction } from '@/app/actions'
import { DbTopic } from '@/db/schema'
import { Plus, Receipt } from 'lucide-react'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Select,
  Button,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface CreateTransactionModalProps {
  topics: DbTopic[]
  defaultTopicId?: string
}

export function CreateTransactionModal({ topics, defaultTopicId }: CreateTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedTopic = defaultTopicId && defaultTopicId !== 'all' ? defaultTopicId : topics[0]?.id || ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('type', type)

    const res = await createTransactionAction(formData)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Add Transaction
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="lg">
        <DialogHeader>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record a fixed-date or recurring income or expense</DialogDescription>
          </div>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                'py-2 rounded-lg text-xs font-bold transition cursor-pointer',
                type === 'income' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              + Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                'py-2 rounded-lg text-xs font-bold transition cursor-pointer',
                type === 'expense' ? 'bg-rose-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              - Expense
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Topic"
              name="topicId"
              defaultValue={selectedTopic}
              options={topics.map((t) => ({
                value: t.id,
                label: `${t.name} ${t.isDefault ? '(Default)' : ''}`,
              }))}
            />

            <Input
              label="Amount ($ / €)"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
            />
          </div>

          <Input
            label="Description"
            name="description"
            type="text"
            required
            placeholder="e.g. Monthly Salary, Office Supplies, Contractor Fee"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              required
              defaultValue={todayStr}
            />

            <Select
              label="Recurrence"
              name="recurrence"
              defaultValue="once"
              options={[
                { value: 'once', label: 'Once' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />

            <Input
              label="Category"
              name="category"
              type="text"
              defaultValue="General"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Save Transaction
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
