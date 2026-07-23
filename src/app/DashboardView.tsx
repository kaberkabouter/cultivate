'use client'

import { useState } from 'react'
import { TopicList } from '@/components/topics/TopicList'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { ForecastChart } from '@/components/forecast/ForecastChart'
import { DbTopic, DbTransaction } from '@/db/schema'
import { TransactionWithTopic } from '@/lib/dal/transactions'
import { LineChart, Folder, Receipt } from 'lucide-react'

interface DashboardViewProps {
  topics: DbTopic[]
  transactions: TransactionWithTopic[]
}

export function DashboardView({ topics, transactions }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'forecast' | 'topics' | 'transactions'>('forecast')
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all')

  const forecastTransactions = transactions.map((t) => ({
    id: t.id,
    topicId: t.topicId,
    type: t.type,
    amount: t.amount,
    description: t.description,
    date: t.date,
    recurrence: t.recurrence,
  }))

  const forecastTopics = topics.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    isDefault: t.isDefault,
    isActiveInForecast: t.isActiveInForecast,
  }))

  const filteredTransactions =
    activeTopicFilter === 'all'
      ? transactions
      : transactions.filter((t) => t.topicId === activeTopicFilter)

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'forecast'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="w-4 h-4" /> Financial Forecast
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Folder className="w-4 h-4" /> Topics & Projects ({topics.length})
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" /> Transactions ({transactions.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'forecast' && (
        <div className="space-y-8">
          <ForecastChart transactions={forecastTransactions} topics={forecastTopics} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TopicList
                topics={topics}
                activeTopicFilter={activeTopicFilter}
                onSelectTopicFilter={(id) => {
                  setActiveTopicFilter(id)
                  setActiveTab('transactions')
                }}
              />
            </div>
            <div className="lg:col-span-2">
              <TransactionTable
                transactions={filteredTransactions}
                topics={topics}
                activeTopicFilter={activeTopicFilter}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <TopicList
          topics={topics}
          activeTopicFilter={activeTopicFilter}
          onSelectTopicFilter={(id) => {
            setActiveTopicFilter(id)
            setActiveTab('transactions')
          }}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionTable
          transactions={filteredTransactions}
          topics={topics}
          activeTopicFilter={activeTopicFilter}
        />
      )}
    </div>
  )
}
