#!/bin/bash
set -euo pipefail

echo "⏳ Waiting for database..."
# Wait for DB to be ready
until python -c "
import sys, time
from sqlalchemy import create_engine, text
import os
url = os.getenv('DATABASE_URL', '')
for i in range(30):
    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            conn.execute(text('SELECT 1'))
        print('✅ Database ready')
        sys.exit(0)
    except Exception as e:
        print(f'  retry {i+1}/30: {e}')
        time.sleep(2)
sys.exit(1)
"; do
    sleep 2
done

echo "🔄 Running migrations..."
python -c "
import os, sys
from sqlalchemy import create_engine, text

url = os.getenv('DATABASE_URL', '')
engine = create_engine(url)
try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version_num FROM alembic_version LIMIT 1'))
        row = result.fetchone()
        if row:
            print(f'  Found alembic_version: {row[0]}')
except Exception:
    print('  No alembic_version table — fresh DB')
    sys.exit(0)

# Check if the recorded revision belongs to this app
import subprocess
result = subprocess.run(['alembic', 'history'], capture_output=True, text=True)
if row and row[0] not in result.stdout:
    print(f'  Stale revision {row[0]} from another project — resetting alembic_version')
    with engine.connect() as conn:
        conn.execute(text('DROP TABLE IF EXISTS alembic_version'))
        conn.commit()
    print('  alembic_version cleared')
"
alembic upgrade head

echo "🌱 Running seeds..."
python seeds/run_seeds.py

echo "🚀 Starting API server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
