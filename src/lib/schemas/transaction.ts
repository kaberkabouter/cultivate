import { z } from 'zod'

export const transactionTypeSchema = z.enum(['income', 'expense'])
export const recurrenceSchema = z.enum(['once', 'weekly', 'biweekly', 'monthly', 'yearly'])

export const createTransactionSchema = z.object({
  topicId: z.string().min(1, { message: 'Topic selection is required.' }),
  type: transactionTypeSchema,
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  description: z.string().trim().min(1, { message: 'Description is required.' }).max(255, { message: 'Description cannot exceed 255 characters.' }),
  category: z.string().trim().min(1, { message: 'Category is required.' }).max(100, { message: 'Category cannot exceed 100 characters.' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format.' }),
  recurrence: recurrenceSchema.default('once'),
})

export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string().min(1, { message: 'Transaction ID is required.' }),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
