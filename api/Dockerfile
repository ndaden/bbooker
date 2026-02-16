# Use the node image (Prisma compatibility)
FROM node:20-bullseye-slim
WORKDIR /app

# Install Bun
RUN npm install -g bun

# Copy package files and Prisma schema
COPY package.json bun.lockb ./
COPY prisma ./prisma/

# Install dependencies (incl. devDeps for Prisma CLI during build)
RUN bun install

# Generate Prisma client
RUN bunx prisma generate

# Copy source code
COPY src ./src/
COPY tsconfig.json ./

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

# Set environment and user
ENV NODE_ENV=production
USER node
EXPOSE 3002

# Check MongoDB replica set before starting
CMD ["/bin/bash", "-c", "bun src/index.ts"]

