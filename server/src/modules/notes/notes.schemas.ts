import { z } from 'zod';

export const noteCreateSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200),
  content: z.string().default(''),
  color: z.string().default('yellow'),
  tags: z.array(z.string()).default([]),
});

export const noteUpdateSchema = noteCreateSchema.partial();