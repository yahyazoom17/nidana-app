# ── Backend ──────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS backend

# System deps required by pytesseract and pdf2image
RUN apt-get update && apt-get install -y --no-install-recommends \
        tesseract-ocr \
        poppler-utils \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv (fast Python package manager used by this project)
RUN curl -Ls https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

# Copy dependency files first for better layer caching
COPY pyproject.toml uv.lock ./

# Install dependencies into the system Python (no venv needed in a container)
RUN uv sync --frozen --no-dev

# Pin numpy<2 — crewai/langchain use numpy.floating which was removed in NumPy 2.0
RUN uv pip install "numpy<2.0"

# Copy application source
COPY . .

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
