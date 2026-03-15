# Deployment Guide

## Local Development

See [setup.md](./setup.md) for local setup.

## Production Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
cp .env.example .env
# Edit .env with production values

docker-compose up -d
```

Services:
- `db`: PostgreSQL 15
- `api`: FastAPI (port 8000)
- `web`: Next.js (port 3000)

### Option 2: Manual Production

#### Backend (FastAPI)
```bash
cd apps/api
pip install -r requirements.txt
alembic upgrade head
python seeds/run_seeds.py
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend (Next.js)
```bash
cd apps/web
npm ci
npm run build
npm start
```

## Environment Variables (Production)

```env
DATABASE_URL=postgresql://user:password@db-host:5432/seou_up_db
JWT_SECRET_KEY=<minimum-64-character-random-string>
SIMULATION_ADAPTER=mock
ALLOWED_ORIGINS=https://yourdomain.com
APP_ENV=production
DEBUG=false
```

## Phase 4: Enabling Real AI (MediaPipe)

1. Install additional deps:
   ```
   mediapipe==0.10.14
   opencv-python-headless==4.9.0.80
   ```

2. Update `.env`:
   ```
   SIMULATION_ADAPTER=mediapipe
   ```

3. Implement `MediaPipeAdapter.process()` in:
   `apps/api/services/simulation_service.py`

## Security Checklist

- [ ] Change `JWT_SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=false` in production
- [ ] Configure HTTPS/SSL
- [ ] Set proper `ALLOWED_ORIGINS`
- [ ] Enable PostgreSQL authentication
- [ ] Configure file upload size limits
- [ ] Set up regular database backups
