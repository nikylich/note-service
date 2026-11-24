# API

Базовый URL: `http://localhost:3000/api`
Авторизация: `Authorization: Bearer <accessToken>`

## Формат ошибок

Пример ответа при ошибке: `{ "error": "FORBIDDEN", "message": "Недостаточно прав" }`

## Auth

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| POST | /auth/register | email, password, name | user, accessToken, refreshToken |
| POST | /auth/login | email, password | accessToken, refreshToken |
| POST | /auth/refresh | refreshToken | accessToken |
| GET | /users/me | — | user |

## Notes

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | /notes | auth | Список заметок |
| POST | /notes | auth | Создать заметку |
| GET | /notes/:id | owner/editor/reader | Одна заметка |
| PATCH | /notes/:id | owner/editor | Обновить заметку |
| DELETE | /notes/:id | owner | В корзину |
| POST | /notes/:id/restore | owner | Из корзины |
| DELETE | /notes/:id/permanent | owner | Удалить навсегда |
| POST | /notes/:id/archive | owner | В архив |
| POST | /notes/:id/unarchive | owner | Из архива |

## Tags

| Метод | Путь | Описание |
|---|---|---|
| GET | /tags | Теги пользователя |

## Sharing

| Метод | Путь | Тело | Описание |
|---|---|---|---|
| GET | /notes/:id/shares | — | Список участников |
| POST | /notes/:id/shares | email, role | Добавить доступ |
| PATCH | /notes/:id/shares/:userId | role | Сменить роль |
| DELETE | /notes/:id/shares/:userId | — | Отозвать доступ |
