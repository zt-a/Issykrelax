opencode -s ses_13399d9ddffeR5zNfQ3GeOfhjI

# IssykRelax — Project Status

## Что сделано (Day 1 MVP)
- Все SQLAlchemy модели с ForeignKey constraints
- Миграция Alembic создана и накатана
- Сид-скрипт заполнил БД тестовыми данными
- 22 REST эндпоинта работают (auth, properties, bookings, owner, admin)
- Booking flow: PENDING → PAID (demo auto-pay) → CHECKED_IN (owner verification code) → CANCELLED
- Wallet: hold на бронировании → release на check-in

## Что сделано (Day 3)
- **Reviews**: полный CRUD (создать отзыв после check-in, получить отзывы по объекту)
  - Проверка: только гость может оставить отзыв, только для checked_in броней, только 1 отзыв на бронь
- **Admin stats**: GET /api/v1/admin/stats (total_users, total_owners, total_properties, total_bookings, total_revenue)
- Всего **27 эндпоинтов** работают

## Как запустить

### Docker (единственный способ)
```bash
cd /mnt/hdd/Projects/prod/relax
docker compose -f docker-compose.dev.yml up -d
```
`.env` грузит `docker compose`, код читает только переменные окружения.

### Локально (без Docker — только для отладки)
```bash
cd /mnt/hdd/Projects/prod/relax/backend
source .venv/bin/activate
export POSTGRES_HOST=localhost POSTGRES_PORT=5432 POSTGRES_USER=relax POSTGRES_PASSWORD=relax_pass POSTGRES_DB=relax
export SECRET_KEY=dev-secret-key-change-in-production-please
export DEBUG=true
PYTHONPATH=/mnt/hdd/Projects/prod/relax/backend uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Структура

```
backend/
├── app/
│   ├── main.py                          # FastAPI entry point
│   ├── core/                            # config, database, security
│   ├── domain/                          # entities, interfaces
│   ├── application/
│   │   ├── dto/                         # Pydantic request/response
│   │   ├── interfaces/                  # repository interfaces
│   │   └── use_cases/                   # auth, bookings, owner, admin, properties, reviews
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── models/                  # SQLAlchemy models
│   │   │   └── repositories/            # implementations (+ review_repository)
│   │   └── services/                    # email, payment
│   └── presentation/api/v1/             # FastAPI routers (+ reviews.py)
├── alembic/                             # migrations
├── scripts/seed.py                      # seed data
└── pyproject.toml
```

## Тестовые пользователи

| Email | Password | Role |
|---|---|---|
| admin@issykrelax.kg | admin123 | ADMIN (is_superuser=true) |
| owner@issykrelax.kg | owner123 | OWNER (profile pre-approved) |
| user@issykrelax.kg | user123 | USER |

## Проверенные эндпоинты

| Method | Path | Тест |
|---|---|---|
| POST | /api/v1/auth/login | ✓ |
| POST | /api/v1/auth/register-user | ✓ |
| POST | /api/v1/auth/register-owner | ✓ |
| GET | /api/v1/auth/me | ✓ |
| POST | /api/v1/properties | ✓ |
| GET | /api/v1/properties | ✓ (search) |
| GET | /api/v1/properties/{id} | ✓ |
| GET | /api/v1/properties/categories | ✓ |
| GET | /api/v1/properties/cities | ✓ |
| GET | /api/v1/properties/amenities | ✓ |
| POST | /api/v1/bookings | ✓ (auto-pay → paid) |
| GET | /api/v1/bookings/my-bookings | ✓ |
| POST | /api/v1/bookings/{id}/cancel | ✓ (refund → cancelled) |
| GET | /api/v1/owner/properties | ✓ |
| PATCH | /api/v1/owner/properties/{id} | ✓ |
| DELETE | /api/v1/owner/properties/{id} | ✓ |
| GET | /api/v1/owner/bookings | ✓ |
| POST | /api/v1/owner/check-in | ✓ (mark_checked_in → wallet release) |
| GET | /api/v1/owner/wallet | ✓ (transactions available_balance/pending_balance) |
| GET | /api/v1/admin/owners | ✓ (paginated) |
| GET | /api/v1/admin/properties | ✓ (paginated) |
| GET | /api/v1/admin/bookings | ✓ (paginated) |
| GET | /api/v1/admin/stats | ✓ (total counts + revenue) |
| PATCH | /api/v1/admin/owners/{id}/approve | ✓ |
| PATCH | /api/v1/admin/properties/{id}/approve | ✓ |
| POST | /api/v1/reviews | ✓ (только для checked_in, 1 отзыв на бронь) |
| GET | /api/v1/reviews/property/{id} | ✓ (пагинация) |

## Известные issues
- Ruff: 97 E501 (line too long, max 100) — косметика
- Mypy: 45 errors (type annotations) — для MVP ок
- `require_approved_owner` dependency импортирован но не используется в `owner.py`

## На чём остановились
MVP готов. Можно дорабатывать:
- Фронтенд интеграция (сейчас Figma export, нет реальных API вызовов)
- Email уведомления (Celery + SMTP настроены, но не подключены)
- S3 для изображений (инфраструктура есть, не задействована)
- Тесты
- Production: Docker compose, Caddy/nginx, CI/CD
