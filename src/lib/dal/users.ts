import { db } from '@/db'
import { users, topics, DbUser } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, verifyPassword, createSessionCookie, clearSessionCookie, getSession } from '@/lib/auth'

export async function registerUser(email: string, password: string, displayName?: string) {
  const normalizedEmail = email.trim().toLowerCase()
  
  // Check if exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  })

  if (existing) {
    throw new Error('An account with this email address already exists.')
  }

  const passwordHash = await hashPassword(password)

  const [newUser] = await db
    .insert(users)
    .values({
      email: normalizedEmail,
      passwordHash,
      displayName: displayName || normalizedEmail.split('@')[0],
    })
    .returning()

  // Create default topic for the new user
  await db.insert(topics).values({
    userId: newUser.id,
    name: 'Personal / Main',
    description: 'Default topic for general incomes and living expenses',
    color: '#3b82f6', // Tailwind blue
    isDefault: true,
    isActiveInForecast: true,
  })

  await createSessionCookie({
    userId: newUser.id,
    email: newUser.email,
    displayName: newUser.displayName,
  })

  return newUser
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()

  const user = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  })

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw new Error('Invalid email or password.')
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
  })

  return user
}

export async function logoutUser() {
  await clearSessionCookie()
}

export async function getCurrentUser(): Promise<DbUser | null> {
  const session = await getSession()
  if (!session) return null

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  })

  return user || null
}
