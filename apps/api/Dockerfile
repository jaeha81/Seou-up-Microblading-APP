FROM python:3.11-slim

WORKDIR /app

# System deps: psycopg2-binary, pillow, mediapipe, opencv-python-headless
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    libglib2.0-0 libgl1 libgomp1 \
    libsm6 libxext6 libxrender1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create upload directory
RUN mkdir -p storage/uploads

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
