#!/usr/bin/env bash

echo "Checking MongoDB replica set status..."

MONGODB_URL="${DATABASE_URL:-mongodb://mongodb:27017/bbooker?replicaSet=rs0}"

# Extract host from connection string
MONGO_HOST=$(echo "$MONGODB_URL" | sed -n 's|.*://\([^:/@]*\).*|\1|p')
MONGO_PORT=$(echo "$MONGODB_URL" | sed -n 's|.*:\([0-9]*\).*|\1|p')

# Default values
MONGO_HOST="${MONGO_HOST:-mongodb}"
MONGO_PORT="${MONGO_PORT:-27017}"

echo "Attempting to connect to MongoDB at $MONGO_HOST:$MONGO_PORT..."

# Try to connect and check replica set status
for i in {1..30}; do
  if mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" --quiet --eval "rs.status()" >/dev/null 2>&1; then
    echo "✅ MongoDB replica set is ready!"
    exit 0
  fi
  echo "Waiting for MongoDB replica set... (${i}/30)"
  sleep 2
done

echo "❌ MongoDB replica set is not ready. Startup proceeding anyway..."
exit 0
