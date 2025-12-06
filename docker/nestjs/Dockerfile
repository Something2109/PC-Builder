# Using a more recent stable Node.js Alpine image as the base.
FROM node:24-alpine AS deps

# Set the working directory.
WORKDIR /usr/local/app

# Copy package.json and package-lock.json to leverage Docker cache.
COPY package.json package-lock.json* ./

# Install all dependencies, including devDependencies needed for the build and dev stages.
RUN npm install

# Copy the application source code into the image.
# These layers are shared between the dev and builder stages.
COPY controllers ./controllers
COPY models ./models
COPY utils ./utils
COPY nest-cli.json ./
COPY tsconfig.json ./

# --- Development Stage ---
# This stage uses the 'deps' stage as a base and runs the app in development mode.
FROM deps AS dev
WORKDIR /usr/local/app
EXPOSE 3000

# Command to start the application in development mode with hot-reloading.
CMD ["npm", "run", "start:dev"]

# --- Builder Stage ---
# This stage builds the application for production.
FROM deps AS builder
WORKDIR /usr/local/app

# Run the build script to generate the 'dist' folder.
RUN npm run build

# --- Production Stage ---
# This is the final, lightweight production image.
FROM node:22-alpine AS prod
WORKDIR /usr/local/app

# Copy package files again to install only production dependencies.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy the built application from the 'builder' stage.
COPY --from=builder /usr/local/app/dist ./dist

EXPOSE 3000

# Command to start the application in production mode.
# "start:prod" is used as defined in package.json.
CMD ["npm", "run", "start:prod"]
