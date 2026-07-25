'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export type DialogVariant = 'destructive' | 'warning' | 'info' | 'success'
export type DialogType = 'confirm' | 'alert'

export interface ConfirmOptions {
  title?: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: DialogVariant
}

export interface AlertOptions {
  title?: string
  message: ReactNode
  buttonText?: string
  variant?: DialogVariant
}

interface DialogState {
  isOpen: boolean
  title?: string
  message: ReactNode
  confirmText: string
  cancelText?: string
  variant: DialogVariant
  type: DialogType
  resolve?: (value: boolean) => void
}

interface DialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialog(): DialogContextValue {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState | null>(null)

  const closeDialog = useCallback(
    (result: boolean) => {
      if (dialogState?.resolve) {
        dialogState.resolve(result)
      }
      setDialogState(null)
    },
    [dialogState]
  )

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'destructive',
        type: 'confirm',
        resolve,
      })
    })
  }, [])

  const alert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise<void>((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || 'Notice',
        message: options.message,
        confirmText: options.buttonText || 'OK',
        variant: options.variant || 'info',
        type: 'alert',
        resolve: () => resolve(),
      })
    })
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialogState?.isOpen) {
        closeDialog(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dialogState?.isOpen, closeDialog])

  const getVariantStyles = (variant: DialogVariant) => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
          badgeBg: 'bg-rose-500/10 border-rose-500/20',
          confirmBtn:
            'bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold shadow-lg shadow-rose-500/20',
        }
      case 'warning':
        return {
          icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
          badgeBg: 'bg-amber-500/10 border-amber-500/20',
          confirmBtn:
            'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20',
        }
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
          confirmBtn:
            'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20',
        }
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-teal-400" />,
          badgeBg: 'bg-teal-500/10 border-teal-500/20',
          confirmBtn:
            'bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/20',
        }
    }
  }

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      {dialogState?.isOpen && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => closeDialog(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const styles = getVariantStyles(dialogState.variant)
              return (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl border ${styles.badgeBg}`}>
                      {styles.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-100">{dialogState.title}</h3>
                    </div>
                  </div>

                  <div className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {dialogState.message}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {dialogState.type === 'confirm' && (
                      <button
                        type="button"
                        onClick={() => closeDialog(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition cursor-pointer"
                      >
                        {dialogState.cancelText}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => closeDialog(true)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${styles.confirmBtn}`}
                    >
                      {dialogState.confirmText}
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  )
}
