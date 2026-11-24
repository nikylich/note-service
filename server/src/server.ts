import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import notesRoutes from './modules/notes/notes.routes'; // <-- Добавили

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes); // <-- Добавили

app.get('/', (req, res) => {
  res.json({ message: 'API работает!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});