# Setup Guide

## Prerequisites

| Tool | Required Version | Check |
|------|-----------------|-------|
| Node.js | ≥ 18.0.0 | `node --version` |
| Python | ≥ 3.11 | `python --version` |
| PostgreSQL | ≥ 15 | `psql --version` |
| Git | Latest | `git --version` |

## Step 1: Clone

```bash
git clone https://github.com/jaeha81/Seou-up-Microblading-.git
cd Seou-up-Microblading-
```

## Step 2: Environment Variables

```bash
cd apps/api
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/seou_up_db
JWT_SECRET_KEY=<generate-random-64-char-string>
SIMULATION_ADAPTER=mock
```

## Step 3: Database

```bash
psql -U postgres
CREATE DATABASE seou_up_db;
\q

cd apps/api
alembic upgrade head
python seeds/run_seeds.py
```

Expected output:
```
✓ Seeded 12 eyebrow styles
✓ Seeded 5 guide articles
✓ Seeded 5 compliance notices
```

## Step 4: Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate    # Mac/Linux
.venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Verify:
- http://localhost:8000/health → `{"status":"ok"}`
- http://localhost:8000/docs → Swagger UI

## Step 5: Frontend

```bash
cd apps/web
npm install
npm run dev
```

Verify: http://localhost:3000

## Troubleshooting

| Symptom | Solution |
|---------|---------|
| `alembic upgrade head` fails | Check `.env` DATABASE_URL. Ensure PostgreSQL is running. |
| `npm install` error | Check Node.js version: `node --version` (needs ≥ 18) |
| CORS error in browser | Check `.env` ALLOWED_ORIGINS includes `http://localhost:3000` |
| Image upload fails | Ensure `apps/api/storage/uploads/` directory exists (auto-created) |
| Simulation shows `failed` | Keep `SIMULATION_ADAPTER=mock` |
| Korean text missing | Use `/ko/` URL or change language in profile |
