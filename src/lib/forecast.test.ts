import { describe, it, expect } from 'vitest'
import { expandRecurring, buildForecast, summariseMonth } from './forecast'
import { DbTopic, DbTransaction } from '@/db/schema'
import { format, parseISO } from 'date-fns'

describe('Forecast Engine - expandRecurring', () => {
  const fromDate = parseISO('2026-01-01')
  const toDate = parseISO('2026-03-01')

  const baseTx: DbTransaction = {
    id: 'tx-1',
    topicId: 'topic-1',
    userId: 'user-1',
    type: 'income',
    amount: 1000,
    description: 'Test Salary',
    category: 'Income',
    date: '2026-01-15',
    recurrence: 'monthly',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return a single date for "once" recurrence', () => {
    const tx = { ...baseTx, recurrence: 'once' as const }
    const dates = expandRecurring(tx, fromDate, toDate)
    expect(dates.length).toBe(1)
    expect(format(dates[0], 'yyyy-MM-dd')).toBe('2026-01-15')
  })

  it('should generate weekly dates for "weekly" recurrence', () => {
    const tx = { ...baseTx, recurrence: 'weekly' as const, date: '2026-01-01' }
    const dates = expandRecurring(tx, fromDate, toDate)
    expect(dates.length).toBe(9)
    expect(format(dates[0], 'yyyy-MM-dd')).toBe('2026-01-01')
    expect(format(dates[1], 'yyyy-MM-dd')).toBe('2026-01-08')
  })

  it('should generate biweekly dates for "biweekly" recurrence', () => {
    const tx = { ...baseTx, recurrence: 'biweekly' as const, date: '2026-01-01' }
    const dates = expandRecurring(tx, fromDate, toDate)
    expect(dates.length).toBe(5)
    expect(format(dates[0], 'yyyy-MM-dd')).toBe('2026-01-01')
    expect(format(dates[1], 'yyyy-MM-dd')).toBe('2026-01-15')
  })

  it('should generate monthly dates for "monthly" recurrence', () => {
    const tx = { ...baseTx, recurrence: 'monthly' as const, date: '2026-01-15' }
    const dates = expandRecurring(tx, fromDate, toDate)
    expect(dates.map((d) => format(d, 'yyyy-MM-dd'))).toEqual(['2026-01-15', '2026-02-15'])
  })

  it('should generate yearly dates for "yearly" recurrence', () => {
    const tx = { ...baseTx, recurrence: 'yearly' as const, date: '2026-01-15' }
    const multiYearEnd = parseISO('2028-12-31')
    const dates = expandRecurring(tx, fromDate, multiYearEnd)
    expect(dates.map((d) => format(d, 'yyyy-MM-dd'))).toEqual(['2026-01-15', '2027-01-15', '2028-01-15'])
  })
})

describe('Forecast Engine - buildForecast & summariseMonth', () => {
  const defaultTopic: DbTopic = {
    id: 'topic-default',
    userId: 'user-1',
    name: 'Personal / Main',
    description: null,
    color: '#10b981',
    isDefault: true,
    isActiveInForecast: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const optionalTopicActive: DbTopic = {
    id: 'topic-sidebiz',
    userId: 'user-1',
    name: 'Side Business',
    description: null,
    color: '#3b82f6',
    isDefault: false,
    isActiveInForecast: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const optionalTopicInactive: DbTopic = {
    id: 'topic-renovation',
    userId: 'user-1',
    name: 'Home Renovation',
    description: null,
    color: '#ef4444',
    isDefault: false,
    isActiveInForecast: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const topics = [defaultTopic, optionalTopicActive, optionalTopicInactive]
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const transactions: DbTransaction[] = [
    {
      id: 'tx-salary',
      topicId: 'topic-default',
      userId: 'user-1',
      type: 'income',
      amount: 3000,
      description: 'Monthly Salary',
      category: 'Salary',
      date: todayStr,
      recurrence: 'monthly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tx-rent',
      topicId: 'topic-default',
      userId: 'user-1',
      type: 'expense',
      amount: 1000,
      description: 'Monthly Rent',
      category: 'Housing',
      date: todayStr,
      recurrence: 'monthly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tx-sidebiz-income',
      topicId: 'topic-sidebiz',
      userId: 'user-1',
      type: 'income',
      amount: 500,
      description: 'Side Client Retainer',
      category: 'Consulting',
      date: todayStr,
      recurrence: 'monthly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tx-renovation-expense',
      topicId: 'topic-renovation',
      userId: 'user-1',
      type: 'expense',
      amount: 2000,
      description: 'Kitchen Repair',
      category: 'Repair',
      date: todayStr,
      recurrence: 'once',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('should compute cumulative baseline balance and active scenario balance correctly', () => {
    const points = buildForecast(transactions, topics, 3, 500)
    expect(points.length).toBeGreaterThan(60)

    const firstDay = points[0]
    expect(firstDay.date).toBe(todayStr)
    expect(firstDay.baselineIncome).toBe(3000)
    expect(firstDay.baselineExpense).toBe(1000)
    // Starting balance 500 + net 2000 = 2500
    expect(firstDay.baselineBalance).toBe(2500)

    // Sidebiz active income +500 => scenario balance 3000
    expect(firstDay.scenarioIncome).toBe(3500)
    expect(firstDay.scenarioBalance).toBe(3000)
  })

  it('should ignore transactions belonging to inactive topics in scenario forecast', () => {
    const points = buildForecast(transactions, topics, 1, 0)
    const firstDay = points[0]
    // Renovations topic is inactive, so kitchen repair (-2000) is excluded from scenario
    expect(firstDay.scenarioExpenses).toBe(1000)
  })

  it('should calculate monthly summary aggregation accurately', () => {
    const points = buildForecast(transactions, topics, 1, 0)
    const summary = summariseMonth(points)
    expect(summary.baselineIncome).toBeGreaterThan(0)
    expect(summary.scenarioIncome).toBeGreaterThan(summary.baselineIncome)
    expect(summary.scenarioNet).toBeGreaterThan(summary.baselineNet)
  })
})
