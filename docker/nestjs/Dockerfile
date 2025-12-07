# Stage 1: Dependency source
# Base image declaration and include dependency declaration sources.
FROM node:24-alpine AS deps-source
WORKDIR /usr/local/app/nestjs

# Copy package.json and package-lock.json to leverage Docker cache.
COPY package.json package-lock.json* ./

# Stage 2: Dependencies
# Installs dependencies and caches them in a separate layer.
FROM deps-source AS deps

RUN npm ci

# Stage 3: Application Source
# This stage contains the source code and is used as a common base for the 
# builder and dev stages to avoid duplicating the COPY commands.
FROM deps AS app-source

COPY tsconfig.json ./
COPY nest-cli.json ./
COPY utils ./utils
COPY models ./models
COPY controllers ./controllers

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
ENV NODE_ENV=production

# Create a non-root user for security.
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Install production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder --chown=nestjs:nodejs /usr/local/app/nestjs/dist ./dist

# Give the nestjs user full read-write access to the workdir
RUN chown nestjs:nodejs /usr/local/app/nestjs/

USER nestjs
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
