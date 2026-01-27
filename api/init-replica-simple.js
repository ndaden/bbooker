// Initialisation replica set simple pour développement
print("🔧 Initialisation du replica set...");

rs.initiate({
  _id: "rs0",
  members: [
    {
      _id: 0,
      host: "localhost:27017"
    }
  ]
});

print("✅ Replica set rs0 initialisé");