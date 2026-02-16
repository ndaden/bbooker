#!/usr/bin/env bash

echo "Checking MongoDB connectivity..."

MONGODB_URL="${DATABASE_URL:-mongodb://mongodb:27017/bbooker?replicaSet=rs0}"

# Extract host and port from connection string
MONGO_HOST=$(echo "$MONGODB_URL" | sed -n 's|.*://[^:/@]*:*[^/@]*@*\([^:/@]*\).*|\1|p')
MONGO_PORT=$(echo "$MONGODB_URL" | sed -n 's|.*:\([0-9]*\).*|\1|p')

# Default values
MONGO_HOST="${MONGO_HOST:-mongodb}"
MONGO_PORT="${MONGO_PORT:-27017}"

echo "Attempting TCP connection to MongoDB at $MONGO_HOST:$MONGO_PORT..."

# Try TCP connection (simpler than mongosh)
for i in {1..30}; do
  if timeout 2 bash -c "</dev/tcp/$MONGO_HOST/$MONGO_PORT" 2>/dev/null; then
    echo "✅ MongoDB is reachable!"
    exit 0
  fi
  echo "Waiting for MongoDB... (${i}/30)"
  sleep 1
done

echo "⚠️  MongoDB not yet reachable, but proceeding with startup..."
exit 0
