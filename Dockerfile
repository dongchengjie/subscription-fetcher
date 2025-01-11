# Use the official Bun image
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

FROM base AS install
# Install dependencies
RUN mkdir -p /temp/bun
COPY package.json bun.lockb /temp/bun/
RUN cd /temp/bun && bun install --frozen-lockfile
# Install Sub-Store backend
ADD https://github.com/sub-store-org/Sub-Store/releases/latest/download/sub-store.bundle.js sub-store.js

FROM base AS action
COPY --from=install /temp/bun/node_modules node_modules
COPY --from=install /usr/src/app/sub-store.js .
COPY . .

# Set environment variables
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV SUB_STORE_BACKEND_API_PORT=3000

# Run the app
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]