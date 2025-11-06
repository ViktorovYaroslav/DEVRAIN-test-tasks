FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Persist Hugging Face caches on mounted volume (Railway volume recommended)
ENV TRANSFORMERS_CACHE=/data/hf-cache \
    SENTENCE_TRANSFORMERS_HOME=/data/sentence-transformers
RUN mkdir -p "$TRANSFORMERS_CACHE" "$SENTENCE_TRANSFORMERS_HOME"

# Copy application code
COPY apps ./apps
COPY scripts ./scripts

# Default command runs the Task 2 smoke test; for API later, override CMD to run uvicorn
# Default command: run API server
EXPOSE 8000
CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
