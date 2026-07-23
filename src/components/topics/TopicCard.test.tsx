import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TopicCard } from './TopicCard'
import { DbTopic } from '@/db/schema'

describe('TopicCard Component', () => {
  const mockTopic: DbTopic = {
    id: 'topic-123',
    userId: 'user-1',
    name: 'Vacation Fund',
    description: 'Saving up for summer trip',
    color: '#3b82f6',
    isDefault: false,
    isActiveInForecast: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('renders topic name, description, and color badge', () => {
    render(
      <TopicCard
        topic={mockTopic}
        isSelectedFilter={false}
        onSelectFilter={() => {}}
      />
    )

    expect(screen.getByText('Vacation Fund')).toBeInTheDocument()
    expect(screen.getByText('Saving up for summer trip')).toBeInTheDocument()
  })

  it('triggers onSelectFilter when filter button is clicked', () => {
    const handleSelectFilter = vi.fn()
    render(
      <TopicCard
        topic={mockTopic}
        isSelectedFilter={false}
        onSelectFilter={handleSelectFilter}
      />
    )

    const filterButton = screen.getByRole('button', { name: /Filter by Vacation Fund/i })
    fireEvent.click(filterButton)

    expect(handleSelectFilter).toHaveBeenCalledWith('topic-123')
  })

  it('triggers onToggleForecast when toggle button is clicked', () => {
    const handleToggleForecast = vi.fn()
    render(
      <TopicCard
        topic={mockTopic}
        isSelectedFilter={false}
        onSelectFilter={() => {}}
        onToggleForecast={handleToggleForecast}
      />
    )

    const toggleButton = screen.getByRole('button', { name: /Toggle forecast for Vacation Fund/i })
    fireEvent.click(toggleButton)

    expect(handleToggleForecast).toHaveBeenCalledWith(mockTopic)
  })

  it('triggers onDeleteTopic when delete button is clicked', () => {
    const handleDelete = vi.fn()
    render(
      <TopicCard
        topic={mockTopic}
        isSelectedFilter={false}
        onSelectFilter={() => {}}
        onDeleteTopic={handleDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /Delete Vacation Fund/i })
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledWith(mockTopic)
  })
})
