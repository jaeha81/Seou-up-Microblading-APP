FROM python:3.11-slim

WORKDIR /app

# System deps: psycopg2 only — mediapipe/opencv not needed in production
# (SIMULATION_ADAPTER=huggingface; mediapipe falls back gracefully on ImportError)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --timeout 300 -r requirements.txt

COPY . .

RUN mkdir -p storage/uploads

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
