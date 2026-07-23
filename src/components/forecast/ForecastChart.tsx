'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { buildForecast, ForecastTransaction, ForecastTopic } from '@/lib/forecast'
import { TrendingUp, Calendar, DollarSign, Layers } from 'lucide-react'

interface ForecastChartProps {
  transactions: ForecastTransaction[]
  topics: ForecastTopic[]
}

export function ForecastChart({ transactions, topics }: ForecastChartProps) {
  const [months, setMonths] = useState<number>(12)
  const [startingBalance, setStartingBalance] = useState<number>(0)

  const activeTopicIds = useMemo(() => {
    return topics.filter((t) => t.isActiveInForecast).map((t) => t.id)
  }, [topics])

  const forecastData = useMemo(() => {
    return buildForecast(transactions, topics, activeTopicIds, months, startingBalance)
  }, [transactions, topics, activeTopicIds, months, startingBalance])

  const currentScenarioBalance = forecastData.length > 0 ? forecastData[forecastData.length - 1].scenarioBalance : 0
  const currentBaselineBalance = forecastData.length > 0 ? forecastData[forecastData.length - 1].baselineBalance : 0
  const topicDelta = currentScenarioBalance - currentBaselineBalance

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-6">
      {/* Metric Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Baseline Forecast</p>
            <p className="text-2xl font-extrabold text-slate-100 mt-1">{formatCurrency(currentBaselineBalance)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">End of {months} Months (Base Topics)</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scenario Forecast</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{formatCurrency(currentScenarioBalance)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Baseline + Active Topics</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Topics Net Impact</p>
            <p className={`text-2xl font-extrabold mt-1 ${topicDelta >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
              {topicDelta >= 0 ? '+' : ''}{formatCurrency(topicDelta)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{activeTopicIds.length} Active Scenario Topics</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Forecast Chart Container */}
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> Cashflow Forecast Projection
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare your baseline cashflow against active topic scenario trajectories
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Starting Balance Input */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400">Start Balance:</span>
              <input
                type="number"
                value={startingBalance}
                onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)}
                className="w-20 bg-transparent text-slate-100 font-semibold text-right outline-none"
              />
            </div>

            {/* Timeframe Buttons */}
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              {[3, 6, 12, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    months === m
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                formatter={(value: any, name: any) => [
                  formatCurrency(Number(value)),
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
      </div>
    </div>
  )
}
