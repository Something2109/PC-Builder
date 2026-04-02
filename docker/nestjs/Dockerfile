# Stage 1: Dependency source
# Base image declaration and include dependency declaration sources.
FROM node:24-alpine AS deps-source
WORKDIR /usr/local/app

# Copy root and package-specific manifests to leverage Docker cache.
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Stage 2: Dependencies
# Installs dependencies and caches them in a separate layer.
FROM deps-source AS deps
# Use root to install all workspace dependencies
RUN npm ci

# Stage 3: Application Source
# This stage contains the source code and is used as a common base for the 
# builder and dev stages to avoid duplicating the COPY commands.
FROM deps AS app-source

# Copy only necessary folders for the backend build
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Stage 4: Builder
# Builds the NestJS application for production.
FROM app-source AS builder
RUN npm run build

# Stage 5: Development
# Creates an image for local development.
FROM app-source AS dev
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Stage 6: Production
# Final, lean, and secure production image.
FROM deps-source AS prod
WORKDIR /usr/local/app/apps/backend
ENV NODE_ENV=production

# Create a non-root user for security.
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Install production dependencies (from root to handle workspaces)
WORKDIR /usr/local/app
COPY --from=builder /usr/local/app/package.json /usr/local/app/package-lock.json ./
COPY --from=builder /usr/local/app/packages/shared ./packages/shared
COPY --from=builder /usr/local/app/apps/backend/package.json ./apps/backend/package.json
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder --chown=nestjs:nodejs /usr/local/app/apps/backend/dist ./dist

# Give the nestjs user full read-write access to the workdir
RUN chown -R nestjs:nodejs /usr/local/app/apps/backend/

USER nestjs
EXPOSE 3000
WORKDIR /usr/local/app/apps/backend
CMD ["node", "dist/controllers/main"]
