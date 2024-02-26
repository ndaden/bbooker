const express = require("express");
const RoleModel = require("../schemas/role.schema");
const app = express();

app.get("/", async (req, resp) => {
  try {
    const roles = await RoleModel.find().select("-__v").lean();
    resp.send(roles);
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.post("/create", async (req, resp) => {
  try {
    const role = new RoleModel(req.body);
    let result = await role.save();
    result = result.toObject();
    if (result) {
      resp.send(result);
    } else {
      console.log("role already exists");
    }
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.delete("/:id", async (req, resp) => {
  try {
    await RoleModel.deleteOne({ _id: req.params.id });
    resp.send({ message: "role deleted" });
  } catch (e) {
    resp.status(500).send({ message: "role cannot be deleted" });
  }
});

module.exports = app;
