import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ForecastChart } from './ForecastChart'
import { ForecastTransaction, ForecastTopic } from '@/lib/forecast'

// Mock recharts to avoid ResponsiveContainer DOM measurement warnings in JSDOM
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts')
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="mock-responsive-container">{children}</div>,
  }
})

describe('ForecastChart Component', () => {
  const topics: ForecastTopic[] = [
    {
      id: 'topic-base',
      name: 'Main Personal',
      color: '#10b981',
      isDefault: true,
      isActiveInForecast: true,
    },
    {
      id: 'topic-side',
      name: 'Side Biz',
      color: '#3b82f6',
      isDefault: false,
      isActiveInForecast: true,
    },
  ]

  const transactions: ForecastTransaction[] = [
    {
      id: 'tx-1',
      topicId: 'topic-base',
      type: 'income',
      amount: 4000,
      description: 'Main Salary',
      date: '2026-01-01',
      recurrence: 'monthly',
    },
  ]

  it('renders forecast metric cards and timeframe buttons', () => {
    render(<ForecastChart transactions={transactions} topics={topics} />)

    expect(screen.getByText('Baseline Forecast')).toBeInTheDocument()
    expect(screen.getByText('Scenario Forecast')).toBeInTheDocument()
    expect(screen.getByText('Topics Net Impact')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: '3 Months Timeframe' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '12 Months Timeframe' })).toBeInTheDocument()
  })

  it('allows user to change starting balance', () => {
    render(<ForecastChart transactions={transactions} topics={topics} />)

    const balanceInput = screen.getByLabelText('Starting Balance') as HTMLInputElement
    fireEvent.change(balanceInput, { target: { value: '1500' } })

    expect(balanceInput.value).toBe('1500')
  })
})
