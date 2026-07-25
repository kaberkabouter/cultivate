import { DbTopic } from '@/db/schema'
import { Eye, EyeOff, Trash2, ShieldCheck } from 'lucide-react'
import { Card, CardFooter, Badge, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

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
    <Card
      data-testid={`topic-card-${topic.id}`}
      className={cn(
        'p-4 transition flex flex-col justify-between relative group',
        isSelectedFilter
          ? 'bg-slate-800/80 border-slate-600 ring-1 ring-slate-500/30'
          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
            <span className="font-semibold text-sm text-slate-100">{topic.name}</span>
          </div>

          {topic.isDefault ? (
            <Badge variant="blue" badgeStyle="soft">
              <ShieldCheck className="w-3 h-3" /> Baseline
            </Badge>
          ) : (
            onDeleteTopic && (
              <button
                onClick={() => onDeleteTopic(topic)}
                title="Delete Topic"
                aria-label={`Delete ${topic.name}`}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
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

      <CardFooter className="pt-3 mt-2">
        <Button
          variant={isSelectedFilter ? 'accent' : 'ghost'}
          size="sm"
          onClick={() => onSelectFilter(topic.id)}
          aria-label={`Filter by ${topic.name}`}
        >
          {isSelectedFilter ? 'Filtered' : 'Filter View'}
        </Button>

        {!topic.isDefault && onToggleForecast && (
          <Button
            variant={topic.isActiveInForecast ? 'accent' : 'outline'}
            size="sm"
            onClick={() => onToggleForecast(topic)}
            aria-label={`Toggle forecast for ${topic.name}`}
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
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
