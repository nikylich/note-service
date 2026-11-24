# Схема базы данных

```mermaid
erDiagram
    users ||--o{ notes : "owner"
    users ||--o{ note_shares : "shared_with"
    notes ||--o{ note_shares : "has"
    notes ||--o{ note_tags : "has"
    tags ||--o{ note_tags : "has"

    users {
        int id PK
        string email UK
        string password_hash
        string name
        datetime created_at
    }
    notes {
        int id PK
        int owner_id FK
        string title
        text content
        string color
        string status "active|archived|trashed"
        datetime deleted_at
        datetime created_at
        datetime updated_at
    }
    tags {
        int id PK
        int owner_id FK
        string name
    }
    note_tags {
        int note_id FK
        int tag_id FK
    }
    note_shares {
        int id PK
        int note_id FK
        int user_id FK
        string role "reader|editor"
        datetime created_at
    }
