import { render, screen, fireEvent, act, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TransactionTable } from './TransactionTable'
import { DialogProvider } from '@/components/ui/DialogProvider'
import { TransactionWithTopic } from '@/lib/dal/transactions'
import { DbTopic } from '@/db/schema'

vi.mock('@/app/actions', () => ({
  deleteTransactionAction: vi.fn(),
  createTransactionAction: vi.fn(),
}))

import { deleteTransactionAction } from '@/app/actions'

describe('TransactionTable Delete Dialog Flow', () => {
  const mockTopic: DbTopic = {
    id: 'topic-1',
    userId: 'user-1',
    name: 'Salary',
    description: '',
    color: '#3b82f6',
    isDefault: true,
    isActiveInForecast: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockTransaction: TransactionWithTopic = {
    id: 'tx-123',
    userId: 'user-1',
    topicId: 'topic-1',
    type: 'income',
    amount: 5000,
    description: 'Monthly Paycheck',
    category: 'Income',
    date: '2026-07-01',
    recurrence: 'monthly',
    createdAt: new Date(),
    updatedAt: new Date(),
    topic: mockTopic,
  }

  it('shows confirmation modal on delete click and invokes action on confirm', async () => {
    render(
      <DialogProvider>
        <TransactionTable
          transactions={[mockTransaction]}
          topics={[mockTopic]}
          activeTopicFilter="all"
        />
      </DialogProvider>
    )

    const deleteBtn = screen.getByTitle('Delete Transaction')
    fireEvent.click(deleteBtn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Delete Transaction' })).toBeInTheDocument()
    expect(
      within(dialog).getByText(/Are you sure you want to delete this transaction entry\?/i)
    ).toBeInTheDocument()

    const confirmBtn = within(dialog).getByRole('button', { name: 'Delete Transaction' })
    await act(async () => {
      fireEvent.click(confirmBtn)
    })

    expect(deleteTransactionAction).toHaveBeenCalledWith('tx-123')
  })


  it('does not invoke delete action if modal is cancelled', async () => {
    vi.clearAllMocks()

    render(
      <DialogProvider>
        <TransactionTable
          transactions={[mockTransaction]}
          topics={[mockTopic]}
          activeTopicFilter="all"
        />
      </DialogProvider>
    )

    const deleteBtn = screen.getByTitle('Delete Transaction')
    fireEvent.click(deleteBtn)

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
    await act(async () => {
      fireEvent.click(cancelBtn)
    })

    expect(deleteTransactionAction).not.toHaveBeenCalled()
  })
})
