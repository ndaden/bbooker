# Use the node image (Prisma compatibility)
FROM node:20-bullseye-slim
WORKDIR /app

# Install Bun
RUN npm install -g bun

# Copy package files and Prisma schema
COPY package.json bun.lockb ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --production

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

CMD ["bun", "src/index.ts"]

