import { z } from 'zod'

export const updateTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().max(500, 'Description is too long').optional(),
})

export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>
