# API Reference

Base URL: `http://localhost:8000`

Full interactive docs: http://localhost:8000/docs (Swagger UI)

## Health

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/health` | Returns `{"status":"ok"}` |

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Current user info |
| PATCH | `/api/auth/me` | ✓ | Update profile (name, language) |
| POST | `/api/auth/consent` | ✓ | Accept legal consent |

## Simulations (`/api/simulations`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/simulations` | ✓ | Create simulation job |
| GET | `/api/simulations` | ✓ | List user's simulations |
| GET | `/api/simulations/{id}` | ✓ | Get single simulation |
| POST | `/api/simulations/{id}/upload` | ✓ | Upload image + run simulation |
| PATCH | `/api/simulations/{id}/note` | ✓ | Add session note (Pro) |

## Eyebrow Styles (`/api/eyebrow-styles`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/eyebrow-styles` | — | List all active styles |
| GET | `/api/eyebrow-styles/{slug}` | — | Get style by slug |
| POST | `/api/eyebrow-styles` | Admin | Create new style |

## Guides (`/api/guides`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/guides` | — | List published guide articles |
| GET | `/api/guides/{slug}` | — | Get article by slug |

## Providers (`/api/providers`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/providers` | — | List active providers |
| GET | `/api/providers/{id}` | — | Get provider details |
| POST | `/api/providers` | ✓ | Create provider listing |

## Feedback (`/api/feedback`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/feedback` | ✓ | Submit feedback (authenticated) |
| POST | `/api/feedback/anonymous` | — | Submit anonymous feedback |

## Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/feedbacks` | Admin | List all feedback |
| PATCH | `/api/admin/users/{id}/deactivate` | Admin | Deactivate user |

## Simulation Status Values

| Status | Description |
|--------|-------------|
| `pending` | Job created, no image yet |
| `processing` | Image uploaded, AI running |
| `completed` | Simulation done |
| `failed` | Error during processing |
