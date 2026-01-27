// Script d'initialisation MongoDB pour bbooker
db = db.getSiblingDB('bbooker');

// Créer un utilisateur dédié pour l'application
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

// Créer des index pour optimiser les performances
db.account.createIndex({ "email": 1 }, { unique: true });
db.business.createIndex({ "accountId": 1 });
db.service.createIndex({ "businessId": 1 });
db.appointment.createIndex({ "serviceId": 1 });
db.appointment.createIndex({ "accountId": 1 });
db.appointment.createIndex({ "startTime": 1 });

print("✅ Base de données bbooker initialisée avec utilisateur et index");