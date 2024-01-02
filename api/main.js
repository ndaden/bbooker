const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const app = express();
const UserModel = require("./schemas/user.schema");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const passport = require("passport");
const LocalStrategy = require("passport-local");

const { connectToDatabase } = require("./database");
const { mongoDb_ConnectionString, mongoDb_dbName } = require("./constant");

const userController = require("./controllers/user.controller");
const roleController = require("./controllers/role.controller");
const businessController = require("./controllers/business.controller");
const serviceController = require("./controllers/service.controller");
const appointmentController = require("./controllers/appointment.controller");

const authMiddleware = require("./middleware/auth.middleware");

authMiddleware();

const cors = require("cors");

app.use(passport.initialize());
// passport local strategy
passport.use(new LocalStrategy(UserModel.authenticate()));
// to use with sessions
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

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
