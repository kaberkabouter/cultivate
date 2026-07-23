import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './auth'
import { createTopicSchema, updateTopicSchema } from './topic'
import { createTransactionSchema } from './transaction'

describe('Zod Validation Schemas - Auth', () => {
  it('should validate valid login input', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email format in login', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email')
    }
  })

  it('should reject short passwords in registration', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123',
      displayName: 'User',
    })
    expect(result.success).toBe(false)
  })
})

describe('Zod Validation Schemas - Topic', () => {
  it('should validate topic creation with valid data', () => {
    const result = createTopicSchema.safeParse({
      name: 'Side Project',
      description: 'Consulting income & expenses',
      color: '#10b981',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty topic name', () => {
    const result = createTopicSchema.safeParse({
      name: '   ',
      color: '#10b981',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid hex color format', () => {
    const result = createTopicSchema.safeParse({
      name: 'Valid Name',
      color: 'red',
    })
    expect(result.success).toBe(false)
  })
})

describe('Zod Validation Schemas - Transaction', () => {
  it('should validate correct transaction input', () => {
    const result = createTransactionSchema.safeParse({
      topicId: 'topic-123',
      type: 'income',
      amount: '1500.50',
      description: 'Freelance Design',
      category: 'Design',
      date: '2026-07-23',
      recurrence: 'monthly',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.amount).toBe(1500.5)
    }
  })

  it('should reject negative or zero amounts', () => {
    const result = createTransactionSchema.safeParse({
      topicId: 'topic-123',
      type: 'expense',
      amount: '-50',
      description: 'Coffee',
      category: 'Food',
      date: '2026-07-23',
      recurrence: 'once',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid date format', () => {
    const result = createTransactionSchema.safeParse({
      topicId: 'topic-123',
      type: 'income',
      amount: 100,
      description: 'Payment',
      category: 'Other',
      date: '23-07-2026',
      recurrence: 'once',
    })
    expect(result.success).toBe(false)
  })
})
