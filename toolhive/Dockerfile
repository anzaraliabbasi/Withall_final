# ToolHive — production image (any Docker host: VPS, Coolify, Railway, Koyeb, Render)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/schema.postgres.sql ./schema.postgres.sql
# run Postgres migrations then start (uses DATABASE_URL; falls back to SQLite)
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ] && [ -n \"$POSTGRES_DRIVER\" ]; then node scripts/migrate-standalone.mjs || true; fi && node server.js"]
USER app
EXPOSE 3000
