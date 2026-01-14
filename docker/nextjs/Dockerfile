FROM node:24-alpine AS deps-source
WORKDIR /usr/local/app/nextjs

# Stage 1: Dependencies
# Installs dependencies and caches them in a separate layer.
FROM deps-source AS deps

COPY docker/nextjs/package.json ./
COPY docker/nextjs/package-lock.json ./
RUN npm ci

# Stage 2: Application Source
# This stage contains the source code and is used as a common base for the 
# builder and dev stages to avoid duplicating the COPY commands.
FROM deps AS app-source

COPY docker/nextjs/next-env.d.ts ./
COPY docker/nextjs/next.config.js ./
COPY docker/nextjs/postcss.config.js ./
COPY docker/nextjs/tailwind.config.js ./
COPY docker/nextjs/tsconfig.json ./
COPY docker/nextjs/eslint.config.mjs ./
COPY utils ./utils
COPY public ./public
COPY components ./components
COPY app ./app

# Stage 3: Builder
# Builds the Next.js application for production. It inherits from the app-source stage.
FROM app-source AS builder
RUN npm run build

# Stage 4: Development
# Creates an image for local development. It also inherits from the app-source stage.
# To build this stage: `docker build --target=dev -t myapp-dev .`
FROM app-source AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 5: Production
# Final, lean, and secure production image.
# It uses the standalone output from the 'builder' stage.
# To build for production: `docker build -t myapp-prod .`
FROM deps-source AS prod
ENV NODE_ENV=production

# Create a non-root user for security.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy only the necessary build artifacts from the builder stage.
COPY --from=builder /usr/local/app/nextjs/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/local/app/nextjs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/local/app/nextjs/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
