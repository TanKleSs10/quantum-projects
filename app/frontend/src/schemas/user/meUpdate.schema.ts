import z from "zod";

export const meUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(160, "Bio must be at most 160 characters long").optional(),
});

export type MeUpdateSchema = z.infer<typeof meUpdateSchema>;
