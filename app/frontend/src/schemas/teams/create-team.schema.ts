import z from 'zod'

export const createTeamSchema = z.object({
  name: z.string().min(2, 'Team name is required'),
  description: z.string().max(200, 'Description must be under 200 characters').optional(),
})

export type CreateTeamSchema = z.infer<typeof createTeamSchema>
