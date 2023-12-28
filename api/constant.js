const mongoDb_ConnectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}`;
const mongoDb_dbName = process.env.MONGODB_DBNAME;

module.exports = { mongoDb_ConnectionString, mongoDb_dbName };
