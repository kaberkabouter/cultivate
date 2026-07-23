import { DbTopic } from '@/db/schema'
import { CheckCircle2, Eye, EyeOff, Trash2, ShieldCheck } from 'lucide-react'

interface TopicCardProps {
  topic: DbTopic
  isSelectedFilter: boolean
  onSelectFilter: (id: string) => void
  onToggleForecast?: (topic: DbTopic) => void
  onDeleteTopic?: (topic: DbTopic) => void
}

export function TopicCard({
  topic,
  isSelectedFilter,
  onSelectFilter,
  onToggleForecast,
  onDeleteTopic,
}: TopicCardProps) {
  return (
    <div
      data-testid={`topic-card-${topic.id}`}
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
            onDeleteTopic && (
              <button
                onClick={() => onDeleteTopic(topic)}
                title="Delete Topic"
                aria-label={`Delete ${topic.name}`}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

        {topic.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{topic.description}</p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between mt-2">
        <button
          onClick={() => onSelectFilter(topic.id)}
          aria-label={`Filter by ${topic.name}`}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
            isSelectedFilter ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isSelectedFilter ? 'Filtered' : 'Filter View'}
        </button>

        {!topic.isDefault && onToggleForecast && (
          <button
            onClick={() => onToggleForecast(topic)}
            aria-label={`Toggle forecast for ${topic.name}`}
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
}
