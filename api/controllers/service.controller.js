const express = require("express");
const { Service } = require("../schemas/service.schema");
const ServiceModel = require("../schemas/service.schema");
const { ObjectId } = require("mongodb");
const app = express();

// get services by businessId or all services
app.get("/", async (req, resp) => {
  try {
    const businessid = req.query.businessId;
    if (businessid !== undefined && ObjectId.isValid(businessid)) {
      const services = await ServiceModel.find({ business: businessid })
        .select("-__v")
        .lean();

      return resp.send(services);
    } else {
      const services = await ServiceModel.find().select("-__v").lean();

      return resp.send(services);
    }
  } catch (e) {
    resp.send("Something Went Wrong" + e.message);
  }
});

app.post("/create", async (req, resp) => {
  try {
    const service = new ServiceModel(req.body);
    let result = await service.save();
    result = result.toObject();
    if (result) {
      resp.send(result);
    } else {
      console.log("Service already exists");
    }
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

module.exports = app;
