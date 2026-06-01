FROM python:3.11-slim

WORKDIR /app

# System deps: psycopg2, pillow, mediapipe, opencv
# libprotobuf32 is the correct package name on Debian bookworm (Python 3.11-slim base)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    libglib2.0-0 libgl1 libgomp1 \
    libsm6 libxext6 libxrender1 \
    libprotobuf32 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --timeout 300 -r requirements.txt

COPY . .

RUN mkdir -p storage/uploads

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
