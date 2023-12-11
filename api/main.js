const express = require("express");
const app = express();
const cors = require("cors");

const { connectToDatabase } = require("./database");
const { mongoDb_ConnectionString, mongoDb_dbName } = require("./constant");

const userController = require("./controllers/user.controller");
const roleController = require("./controllers/role.controller");
const businessController = require("./controllers/business.controller");
const serviceController = require("./controllers/service.controller");
const appointmentController = require("./controllers/appointment.controller");

app.use(express.json());
app.use(cors());

app.get("/", (req, resp) => {
  resp.send("API is running.");
});

app.use("/user", userController);
app.use("/role", roleController);
app.use("/business", businessController);
app.use("/service", serviceController);
app.use("/appointment", appointmentController);

app.listen(3001, () => {
  console.log("Api running on port 3001");
  connectToDatabase(mongoDb_ConnectionString, mongoDb_dbName, false);
});
