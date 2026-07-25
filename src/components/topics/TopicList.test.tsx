import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TopicList } from './TopicList'
import { DialogProvider } from '@/components/ui/DialogProvider'
import { DbTopic } from '@/db/schema'

// Mock server actions
vi.mock('@/app/actions', () => ({
  toggleTopicForecastAction: vi.fn(),
  deleteTopicAction: vi.fn(),
}))

import { deleteTopicAction } from '@/app/actions'

describe('TopicList Component Delete Dialog Flow', () => {
  const mockTopic: DbTopic = {
    id: 'topic-1',
    userId: 'user-1',
    name: 'Home Renovation',
    description: 'Fix up the kitchen',
    color: '#10b981',
    isDefault: false,
    isActiveInForecast: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('shows confirmation dialog when delete is clicked and calls action on confirm', async () => {
    render(
      <DialogProvider>
        <TopicList
          topics={[mockTopic]}
          activeTopicFilter="all"
          onSelectTopicFilter={() => {}}
        />
      </DialogProvider>
    )

    // Click delete button on topic card
    const deleteButton = screen.getByRole('button', { name: /Delete Home Renovation/i })
    fireEvent.click(deleteButton)

    // Verify modal appears
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Delete Topic' })).toBeInTheDocument()
    expect(
      screen.getByText(/Are you sure you want to delete topic "Home Renovation"/i)
    ).toBeInTheDocument()


    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: 'Delete Topic' })
    await act(async () => {
      fireEvent.click(confirmBtn)
    })

    expect(deleteTopicAction).toHaveBeenCalledWith('topic-1')
  })

  it('cancels deletion when Cancel button is clicked in modal', async () => {
    vi.clearAllMocks()

    render(
      <DialogProvider>
        <TopicList
          topics={[mockTopic]}
          activeTopicFilter="all"
          onSelectTopicFilter={() => {}}
        />
      </DialogProvider>
    )

    const deleteButton = screen.getByRole('button', { name: /Delete Home Renovation/i })
    fireEvent.click(deleteButton)

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
    await act(async () => {
      fireEvent.click(cancelBtn)
    })

    expect(deleteTopicAction).not.toHaveBeenCalled()
  })
})
