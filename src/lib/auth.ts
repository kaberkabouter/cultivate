import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecret_cultivate_jwt_key_change_in_production_32bytes'
)

const COOKIE_NAME = 'cultivate_session'

export interface SessionPayload {
  userId: string
  email: string
  displayName?: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function createSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
