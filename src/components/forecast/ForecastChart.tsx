'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { ForecastTransaction, ForecastTopic } from '@/lib/forecast'
import { useForecast } from '@/hooks/useForecast'
import { TrendingUp, Calendar, DollarSign, Layers } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, StatCard, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ForecastChartProps {
  transactions: ForecastTransaction[]
  topics: ForecastTopic[]
}

export function ForecastChart({ transactions, topics }: ForecastChartProps) {
  const {
    months,
    setMonths,
    startingBalance,
    setStartingBalance,
    forecastPoints,
    activeOptionalTopics,
  } = useForecast({ transactions, topics })

  const currentScenarioBalance = forecastPoints.length > 0 ? forecastPoints[forecastPoints.length - 1].scenarioBalance : 0
  const currentBaselineBalance = forecastPoints.length > 0 ? forecastPoints[forecastPoints.length - 1].baselineBalance : 0
  const topicDelta = currentScenarioBalance - currentBaselineBalance

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-6" data-testid="forecast-chart-container">
      {/* Metric Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Baseline Forecast"
          value={formatCurrency(currentBaselineBalance)}
          description={`End of ${months} Months (Base Topics)`}
          icon={<DollarSign className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          title="Scenario Forecast"
          value={formatCurrency(currentScenarioBalance)}
          description="Baseline + Active Topics"
          trend="up"
          change="Forecasted"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Topics Net Impact"
          value={`${topicDelta >= 0 ? '+' : ''}${formatCurrency(topicDelta)}`}
          description={`${activeOptionalTopics.length} Active Scenario Topics`}
          trend={topicDelta >= 0 ? 'up' : 'down'}
          change={topicDelta >= 0 ? 'Positive Impact' : 'Expense Delta'}
          icon={<Layers className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Forecast Chart Container */}
      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 space-y-0">
          <div>
            <CardTitle>
              <Calendar className="w-5 h-5 text-emerald-400" /> Cashflow Forecast Projection
            </CardTitle>
            <CardDescription className="mt-0.5">
              Compare your baseline cashflow against active topic scenario trajectories
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            {/* Starting Balance Input */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Start Balance:</span>
              <input
                type="number"
                value={startingBalance}
                onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)}
                aria-label="Starting Balance"
                className="w-20 bg-transparent text-slate-100 font-semibold text-right outline-none"
              />
            </div>

            {/* Timeframe Buttons */}
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              {[3, 6, 12, 24].map((m) => (
                <Button
                  key={m}
                  variant={months === m ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setMonths(m)}
                  aria-label={`${m} Months Timeframe`}
                  className={cn(
                    'px-3 py-1 text-xs',
                    months !== m && 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {m}M
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        {/* Recharts Area Chart */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastPoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scenarioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  formatCurrency(Number(value || 0)),
                  name === 'scenarioBalance' ? 'Scenario Balance' : 'Baseline Balance',
                ]}
              />

              <Area
                type="monotone"
                dataKey="baselineBalance"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#baselineGrad)"
                name="baselineBalance"
              />
              <Area
                type="monotone"
                dataKey="scenarioBalance"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scenarioGrad)"
                name="scenarioBalance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
