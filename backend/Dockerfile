# Use a lightweight Node.js 20 Alpine image for smaller size and security
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (optimizes caching for dependency install)
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the source code (including src/, tsconfig.json, etc.)
COPY . .

# Clean previous build artifacts to force fresh compilation
RUN rm -rf dist

# Build the NestJS app (transpiles TS to JS in /app/dist)
RUN npm run build

# Production stage (optional multi-stage, but keeps image small)
FROM node:20-alpine

WORKDIR /app

# Copy only the built artifacts + production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy env files if they exist on host (they are gitignored, but present during build)
COPY --from=builder /app/.env* ./

# Expose the port your app listens on
EXPOSE 3001

# Run the compiled app
CMD ["node", "dist/main.js"]