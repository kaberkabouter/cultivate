import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DialogProvider, useDialog } from './DialogProvider'
import React from 'react'

function TestComponent({
  onResult,
}: {
  onResult?: (res: boolean | void) => void
}) {
  const dialog = useDialog()

  return (
    <div>
      <button
        onClick={async () => {
          const res = await dialog.confirm({
            title: 'Test Confirm Title',
            message: 'Are you sure you want to test?',
            confirmText: 'Yes Do It',
            cancelText: 'No Never',
            variant: 'destructive',
          })
          if (onResult) onResult(res)
        }}
      >
        Trigger Confirm
      </button>

      <button
        onClick={async () => {
          await dialog.alert({
            title: 'Test Alert Title',
            message: 'This is an alert message',
            buttonText: 'Got It',
            variant: 'info',
          })
          if (onResult) onResult()
        }}
      >
        Trigger Alert
      </button>
    </div>
  )
}

describe('DialogProvider & useDialog', () => {
  it('throws an error if useDialog is called outside DialogProvider', () => {
    // Suppress console error for expected throw test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent />)).toThrow(
      'useDialog must be used within a DialogProvider'
    )
    consoleError.mockRestore()
  })

  it('renders children without modal initially', () => {
    render(
      <DialogProvider>
        <div>Hello World</div>
      </DialogProvider>
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens confirmation modal and resolves true on confirm button click', async () => {
    const handleResult = vi.fn()

    render(
      <DialogProvider>
        <TestComponent onResult={handleResult} />
      </DialogProvider>
    )

    const triggerBtn = screen.getByText('Trigger Confirm')
    fireEvent.click(triggerBtn)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Confirm Title')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to test?')).toBeInTheDocument()

    const confirmBtn = screen.getByText('Yes Do It')
    await act(async () => {
      fireEvent.click(confirmBtn)
    })

    expect(handleResult).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens confirmation modal and resolves false on cancel button click', async () => {
    const handleResult = vi.fn()

    render(
      <DialogProvider>
        <TestComponent onResult={handleResult} />
      </DialogProvider>
    )

    const triggerBtn = screen.getByText('Trigger Confirm')
    fireEvent.click(triggerBtn)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const cancelBtn = screen.getByText('No Never')
    await act(async () => {
      fireEvent.click(cancelBtn)
    })

    expect(handleResult).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('resolves false when Escape key is pressed', async () => {
    const handleResult = vi.fn()

    render(
      <DialogProvider>
        <TestComponent onResult={handleResult} />
      </DialogProvider>
    )

    fireEvent.click(screen.getByText('Trigger Confirm'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    })

    expect(handleResult).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens alert modal and resolves when button is clicked', async () => {
    const handleResult = vi.fn()

    render(
      <DialogProvider>
        <TestComponent onResult={handleResult} />
      </DialogProvider>
    )

    fireEvent.click(screen.getByText('Trigger Alert'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Alert Title')).toBeInTheDocument()
    expect(screen.getByText('This is an alert message')).toBeInTheDocument()

    const okBtn = screen.getByText('Got It')
    await act(async () => {
      fireEvent.click(okBtn)
    })

    expect(handleResult).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
