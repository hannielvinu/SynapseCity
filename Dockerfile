# Stage 1: Build the application assets
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy sources and compile
COPY . .
RUN npm run build

# Stage 2: Serve the production bundle
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/simulation_history.json ./simulation_history.json

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
