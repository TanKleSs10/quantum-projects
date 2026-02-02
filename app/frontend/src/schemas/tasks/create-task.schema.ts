import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'blocked', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>
