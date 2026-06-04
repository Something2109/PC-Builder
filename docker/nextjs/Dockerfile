# Stage 1: Dependency source
FROM node:24-alpine AS deps-source
WORKDIR /usr/local/app

# Stage 2: Dependencies
# Installs dependencies and caches them in a separate layer.
FROM deps-source AS deps

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

# Stage 3: Application Source
# This stage contains the source code and is used as a common base for the 
# builder and dev stages to avoid duplicating the COPY commands.
FROM deps AS app-source

# Copy only necessary folders for the frontend build
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

# Stage 3: Builder
# Builds the Next.js application for production.
FROM app-source AS builder
RUN npm run build:shared && npm run build:frontend

# Stage 4: Development
# Creates an image for local development.
FROM app-source AS dev
WORKDIR /usr/local/app/apps/frontend
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 5: Production
# Final, lean, and secure production image.
FROM deps-source AS prod
ENV NODE_ENV=production

# Create a non-root user for security.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy built shared package and public assets
COPY --from=builder /usr/local/app/packages/shared ./packages/shared
COPY --from=builder /usr/local/app/apps/frontend/public ./apps/frontend/public
COPY --from=builder --chown=nextjs:nodejs /usr/local/app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/local/app/apps/frontend/.next/static ./apps/frontend/.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "apps/frontend/server.js"]
