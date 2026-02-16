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

# Set dummy DATABASE_URL for Prisma generation
ENV DATABASE_URL="mongodb://localhost:27017/bbooker"

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

# Create startup script to construct DATABASE_URL from env vars and regenerate Prisma
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
export DATABASE_URL="mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority"

# Remove cached Prisma client and regenerate it
rm -rf /app/node_modules/.prisma /app/node_modules/@prisma/client
bunx prisma generate
exec bun src/index.ts
EOF
RUN chmod +x /app/start.sh

# Check MongoDB replica set before starting
CMD ["/bin/bash", "-c", "./start.sh"]

