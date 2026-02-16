#!/usr/bin/env bash
set -euo pipefail

MONGO_HOST="${MONGO_HOST:-mongodb}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_REPLICA_SET="${MONGO_REPLICA_SET:-rs0}"
MONGO_RS_MEMBER_HOST="${MONGO_RS_MEMBER_HOST:-mongodb:27017}"
MONGO_INITDB_ROOT_USERNAME="${MONGO_INITDB_ROOT_USERNAME:-}"
MONGO_INITDB_ROOT_PASSWORD="${MONGO_INITDB_ROOT_PASSWORD:-}"

AUTH_ARGS=()
if [[ -n "${MONGO_INITDB_ROOT_USERNAME}" && -n "${MONGO_INITDB_ROOT_PASSWORD}" ]]; then
  AUTH_ARGS=(--username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase "admin")
fi

echo "[mongo-rs-init] Waiting for MongoDB at ${MONGO_HOST}:${MONGO_PORT}..."
for i in {1..30}; do
  if mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" "${AUTH_ARGS[@]}" --quiet --eval "db.adminCommand({ ping: 1 })" >/dev/null 2>&1; then
    echo "[mongo-rs-init] MongoDB is up!"
    break
  fi
  echo "[mongo-rs-init] Waiting... (${i}/30)"
  sleep 2
done

echo "[mongo-rs-init] Checking replica set status..."
RS_STATUS=$(mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" "${AUTH_ARGS[@]}" --quiet --eval "try { JSON.stringify(rs.status()); } catch(e) { '{}'; }")

if echo "$RS_STATUS" | grep -q '"_id"'; then
  echo "[mongo-rs-init] Replica set is already initialized."
else
  echo "[mongo-rs-init] Initializing replica set ${MONGO_REPLICA_SET}..."
  mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" "${AUTH_ARGS[@]}" --quiet --eval "
    try {
      rs.initiate({
        _id: '${MONGO_REPLICA_SET}',
        members: [{ _id: 0, host: '${MONGO_RS_MEMBER_HOST}' }]
      });
      print('Replica set initiated');
    } catch(e) {
      print('Error: ' + e.message);
    }
  "
  
  # Wait for replica set to be ready
  echo "[mongo-rs-init] Waiting for replica set to be ready..."
  for i in {1..30}; do
    if mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" "${AUTH_ARGS[@]}" --quiet --eval "rs.status().ok" >/dev/null 2>&1; then
      echo "[mongo-rs-init] Replica set is ready!"
      break
    fi
    echo "[mongo-rs-init] Waiting... (${i}/30)"
    sleep 2
  done
fi

echo "[mongo-rs-init] Done."
