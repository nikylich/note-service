# Note Service
всё сделано в 
Full-stack сервис заметок с архивом.

## Стек
- **Frontend:** React (Vite) + TypeScript, TailwindCSS, TanStack Query
- **Backend:** Node.js + Express + TypeScript
- **БД:** PostgreSQL + Prisma
- **Auth:** JWT (access + refresh) + bcrypt
- **Валидация:** Zod
- **Тесты:** Vitest + Supertest

## Схема БД
Подробно: [docs/db-schema.md](docs/db-schema.md)
Связи: `users → notes` (владелец), `notes *—* users` (через `note_shares`, роли), `notes *—* tags` (через `note_tags`).

## Переменные окружения
Смотри `.env.example`. Нужны: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `CLIENT_URL`, `VITE_API_URL`.

## Запуск локально
1. Поднять БД (Postgres): 
   `docker run --name notes-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=notes_db -p 5432:5432 -d postgres:15`
2. Backend:
   ```bash
   cd server
   cp ../.env.example .env
   npm install
   npx prisma migrate dev && npx prisma db seed
   npm run dev
