import { getCurrentUser } from '@/lib/dal/users'
import { getUserTopics } from '@/lib/dal/topics'
import { getUserTransactions } from '@/lib/dal/transactions'
import { AuthForm } from '@/components/auth/AuthForm'
import { Navbar } from '@/components/layout/Navbar'
import { DashboardView } from './DashboardView'

export default async function HomePage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle background glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <AuthForm />
      </main>
    )
  }

  const topics = await getUserTopics()
  const transactions = await getUserTransactions()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Navbar user={{ email: user.email, displayName: user.displayName }} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardView topics={topics} transactions={transactions} />
      </main>
    </div>
  )
}
