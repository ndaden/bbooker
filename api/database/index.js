const mongoose = require("mongoose");
const { initDatabase } = require("./database.init");

const connectToDatabase = async (
  connectionString,
  dbName,
  withInitDatabase = false
) => {
  try {
    await mongoose.connect(connectionString, { dbName: dbName });
    console.log("Successfully connected to the database.");

    if (withInitDatabase) {
      try {
        await initDatabase(true);
        console.log("Database initiated successfully.");
      } catch (e) {
        console.log("Error while initiating database: ", e);
      }
    }
  } catch (e) {
    console.log(
      "Error while connecting to the Database. Please contact your system admin.",
      process.env.MONGODB_URL
    );
  }
};

module.exports = { connectToDatabase };
