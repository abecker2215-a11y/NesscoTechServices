# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies first (with prisma schema available)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# Install openssl for Prisma engine detection
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY . .

# NEXT_PUBLIC_* values are inlined at build time; .env files are excluded by
# .dockerignore, so accept them as build args and expose them to the build.
ARG NEXT_PUBLIC_GA_ID=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

RUN npm run build

# Runner stage - use Debian slim to avoid Prisma libssl issues on Alpine
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "server.js"]