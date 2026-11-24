import { Router, Response } from 'express';
import { NotesService } from './notes.service';
import { authRequired, AuthRequest } from '../../middleware/auth';
import { noteCreateSchema } from './notes.schemas';

const router = Router();

// Все роуты ниже требуют авторизации
router.use(authRequired);

// Создать заметку
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = noteCreateSchema.parse(req.body);
    const note = await NotesService.create(req.userId!, data);
    res.status(201).json(note);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Получить все заметки
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const notes = await NotesService.getAll(req.userId!);
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить одну заметку
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const note = await NotesService.getById(Number(req.params.id), req.userId!);
    if (!note) return res.status(404).json({ error: 'Заметка не найдена' });
    res.json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/share', async (req: AuthRequest, res: Response) => {
  try {
    const { email, role } = req.body;
    const share = await NotesService.share(Number(req.params.id), req.userId!, email, role);
    res.json(share);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
export default router;