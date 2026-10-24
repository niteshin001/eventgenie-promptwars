# EventGenie AI - Production Container for Google Cloud Run
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Ensure output is unbuffered
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Copy application files
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
COPY run.py /app/run.py

# Expose server port
EXPOSE 8080

# Run the server
CMD ["python", "run.py"]
