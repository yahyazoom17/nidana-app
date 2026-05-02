# ── Frontend ─────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (ci respects package-lock.json exactly)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Production image (nginx) ──────────────────────────────────────────────────
FROM nginx:alpine AS frontend

# Copy built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: serve SPA, proxy /api → backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
