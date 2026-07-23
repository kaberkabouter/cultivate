import { z } from 'zod'

export const createTopicSchema = z.object({
  name: z.string().trim().min(1, { message: 'Topic name is required.' }).max(100, { message: 'Topic name cannot exceed 100 characters.' }),
  description: z.string().trim().max(500, { message: 'Description cannot exceed 500 characters.' }).optional(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { message: 'Must be a valid hex color code.' }).default('#3b82f6'),
})

export const updateTopicSchema = createTopicSchema.partial().extend({
  id: z.string().min(1, { message: 'Topic ID is required.' }),
  isActiveInForecast: z.boolean().optional(),
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>
