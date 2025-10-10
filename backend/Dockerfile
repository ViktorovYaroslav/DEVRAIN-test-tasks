FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY apps ./apps
COPY scripts ./scripts

# Default command runs the Task 2 smoke test; for API later, override CMD to run uvicorn
CMD ["python", "scripts/smoke_task2.py"]
