
##### Stage 1 - Development - Generate build folder
FROM node:21-slim AS builder

WORKDIR /usr/src/app

# Copying package.json and yarn.lock (or package-lock.json if using npm)
COPY package*.json ./

# Optional: Copy .npmrc if you have custom npm configuration
# COPY .npmrc ./

ENV PUPPETEER_SKIP_DOWNLOAD="true"

# Install dependencies, including dev dependencies
RUN npm ci
# Copy the rest of your app's source code
COPY . .

# Build your SvelteKit app
RUN npm run build

##### Stage 2 - Production
FROM node:21-slim as production

WORKDIR /usr/src/app

# Setting the NODE_ENV environment variable to production ensures
# that only production dependencies are installed
ENV NODE_ENV=production

# Copy package.json and yarn.lock to install production dependencies
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci

# Copy the built app from the builder stage
COPY --from=builder /usr/src/app/build ./build

# The start command should use the adapter-node's output
CMD [ "node", "build/index.js" ]
