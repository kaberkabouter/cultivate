'use client'

import { toggleTopicForecastAction, deleteTopicAction } from '@/app/actions'
import { CreateTopicModal } from './CreateTopicModal'
import { TopicCard } from './TopicCard'
import { DbTopic } from '@/db/schema'
import { Folder, CheckCircle2 } from 'lucide-react'
import { useDialog } from '@/components/ui/DialogProvider'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { cn } from '@/lib/utils'

interface TopicListProps {
  topics: DbTopic[]
  activeTopicFilter: string
  onSelectTopicFilter: (topicId: string) => void
}

export function TopicList({ topics, activeTopicFilter, onSelectTopicFilter }: TopicListProps) {
  const dialog = useDialog()

  async function handleToggleForecast(topic: DbTopic) {
    await toggleTopicForecastAction(topic.id, !topic.isActiveInForecast)
  }

  async function handleDelete(topic: DbTopic) {
    const confirmed = await dialog.confirm({
      title: 'Delete Topic',
      message: `Are you sure you want to delete topic "${topic.name}" and all its associated transactions? This action cannot be undone.`,
      confirmText: 'Delete Topic',
      cancelText: 'Cancel',
      variant: 'destructive',
    })

    if (confirmed) {
      await deleteTopicAction(topic.id)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between mb-5 space-y-0">
        <div>
          <CardTitle>
            <Folder className="w-5 h-5 text-emerald-400" /> Topics & Projects
          </CardTitle>
          <CardDescription className="mt-0.5">
            Toggle topics to include/exclude them from scenario forecasts
          </CardDescription>
        </div>
        <CreateTopicModal />
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* View All Filter Option */}
        <button
          onClick={() => onSelectTopicFilter('all')}
          aria-label="View All Transactions"
          className={cn(
            'p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between',
            activeTopicFilter === 'all'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">View All</span>
            {activeTopicFilter === 'all' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-sm font-semibold text-slate-200 mt-2">All Transactions</p>
        </button>

        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isSelectedFilter={activeTopicFilter === topic.id}
            onSelectFilter={onSelectTopicFilter}
            onToggleForecast={handleToggleForecast}
            onDeleteTopic={handleDelete}
          />
        ))}
      </div>
    </Card>
  )
}
