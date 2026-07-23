import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  isBefore,
  isAfter,
} from 'date-fns'

export interface ForecastTransaction {
  id: string
  topicId: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string // YYYY-MM-DD
  recurrence: 'once' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
}

export interface ForecastTopic {
  id: string
  name: string
  color: string
  isDefault: boolean
  isActiveInForecast: boolean
}

export interface ForecastPoint {
  date: string // YYYY-MM-DD
  baselineBalance: number
  scenarioBalance: number
  baselineIncome: number
  baselineExpense: number
  topicIncome: number
  topicExpense: number
  dailyNet: number
}

function advance(d: Date, r: ForecastTransaction['recurrence']): Date {
  switch (r) {
    case 'weekly':
      return addWeeks(d, 1)
    case 'biweekly':
      return addWeeks(d, 2)
    case 'monthly':
      return addMonths(d, 1)
    case 'yearly':
      return addYears(d, 1)
    default:
      return addDays(d, 1)
  }
}

function expandRecurring(t: ForecastTransaction, from: Date, to: Date): Date[] {
  const start = parseISO(t.date)
  const dates: Date[] = []

  if (t.recurrence === 'once') {
    if (!isBefore(start, from) && !isAfter(start, to)) {
      dates.push(start)
    }
    return dates
  }

  let cursor = start
  // Advance until cursor reaches or passes from date
  while (isBefore(cursor, from)) {
    cursor = advance(cursor, t.recurrence)
  }
  // Collect dates up to to date
  while (!isAfter(cursor, to)) {
    dates.push(cursor)
    cursor = advance(cursor, t.recurrence)
  }

  return dates
}

export function buildForecast(
  transactions: ForecastTransaction[],
  topics: ForecastTopic[],
  activeTopicIds: string[],
  months = 12,
  startingBalance = 0
): ForecastPoint[] {
  const today = startOfDay(new Date())
  const endDate = addMonths(today, months)

  const defaultTopicIds = new Set(topics.filter((t) => t.isDefault).map((t) => t.id))
  const activeTopicSet = new Set(activeTopicIds)

  // Map of date string -> daily sums
  const dailyMap: Record<
    string,
    {
      baselineIncome: number
      baselineExpense: number
      topicIncome: number
      topicExpense: number
    }
  > = {}

  const days = eachDayOfInterval({ start: today, end: endDate })
  for (const d of days) {
    dailyMap[format(d, 'yyyy-MM-dd')] = {
      baselineIncome: 0,
      baselineExpense: 0,
      topicIncome: 0,
      topicExpense: 0,
    }
  }

  for (const t of transactions) {
    const dates = expandRecurring(t, today, endDate)
    const isDefaultTopic = defaultTopicIds.has(t.topicId)
    const isActiveTopic = activeTopicSet.has(t.topicId)

    for (const d of dates) {
      const key = format(d, 'yyyy-MM-dd')
      if (!dailyMap[key]) continue

      if (isDefaultTopic) {
        if (t.type === 'income') {
          dailyMap[key].baselineIncome += t.amount
        } else {
          dailyMap[key].baselineExpense += t.amount
        }
      } else if (isActiveTopic) {
        if (t.type === 'income') {
          dailyMap[key].topicIncome += t.amount
        } else {
          dailyMap[key].topicExpense += t.amount
        }
      }
    }
  }

  const points: ForecastPoint[] = []
  let baselineBalance = startingBalance
  let scenarioBalance = startingBalance

  for (const d of days) {
    const key = format(d, 'yyyy-MM-dd')
    const { baselineIncome, baselineExpense, topicIncome, topicExpense } = dailyMap[key]

    baselineBalance += baselineIncome - baselineExpense
    scenarioBalance += baselineIncome - baselineExpense + (topicIncome - topicExpense)

    points.push({
      date: key,
      baselineBalance,
      scenarioBalance,
      baselineIncome,
      baselineExpense,
      topicIncome,
      topicExpense,
      dailyNet: baselineIncome - baselineExpense + (topicIncome - topicExpense),
    })
  }

  return points
}
