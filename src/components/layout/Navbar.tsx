'use client'

import { logoutAction } from '@/app/actions'
import { Sprout, LogOut, User as UserIcon } from 'lucide-react'
import { Badge, Button } from '@/components/ui'

interface NavbarProps {
  user: {
    email: string
    displayName?: string | null
  }
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Cultivate
            </span>
            <Badge variant="emerald" badgeStyle="soft">
              Financial Forecast
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">{user.displayName || user.email}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutAction()}
            title="Sign Out"
            aria-label="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
