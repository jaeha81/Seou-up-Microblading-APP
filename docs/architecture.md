# Architecture

## System Overview

```
Browser (Next.js 14)
    ↕ HTTP / Proxy
FastAPI (port 8000)
    ↕ SQLAlchemy ORM
PostgreSQL 15
```

## Directory Structure

```
seou-up-microblading/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── main.py             # App entry point
│   │   ├── requirements.txt
│   │   ├── alembic.ini
│   │   ├── core/
│   │   │   ├── config.py       # Pydantic settings
│   │   │   ├── database.py     # SQLAlchemy engine + session
│   │   │   ├── security.py     # JWT + bcrypt
│   │   │   └── deps.py         # FastAPI dependencies
│   │   ├── models/             # SQLAlchemy ORM models (9 tables)
│   │   ├── schemas/            # Pydantic request/response models
│   │   ├── routers/            # FastAPI route handlers
│   │   ├── services/           # Business logic
│   │   ├── alembic/            # DB migrations
│   │   └── seeds/              # Initial data
│   └── web/                    # Next.js 14 frontend
│       ├── src/
│       │   ├── app/
│       │   │   └── [locale]/   # i18n route groups
│       │   ├── components/     # Shared React components
│       │   ├── lib/            # API client
│       │   └── messages/       # i18n JSON (en, ko, th, vi)
│       └── middleware.ts        # next-intl routing
├── docs/
└── README.md
```

## Database Tables (9)

| Table | Purpose |
|-------|---------|
| `users` | Auth + roles (consumer/pro/founder/admin) |
| `eyebrow_styles` | 12 brow styles with i18n names |
| `simulations` | AI simulation jobs |
| `guide_articles` | Startup guide content |
| `compliance_notices` | Legal/compliance banners |
| `provider_listings` | Clinic directory |
| `feedbacks` | User feedback |
| `pro_sessions` | Pro consultation sessions |
| `consultations` | Pro ↔ consumer async messaging |

## Simulation Adapter Pattern

```python
# apps/api/services/simulation_service.py

class BaseSimulationAdapter:
    async def process(...) -> dict: ...

class MockAdapter(BaseSimulationAdapter):
    """MVP — immediate deterministic result"""

class MediaPipeAdapter(BaseSimulationAdapter):
    """Phase 4 — real facial landmark AI"""

def get_adapter() -> BaseSimulationAdapter:
    if settings.SIMULATION_ADAPTER == "mediapipe":
        return MediaPipeAdapter()
    return MockAdapter()   # default
```

Set `SIMULATION_ADAPTER=mediapipe` in `.env` to enable real AI (Phase 4).

## Auth Flow

1. POST `/api/auth/register` → returns JWT
2. POST `/api/auth/login` → returns JWT
3. Frontend stores JWT in `localStorage`
4. All protected endpoints require `Authorization: Bearer <token>`
5. POST `/api/auth/consent` — records legal consent acceptance

## i18n

Supported locales: `en` · `ko` · `th` · `vi`
- Routing: `/en/*` · `/ko/*` · `/th/*` · `/vi/*`
- Messages: `apps/web/src/messages/{locale}.json`
- Middleware: `apps/web/middleware.ts` (next-intl)
