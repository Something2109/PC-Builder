# Stage 1: Dependency source
FROM node:24-alpine AS deps-source
WORKDIR /usr/local/app

# Copy root and package-specific manifests to leverage Docker cache
COPY package.json package-lock.json ./
COPY apps/mcp-server/package.json ./apps/mcp-server/
COPY packages/shared/package.json ./packages/shared/

# Stage 2: Dependencies
FROM deps-source AS deps
RUN npm ci

# Stage 3: Application Source
FROM deps AS app-source
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/mcp-server ./apps/mcp-server

# Stage 4: Builder
FROM app-source AS builder
RUN npm run build:shared && npm run build:mcp

# Stage 5: Development
FROM app-source AS dev
WORKDIR /usr/local/app/apps/mcp-server
EXPOSE 3012
CMD ["npm", "run", "start"]

# Stage 6: Production
FROM deps-source AS prod
WORKDIR /usr/local/app/apps/mcp-server
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S mcpuser -u 1001

WORKDIR /usr/local/app
COPY --from=builder /usr/local/app/package.json /usr/local/app/package-lock.json ./
COPY --from=builder /usr/local/app/packages/shared ./packages/shared
COPY --from=builder /usr/local/app/apps/mcp-server/package.json ./apps/mcp-server/package.json
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder --chown=mcpuser:nodejs /usr/local/app/apps/mcp-server/dist ./apps/mcp-server/dist

RUN chown -R mcpuser:nodejs /usr/local/app/apps/mcp-server/

USER mcpuser
EXPOSE 3012
WORKDIR /usr/local/app/apps/mcp-server
CMD ["node", "dist/apps/mcp-server/src/index.js"]
