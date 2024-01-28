const express = require("express");
const { Business } = require("../schemas/business.schema");
const { Service } = require("../schemas/service.schema");
const BusinessModel = require("../schemas/business.schema");
const ServiceModel = require("../schemas/service.schema");
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
    const businessAndServices = req.body;

    const business = new BusinessModel({
      name: businessAndServices.name,
      description: businessAndServices.description,
      owner: businessAndServices.owner,
    });

    let businessCreated = (await business.save()).toObject();

    if (businessCreated) {
      await Promise.all(
        businessAndServices.prestations.map(async (prestation) =>
          createPrestation(prestation, businessCreated._id)
        )
      );

      resp.send(businessCreated);
    } else {
      console.log("Business already exists");
    }
  } catch (e) {
    resp.send(
      "Something Went Wrong when creating Business and/or Services : " +
        e.message
    );
  }
});

const createPrestation = async (prestation, businessId) => {
  const prestationCreate = new ServiceModel({
    ...prestation,
    business: businessId,
  });

  return await prestationCreate.save();
};

module.exports = app;
