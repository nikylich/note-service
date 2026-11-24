import { Router } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.schemas';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json({ error: 'VALIDATION_ERROR', details: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json({ error: 'VALIDATION_ERROR', details: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
});

export default router;
