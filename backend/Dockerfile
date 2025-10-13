# Base build stage
FROM python:3.13-slim AS builder

RUN mkdir /app

WORKDIR /app

# Set environement variables
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

# Upgade pip
RUN pip install --upgrade pip

COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.13-slim

RUN useradd -m -r seatingplanner && \
   mkdir /app && \
   chown -R seatingplanner /app

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

WORKDIR /app

# Copy application code
COPY --chown=seatingplanner:seatingplanner . .

# Switch to non-root user
USER seatingplanner

EXPOSE 8001

CMD ["gunicorn", "--bind", "0.0.0.0:8001", "--workers", "3", "seatingplanner.wsgi:application"]
