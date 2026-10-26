# Multi-stage Dockerfile for GrocerStore React Application
# Supports both development and production builds via NODE_ENV

# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Build arguments for environment configuration
ARG NODE_ENV=production
ARG REACT_APP_API_BASE_URL=https://dummyjson.com

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
# NODE_ENV will control Redux DevTools:
# - development: Redux DevTools enabled
# - production: Redux DevTools disabled
# REACT_APP_API_BASE_URL is injected into process.env at build time
RUN NODE_ENV=${NODE_ENV} REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} yarn build

# Stage 2: Runtime
FROM node:24-alpine

WORKDIR /app

# Install lightweight HTTP server to serve static files
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Set default environment (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=8080

# Start application
# Note: Redux DevTools configuration is set at build time via NODE_ENV during yarn build
CMD ["serve", "-s", "dist", "-l", "8080"]
