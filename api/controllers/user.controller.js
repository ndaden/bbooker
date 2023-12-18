const express = require("express");
const UserModel = require("../schemas/user.schema");
const bcryptjs = require("bcryptjs");
const app = express();

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
    const user = new UserModel(req.body);
    let result = await user.save();
    result = result.toObject();

    delete result.password;
    resp.send(req.body);
  } catch (e) {
    if (e.errors.username && e.errors.username.kind === "unique") {
      return resp
        .status(500)
        .send({
          error: { username: { message: "username is already taken" } },
        });
    }
    return resp.status(500).send({ error: "cannot create user" });
  }
});

app.post("/authenticate", async (req, resp) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({
      email: email
    })

    if (!user) {
      //if user does not exist responding Authentication Failed
      return resp.status(401).json({
        message: "Authentication Failed",
      })
    }

    const correctPassword = bcryptjs.compare(password, user.password)
    if (correctPassword) {
      return resp.status(200).send({ message: "authentication success" })
    } else {
      return resp.status(401).json({
        message: "Authentication Failed",
      })
    }
  } catch (e) {

    return resp.status(500).send({ error: "cannot authenticate user" });
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

module.exports = app;
