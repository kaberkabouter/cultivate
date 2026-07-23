import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from './auth'

describe('Auth Security Module - Password Hashing & Verification', () => {
  it('should hash a password and verify successfully', async () => {
    const rawPassword = 'SecurePassword123!'
    const hash = await hashPassword(rawPassword)

    expect(hash).not.toBe(rawPassword)
    expect(hash.length).toBeGreaterThan(20)

    const isValid = await verifyPassword(rawPassword, hash)
    expect(isValid).toBe(true)

    const isWrongValid = await verifyPassword('WrongPassword', hash)
    expect(isWrongValid).toBe(false)
  })
})

describe('Auth Security Module - JWT Session Tokens', () => {
  it('should create and verify valid session tokens', async () => {
    const payload = { userId: 'user-789', email: 'test@cultivate.app' }
    const token = await createSessionToken(payload)

    expect(typeof token).toBe('string')

    const verified = await verifySessionToken(token)
    expect(verified).not.toBeNull()
    expect(verified?.userId).toBe('user-789')
    expect(verified?.email).toBe('test@cultivate.app')
  })

  it('should return null for corrupted tokens', async () => {
    const result = await verifySessionToken('invalid.token.payload')
    expect(result).toBeNull()
  })
})
