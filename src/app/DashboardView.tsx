'use client'

import { useState } from 'react'
import { TopicList } from '@/components/topics/TopicList'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { ForecastChart } from '@/components/forecast/ForecastChart'
import { DbTopic } from '@/db/schema'
import { TransactionWithTopic } from '@/lib/dal/transactions'
import { LineChart, Folder, Receipt } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui'

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
        <TabsList>
          <TabsTrigger
            isActive={activeTab === 'forecast'}
            onClick={() => setActiveTab('forecast')}
          >
            <LineChart className="w-4 h-4" /> Financial Forecast
          </TabsTrigger>

          <TabsTrigger
            isActive={activeTab === 'topics'}
            onClick={() => setActiveTab('topics')}
          >
            <Folder className="w-4 h-4" /> Topics & Projects ({topics.length})
          </TabsTrigger>

          <TabsTrigger
            isActive={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
          >
            <Receipt className="w-4 h-4" /> Transactions ({transactions.length})
          </TabsTrigger>
        </TabsList>
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
