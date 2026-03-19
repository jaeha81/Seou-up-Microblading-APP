@echo off
echo.
echo ========================================
echo   Seou-up Microblading - Dev Start
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking .env...
if not exist "apps\api\.env" (
    echo   Creating .env from .env.example...
    copy "apps\api\.env.example" "apps\api\.env"
)
echo   .env OK

echo.
echo [2/3] Starting Docker services (DB + Redis)...
docker compose up -d db redis
echo   Waiting 5 seconds for DB to initialize...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Setting up Python backend...
cd apps\api
if not exist ".venv" (
    echo   Creating virtual environment with Python 3.11...
    py -3.11 -m venv .venv 2>nul || python -m venv .venv
)
echo   Installing dependencies...
.venv\Scripts\pip install -r requirements.txt -q
echo   Running migrations...
.venv\Scripts\alembic upgrade head
echo   Seeding data...
.venv\Scripts\python seeds\run_seeds.py
cd ..\..

echo.
echo ========================================
echo   Starting servers...
echo   API:  http://localhost:8000
echo   Web:  http://localhost:3000
echo   Docs: http://localhost:8000/docs
echo ========================================
echo.

start "Seou-up API" cmd /k "cd /d "%~dp0apps\api" && .venv\Scripts\uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak > nul
start "Seou-up Web" cmd /k "cd /d "%~dp0apps\web" && npm run dev"

echo Both servers started! Open http://localhost:3000
pause
