import z from 'zod'

export const verifyEmailSchema = z.object({
  email: z.email("Invalid email address"),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>
