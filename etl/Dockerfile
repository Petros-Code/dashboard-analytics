FROM python:3.12-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VERSION=1.8.3

RUN apk add --no-cache \
    build-base \
    libpq-dev \
    musl-dev \
    postgresql-dev \
    curl \
    busybox \
    tzdata

RUN pip install --no-cache-dir "poetry==${POETRY_VERSION}" && \
    poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock* /app/

RUN poetry install --no-root --only main

COPY . /app