import { db } from '@/db'
import { transactions, topics, DbTransaction, NewDbTransaction } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export type TransactionWithTopic = DbTransaction & {
  topic?: {
    id: string
    name: string
    color: string
    isActiveInForecast: boolean
  }
}

export async function getUserTransactions(topicIdFilter?: string): Promise<TransactionWithTopic[]> {
  const session = await getSession()
  if (!session) return []

  const conditions = [eq(transactions.userId, session.userId)]
  if (topicIdFilter && topicIdFilter !== 'all') {
    conditions.push(eq(transactions.topicId, topicIdFilter))
  }

  const results = await db.query.transactions.findMany({
    where: and(...conditions),
    with: {
      topic: {
        columns: {
          id: true,
          name: true,
          color: true,
          isActiveInForecast: true,
        },
      },
    },
    orderBy: [desc(transactions.date), desc(transactions.createdAt)],
  })

  return results
}

export async function createTransaction(data: {
  topicId: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category?: string
  date: string
  recurrence?: 'once' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
}): Promise<DbTransaction> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  // Verify topic ownership
  const targetTopic = await db.query.topics.findFirst({
    where: and(eq(topics.id, data.topicId), eq(topics.userId, session.userId)),
  })

  if (!targetTopic) throw new Error('Selected Topic not found or access denied.')

  const [newTx] = await db
    .insert(transactions)
    .values({
      userId: session.userId,
      topicId: data.topicId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      category: data.category || 'General',
      date: data.date,
      recurrence: data.recurrence || 'once',
    })
    .returning()

  return newTx
}

export async function updateTransaction(
  id: string,
  data: Partial<Pick<NewDbTransaction, 'topicId' | 'type' | 'amount' | 'description' | 'category' | 'date' | 'recurrence'>>
): Promise<DbTransaction> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const [updated] = await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.userId)))
    .returning()

  if (!updated) throw new Error('Transaction not found or unauthorized')
  return updated
}

export async function deleteTransaction(id: string): Promise<void> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.userId)))
}
