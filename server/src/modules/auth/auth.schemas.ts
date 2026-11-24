import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
});

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string(),
});