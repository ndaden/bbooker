// Script d'initialisation du replica set MongoDB
rs.initiate({
  _id: "rs0",
  members: [
    {
      _id: 0,
      host: "mongodb:27017"
    }
  ]
});

print("✅ Replica set rs0 initialisé");

// Attendre que le replica set soit actif
while (!db.isMaster().ismaster) {
  sleep(100);
}

print("✅ Replica set actif, création utilisateur...");

// Créer la base bbooker et l'utilisateur
db = db.getSiblingDB('bbooker');

db.createUser({
  user: 'bbooker_user',
  pwd: 'bbooker_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'bbooker'
    }
  ]
});

print("✅ Utilisateur bbooker_user créé avec succès");