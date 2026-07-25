'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { Dialog, Button } from '@/components/ui'

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

  const getVariantStyles = (variant: DialogVariant) => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
          badgeBg: 'bg-rose-500/10 border-rose-500/20',
          btnVariant: 'destructive' as const,
        }
      case 'warning':
        return {
          icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
          badgeBg: 'bg-amber-500/10 border-amber-500/20',
          btnVariant: 'primary' as const,
        }
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
          btnVariant: 'primary' as const,
        }
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-teal-400" />,
          badgeBg: 'bg-teal-500/10 border-teal-500/20',
          btnVariant: 'primary' as const,
        }
    }
  }

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      {dialogState?.isOpen && (
        <Dialog isOpen={dialogState.isOpen} onClose={() => closeDialog(false)} maxWidth="md">
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => closeDialog(false)}
                    >
                      {dialogState.cancelText}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={styles.btnVariant}
                    onClick={() => closeDialog(true)}
                  >
                    {dialogState.confirmText}
                  </Button>
                </div>
              </div>
            )
          })()}
        </Dialog>
      )}
    </DialogContext.Provider>
  )
}
