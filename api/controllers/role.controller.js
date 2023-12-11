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

module.exports = app;
