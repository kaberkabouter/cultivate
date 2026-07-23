'use server'

import { registerUser, loginUser, logoutUser } from '@/lib/dal/users'
import { createTopic, toggleTopicForecast, deleteTopic } from '@/lib/dal/topics'
import { createTransaction, deleteTransaction } from '@/lib/dal/transactions'
import { loginSchema, registerSchema } from '@/lib/schemas/auth'
import { createTopicSchema } from '@/lib/schemas/topic'
import { createTransactionSchema } from '@/lib/schemas/transaction'
import { revalidatePath } from 'next/cache'

// Auth Actions
export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    displayName: formData.get('displayName'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input data.' }
  }

  try {
    await registerUser(parsed.data.email, parsed.data.password, parsed.data.displayName)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Registration failed.' }
  }
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input data.' }
  }

  try {
    await loginUser(parsed.data.email, parsed.data.password)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Login failed.' }
  }
}

export async function logoutAction() {
  await logoutUser()
  revalidatePath('/')
}

// Topic Actions
export async function createTopicAction(formData: FormData) {
  const parsed = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    color: formData.get('color') || '#3b82f6',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid topic details.' }
  }

  try {
    await createTopic(parsed.data)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to create topic.' }
  }
}

export async function toggleTopicForecastAction(topicId: string, isActive: boolean) {
  if (!topicId) return { error: 'Topic ID is required.' }

  try {
    await toggleTopicForecast(topicId, isActive)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to toggle topic.' }
  }
}

export async function deleteTopicAction(topicId: string) {
  if (!topicId) return { error: 'Topic ID is required.' }

  try {
    await deleteTopic(topicId)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete topic.' }
  }
}

// Transaction Actions
export async function createTransactionAction(formData: FormData) {
  const parsed = createTransactionSchema.safeParse({
    topicId: formData.get('topicId'),
    type: formData.get('type'),
    amount: formData.get('amount'),
    description: formData.get('description'),
    category: formData.get('category'),
    date: formData.get('date'),
    recurrence: formData.get('recurrence') || 'once',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid transaction details.' }
  }

  try {
    await createTransaction(parsed.data)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to create transaction.' }
  }
}

export async function deleteTransactionAction(id: string) {
  if (!id) return { error: 'Transaction ID is required.' }

  try {
    await deleteTransaction(id)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete transaction.' }
  }
}
