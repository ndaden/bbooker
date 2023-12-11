const express = require("express");
const { Business } = require("../schemas/business.schema");
const BusinessModel = require("../schemas/business.schema");
const { ObjectId } = require("mongodb");
const app = express();

// get business by ownerId or all businesses
app.get("/", async (req, resp) => {
  try {
    const ownerid = req.query.ownerid;
    const id = req.query.id;

    if (id !== undefined && ObjectId.isValid(id)) {
      const business = await BusinessModel.find({ _id: id })
        .select("-__v")
        .lean();

      return resp.send(business);
    }

    if (ownerid !== undefined && ObjectId.isValid(ownerid)) {
      const businesses = await BusinessModel.find({ owner: ownerid })
        .select("-__v")
        .lean();

      return resp.send(businesses);
    }

    const businesses = await BusinessModel.find().select("-__v").lean();
    return resp.send(businesses);
  } catch (e) {
    resp.send("Something Went Wrong" + e.message);
  }
});

app.post("/create", async (req, resp) => {
  try {
    const business = new Business(req.body);
    let result = await business.save();
    result = result.toObject();
    if (result) {
      resp.send(req.body);
      console.log(result);
    } else {
      console.log("Business already exists");
    }
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

module.exports = app;
