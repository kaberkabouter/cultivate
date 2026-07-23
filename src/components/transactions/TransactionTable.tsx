'use client'

import { deleteTransactionAction } from '@/app/actions'
import { TransactionWithTopic } from '@/lib/dal/transactions'
import { DbTopic } from '@/db/schema'
import { CreateTransactionModal } from './CreateTransactionModal'
import { ArrowUpRight, ArrowDownRight, Repeat, Trash2, Receipt } from 'lucide-react'

interface TransactionTableProps {
  transactions: TransactionWithTopic[]
  topics: DbTopic[]
  activeTopicFilter: string
}

export function TransactionTable({ transactions, topics, activeTopicFilter }: TransactionTableProps) {
  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransactionAction(id)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" /> Transactions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTopicFilter === 'all'
              ? 'Showing all income and expense entries'
              : `Filtered by selected topic`}
          </p>
        </div>

        <CreateTransactionModal topics={topics} defaultTopicId={activeTopicFilter} />
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
          <p className="text-slate-400 text-sm font-medium">No transactions recorded yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Transaction" above to create your first entry.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-2">Type</th>
                <th className="pb-3 px-2">Description</th>
                <th className="pb-3 px-2">Topic</th>
                <th className="pb-3 px-2">Date</th>
                <th className="pb-3 px-2">Recurrence</th>
                <th className="pb-3 px-2 text-right">Amount</th>
                <th className="pb-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map((t) => {
                const isIncome = t.type === 'income'
                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                          isIncome
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {t.type}
                      </span>
                    </td>

                    <td className="py-3 px-2 font-medium text-slate-100">
                      <div>{t.description}</div>
                      <div className="text-[11px] text-slate-500">{t.category}</div>
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 font-medium"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: t.topic?.color || '#3b82f6' }}
                        />
                        {t.topic?.name || 'General'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-slate-400 text-xs">{t.date}</td>

                    <td className="py-3 px-2 text-xs">
                      {t.recurrence !== 'once' ? (
                        <span className="inline-flex items-center gap-1 text-teal-400 font-medium bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md">
                          <Repeat className="w-3 h-3" /> {t.recurrence}
                        </span>
                      ) : (
                        <span className="text-slate-500">One-off</span>
                      )}
                    </td>

                    <td className={`py-3 px-2 text-right font-semibold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>

                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
