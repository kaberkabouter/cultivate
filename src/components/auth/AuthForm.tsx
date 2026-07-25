'use client'

import { useState } from 'react'
import { registerAction, loginAction } from '@/app/actions'
import { LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react'
import { Card, Input, Button } from '@/components/ui'

export function AuthForm() {
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = isRegister ? await registerAction(formData) : await loginAction(formData)

    setLoading(false)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-2xl shadow-emerald-950/20 text-slate-100">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
          <Sparkles className="w-7 h-7 text-slate-950" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Welcome to Cultivate
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {isRegister ? 'Create your account to start forecasting' : 'Sign in to access your financial topics'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <Input
            label="Display Name"
            name="displayName"
            type="text"
            placeholder="Eben Schutte"
          />
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          leftIcon={isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          className="w-full mt-2"
        >
          {isRegister ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsRegister(!isRegister)
            setError(null)
          }}
          className="text-xs text-slate-400 hover:text-emerald-400"
        >
          {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
        </Button>
      </div>
    </Card>
  )
}
