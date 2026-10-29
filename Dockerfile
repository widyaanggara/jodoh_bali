FROM node:20-alpine AS base

# ===== deps =====
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ===== development preview =====
# Komodo still builds from this Dockerfile, but the preview service targets this
# stage so it runs a real Next.js development server instead of server.js from a
# production standalone build.
FROM deps AS development
WORKDIR /app
COPY . .
ENV NODE_ENV=development
ENV PORT=3010
EXPOSE 3010
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3010"]

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
