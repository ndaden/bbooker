const mongoDb_ConnectionString = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}`;
const mongoDb_dbName = "questions";

module.exports = { mongoDb_ConnectionString, mongoDb_dbName };
