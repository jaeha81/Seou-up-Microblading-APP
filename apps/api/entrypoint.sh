#!/bin/sh
set -e

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
alembic upgrade head

echo "🌱 Running seeds..."
python seeds/run_seeds.py

echo "🚀 Starting API server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
