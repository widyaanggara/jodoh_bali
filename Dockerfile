FROM node:20-alpine AS base

# ===== deps =====
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ===== build =====
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ===== runner =====
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3010

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/next.config.* ./

EXPOSE 3010
CMD ["node", "server.js"]