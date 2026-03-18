# Seou-up Microblading 💄

> **⚠️ Disclaimer**: Seou-up Microblading is an information and visualization support platform only.
> Not a licensed medical or procedure provider. Always consult a certified professional before any procedure.

## Overview

**Seou-up Microblading** is an MVP platform for:
- 🎨 AI Brow Simulation (Mock Adapter → MediaPipe Phase 4)
- 🗂️ Startup Guide for microblading entrepreneurs
- 📍 Provider directory
- 👥 Multi-role auth (Consumer / Pro / Founder / Admin)
- 🌍 Multi-language: EN · KO · TH · VI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS · next-intl |
| Backend | FastAPI · Python 3.11+ |
| Database | PostgreSQL 15 · SQLAlchemy · Alembic |
| Auth | JWT (python-jose) · bcrypt |
| AI | Mock Adapter (MVP) → MediaPipe (Phase 4) |

## Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- Python ≥ 3.11
- PostgreSQL ≥ 15

### 1. Database Setup
```bash
psql -U postgres
CREATE DATABASE seou_up_db;
\q
```

### 2. Backend
```bash
cd apps/api
cp .env.example .env        # Edit DATABASE_URL & JWT_SECRET_KEY
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head        # Creates 9 tables
python seeds/run_seeds.py   # Seeded 12 eyebrow styles · 5 guides · 5 compliance notices
uvicorn main:app --reload --port 8000
```

**Verify**: http://localhost:8000/health → `{"status":"ok"}`

### 3. Frontend
```bash
cd apps/web
npm install
npm run dev
```

**Verify**: http://localhost:3000

## Screen Structure

| URL | Role | Description |
|-----|------|-------------|
| `/en` | All | Landing page |
| `/en/simulate` | All | **Core** — Brow simulation |
| `/en/auth/register` | All | Registration (role selection) |
| `/en/auth/login` | All | Login |
| `/en/onboarding` | All | First-time onboarding + legal consent |
| `/en/pro/dashboard` | Pro | Consultation dashboard |
| `/en/pro/session` | Pro | Client simulation session |
| `/en/guide` | Founder | Startup guide home |
| `/en/providers` | Consumer | Find clinics |
| `/en/feedback` | All | Feedback submission |
| `/en/legal` | All | Legal notices |
| `/en/profile` | Logged in | Profile & language settings |
| `/en/admin` | Admin | Admin dashboard |

## File Count
- **Total**: 80 files
- Backend (FastAPI): 40
- Frontend (Next.js): 24
- Seeds: 6
- Docs: 7
- Config: 3

## Post-MVP Roadmap

| Phase | Feature | Location |
|-------|---------|----------|
| Phase 4 | Real AI overlay (MediaPipe) | `apps/api/services/simulation_service.py → MediaPipeAdapter` |
| Phase 4 | Social login (Google, Kakao) | `apps/api/routers/auth.py` |
| Phase 5 | PDF export | `apps/api/routers/ → /export` |
| Phase 5 | Celery async queue | `simulation_service.py → Celery worker` |
| Phase 6 | Clinic map integration | `providers/[id]/page.tsx` |
| Phase 6 | Partner accounts & ads | `provider_listings → paid plan` |

---

*Seou-up Microblading is an information and visualization support platform only. Not a licensed medical or procedure provider.*

---

## 📊 개발 현황 <!-- jh-progress -->

| 항목 | 내용 |
|------|------|
| **진행률** | `███████░░░░░░░░░░░░░` **35%** |
| **레포** | [Seou-up-Microblading-](https://github.com/jaeha81/Seou-up-Microblading-) |

> 진행률: 35%
