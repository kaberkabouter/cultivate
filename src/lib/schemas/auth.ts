import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
})

export const registerSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  displayName: z.string().trim().min(2, { message: 'Display name must be at least 2 characters long.' }).optional().or(z.literal('')),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
