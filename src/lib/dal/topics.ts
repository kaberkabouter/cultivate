import { db } from '@/db'
import { topics, transactions, DbTopic, NewDbTopic } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export async function getUserTopics(): Promise<DbTopic[]> {
  const session = await getSession()
  if (!session) return []

  const userTopics = await db.query.topics.findMany({
    where: eq(topics.userId, session.userId),
    orderBy: [desc(topics.isDefault), desc(topics.createdAt)],
  })

  return userTopics
}

export async function createTopic(data: {
  name: string
  description?: string
  color?: string
  isActiveInForecast?: boolean
}): Promise<DbTopic> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const [newTopic] = await db
    .insert(topics)
    .values({
      userId: session.userId,
      name: data.name,
      description: data.description || '',
      color: data.color || '#3b82f6',
      isActiveInForecast: data.isActiveInForecast ?? true,
      isDefault: false,
    })
    .returning()

  return newTopic
}

export async function updateTopic(
  id: string,
  data: Partial<Pick<NewDbTopic, 'name' | 'description' | 'color' | 'isActiveInForecast'>>
): Promise<DbTopic> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const [updated] = await db
    .update(topics)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(topics.id, id), eq(topics.userId, session.userId)))
    .returning()

  if (!updated) throw new Error('Topic not found or unauthorized')
  return updated
}

export async function toggleTopicForecast(id: string, isActiveInForecast: boolean): Promise<DbTopic> {
  return updateTopic(id, { isActiveInForecast })
}

export async function deleteTopic(id: string): Promise<void> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  // Cannot delete default topic
  const target = await db.query.topics.findFirst({
    where: and(eq(topics.id, id), eq(topics.userId, session.userId)),
  })

  if (!target) throw new Error('Topic not found')
  if (target.isDefault) throw new Error('Cannot delete the default personal topic.')

  await db.delete(topics).where(and(eq(topics.id, id), eq(topics.userId, session.userId)))
}
