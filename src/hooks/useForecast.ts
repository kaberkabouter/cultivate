import { useState, useMemo } from 'react'
import { ForecastTopic, ForecastTransaction, buildForecast, summariseMonth } from '@/lib/forecast'

export interface UseForecastOptions {
  topics: ForecastTopic[]
  transactions: ForecastTransaction[]
  initialMonths?: number
  initialStartingBalance?: number
}

export function useForecast({
  topics,
  transactions,
  initialMonths = 12,
  initialStartingBalance = 0,
}: UseForecastOptions) {
  const [months, setMonths] = useState(initialMonths)
  const [startingBalance, setStartingBalance] = useState(initialStartingBalance)

  const forecastPoints = useMemo(() => {
    return buildForecast(transactions, topics, months, startingBalance)
  }, [transactions, topics, months, startingBalance])

  const monthlySummary = useMemo(() => {
    return summariseMonth(forecastPoints)
  }, [forecastPoints])

  const baselineTopic = useMemo(() => {
    return topics.find((t) => t.isDefault)
  }, [topics])

  const activeOptionalTopics = useMemo(() => {
    return topics.filter((t) => !t.isDefault && t.isActiveInForecast)
  }, [topics])

  return {
    months,
    setMonths,
    startingBalance,
    setStartingBalance,
    forecastPoints,
    monthlySummary,
    baselineTopic,
    activeOptionalTopics,
  }
}
