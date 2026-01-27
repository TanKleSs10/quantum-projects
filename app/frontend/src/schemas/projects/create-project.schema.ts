import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().max(1000).optional(),
  tags: z.string().optional(),
  deadline: z.string().optional(),
  teamId: z.string().min(1, 'Team is required'),
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>
