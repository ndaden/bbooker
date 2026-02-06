#!/usr/bin/env bash
set -euo pipefail

MONGO_HOST="${MONGO_HOST:-mongodb}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_REPLICA_SET="${MONGO_REPLICA_SET:-rs0}"
MONGO_RS_MEMBER_HOST="${MONGO_RS_MEMBER_HOST:-mongodb:27017}"

AUTH_ARGS=()
if [[ -n "${MONGO_INITDB_ROOT_USERNAME:-}" && -n "${MONGO_INITDB_ROOT_PASSWORD:-}" ]]; then
  AUTH_ARGS=(--username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase "admin")
fi

echo "[mongo-rs-init] Waiting for MongoDB at ${MONGO_HOST}:${MONGO_PORT}..."
until mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" "${AUTH_ARGS[@]}" --quiet --eval "db.adminCommand({ ping: 1 })" >/dev/null 2>&1; do
  sleep 1
done

echo "[mongo-rs-init] Ensuring replica set ${MONGO_REPLICA_SET} is initialized..."
mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" "${AUTH_ARGS[@]}" --quiet --eval "try { rs.status().ok } catch (e) { rs.initiate({_id: '$MONGO_REPLICA_SET', members: [{ _id: 0, host: '$MONGO_RS_MEMBER_HOST' }]}) }"

echo "[mongo-rs-init] Done."
