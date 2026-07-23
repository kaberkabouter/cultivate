'use client'

import { toggleTopicForecastAction, deleteTopicAction } from '@/app/actions'
import { CreateTopicModal } from './CreateTopicModal'
import { DbTopic } from '@/db/schema'
import { Folder, CheckCircle2, Eye, EyeOff, Trash2, ShieldCheck } from 'lucide-react'

interface TopicListProps {
  topics: DbTopic[]
  activeTopicFilter: string
  onSelectTopicFilter: (topicId: string) => void
}

export function TopicList({ topics, activeTopicFilter, onSelectTopicFilter }: TopicListProps) {
  async function handleToggleForecast(topic: DbTopic) {
    await toggleTopicForecastAction(topic.id, !topic.isActiveInForecast)
  }

  async function handleDelete(topic: DbTopic) {
    if (confirm(`Are you sure you want to delete topic "${topic.name}" and all its transactions?`)) {
      await deleteTopicAction(topic.id)
    }
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Folder className="w-5 h-5 text-emerald-400" /> Topics & Projects
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle topics to include/exclude them from scenario forecasts
          </p>
        </div>
        <CreateTopicModal />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* All Filter Option */}
        <button
          onClick={() => onSelectTopicFilter('all')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTopicFilter === 'all'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">View All</span>
            {activeTopicFilter === 'all' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-sm font-semibold text-slate-200 mt-2">All Transactions</p>
        </button>

        {topics.map((topic) => {
          const isSelectedFilter = activeTopicFilter === topic.id
          return (
            <div
              key={topic.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between relative group ${
                isSelectedFilter
                  ? 'bg-slate-800/80 border-slate-600 ring-1 ring-slate-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
                    <span className="font-semibold text-sm text-slate-100">{topic.name}</span>
                  </div>

                  {topic.isDefault ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Baseline
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDelete(topic)}
                      title="Delete Topic"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {topic.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{topic.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between mt-2">
                <button
                  onClick={() => onSelectTopicFilter(topic.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                    isSelectedFilter
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isSelectedFilter ? 'Filtered' : 'Filter View'}
                </button>

                {!topic.isDefault && (
                  <button
                    onClick={() => handleToggleForecast(topic)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition ${
                      topic.isActiveInForecast
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {topic.isActiveInForecast ? (
                      <>
                        <Eye className="w-3 h-3 text-emerald-400" /> Active in Forecast
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Excluded from Forecast
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
