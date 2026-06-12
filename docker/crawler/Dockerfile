# Stage 1: Dependency source
FROM node:24-alpine AS deps-source
WORKDIR /usr/local/app

# Copy root and package-specific manifests to leverage Docker cache
COPY package.json package-lock.json ./
COPY apps/crawler/package.json ./apps/crawler/
COPY packages/shared/package.json ./packages/shared/

# Stage 2: Dependencies
FROM deps-source AS deps
RUN npm ci

# Stage 3: Application Source
FROM deps AS app-source
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/crawler ./apps/crawler

# Stage 4: Builder
FROM app-source AS builder
RUN npm run build:shared && npm run build --workspace=apps/crawler

# Stage 5: Development
FROM app-source AS dev
WORKDIR /usr/local/app/apps/crawler
EXPOSE 5001
CMD ["npm", "run", "server"]

# Stage 6: Production
FROM deps-source AS prod
WORKDIR /usr/local/app/apps/crawler
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /usr/local/app
COPY --from=builder /usr/local/app/package.json /usr/local/app/package-lock.json ./
COPY --from=builder /usr/local/app/packages/shared ./packages/shared
COPY --from=builder /usr/local/app/apps/crawler/package.json ./apps/crawler/package.json
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder --chown=nestjs:nodejs /usr/local/app/apps/crawler/dist ./apps/crawler/dist

# Give the nestjs user full read-write access to the workdir
RUN chown -R nestjs:nodejs /usr/local/app/apps/crawler/

USER nestjs
EXPOSE 5001
WORKDIR /usr/local/app/apps/crawler
CMD ["node", "dist/apps/crawler/src/server.js"]
