FROM python:3.11-slim

WORKDIR /app

# System deps: psycopg2, pillow, mediapipe, opencv
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    libglib2.0-0 libgl1 libgomp1 \
    libsm6 libxext6 libxrender1 \
    libprotobuf23 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Two-pass install: heavy ML packages first to surface errors early
RUN pip install --no-cache-dir --timeout 300 \
    mediapipe==0.10.14 \
    opencv-python-headless==4.9.0.80

RUN pip install --no-cache-dir --timeout 300 -r requirements.txt

COPY . .

RUN mkdir -p storage/uploads

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
