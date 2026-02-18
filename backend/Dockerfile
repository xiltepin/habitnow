# Backend Dockerfile for HabitNow
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "dist/main.js"]
