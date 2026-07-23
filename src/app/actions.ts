'use server'

import { registerUser, loginUser, logoutUser, getCurrentUser } from '@/lib/dal/users'
import { getUserTopics, createTopic, updateTopic, toggleTopicForecast, deleteTopic } from '@/lib/dal/topics'
import { getUserTransactions, createTransaction, updateTransaction, deleteTransaction } from '@/lib/dal/transactions'
import { revalidatePath } from 'next/cache'

// Auth Actions
export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    await registerUser(email, password, displayName)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Registration failed.' }
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    await loginUser(email, password)
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
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = (formData.get('color') as string) || '#3b82f6'

  if (!name) return { error: 'Topic name is required.' }

  try {
    await createTopic({ name, description, color })
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to create topic.' }
  }
}

export async function toggleTopicForecastAction(topicId: string, isActive: boolean) {
  try {
    await toggleTopicForecast(topicId, isActive)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to toggle topic' }
  }
}

export async function deleteTopicAction(topicId: string) {
  try {
    await deleteTopic(topicId)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete topic' }
  }
}

// Transaction Actions
export async function createTransactionAction(formData: FormData) {
  const topicId = formData.get('topicId') as string
  const type = formData.get('type') as 'income' | 'expense'
  const amountStr = formData.get('amount') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const recurrence = (formData.get('recurrence') as any) || 'once'

  if (!topicId || !type || !amountStr || !description || !date) {
    return { error: 'Missing required fields.' }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Amount must be a positive number.' }
  }

  try {
    await createTransaction({
      topicId,
      type,
      amount,
      description,
      category,
      date,
      recurrence,
    })
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to create transaction.' }
  }
}

export async function deleteTransactionAction(id: string) {
  try {
    await deleteTransaction(id)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete transaction' }
  }
}
