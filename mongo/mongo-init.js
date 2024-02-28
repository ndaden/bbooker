db.auth('root', 'root');
// Initialize the replica set
rs.initiate();

db.getSiblingDB("bbooker");
var dbName = "bbooker";
// Create a new user in the target database
db.createUser({
  user: process.env.MONGODB_USERNAME,
  pwd: process.env.MONGODB_PASSWORD,
  roles: [{ role: 'readWrite', db: dbName }]
});