const express = require("express");
const UserModel = require("../schemas/user.schema");
const passport = require("passport");
const app = express();
const jwt = require("jsonwebtoken");
const config = require("../config");

app.get("/", async (req, resp) => {
  try {
    const users = await UserModel.find()
      .populate("roles", "name -_id")
      .select("-password -__v -email._id")
      .lean();
    resp.send(users);
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.post("/create", async (req, resp) => {
  try {
    const { password, ...userInfos } = req.body;
    const user = new UserModel(userInfos);
    const document = await UserModel.register(user, password);
    delete document.hash;
    delete document.salt;
    resp.send(document);
  } catch (e) {
    return resp.status(500).send({ error: e });
  }
});

app.delete("/:id", async (req, resp) => {
  try {
    await UserModel.deleteOne({ _id: req.params.id });
    resp.send({ message: "user deleted" });
  } catch (e) {
    resp.status(500).send({ message: "user cannot be deleted" });
  }
});

// authentication
app.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  async (req, resp) => {
    const user = await UserModel.findOne({ username: req.body.username });

    if (user) {
      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 30 * 60 }); //expires in 30 minutes
      resp.json({ token: token });
    } else {
      resp.json({ error: { message: "user not found" } });
    }
  }
);

app.use(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, resp) => {
    resp.json({
      user: req.user,
      token: req.query.secret_token,
    });
  }
);

module.exports = app;
