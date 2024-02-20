const express = require("express");
const passport = require("passport");
const BusinessModel = require("../schemas/business.schema");
const ServiceModel = require("../schemas/service.schema");
const { storage } = require("../firebase");
const { ref, getDownloadURL, uploadBytes } = require("firebase/storage");

const { ObjectId } = require("mongodb");
const multer = require("multer");

const app = express();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// get business by ownerId or all businesses
app.get("/", async (req, resp) => {
  try {
    /* passport.authenticate("jwt", { session: false }, (err, account) => {
      req.logIn(account, () => {
        console.log(account);
      });
    })(req, resp); */

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

app.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  async (req, resp) => {
    try {
      const businessAndServices = req.body;
      let businessImageUrl = "";

      if (req.file && req.file.buffer) {
        const storageRef = ref(storage, `${req.file.originalname}`);

        const snapshot = await uploadBytes(storageRef, req.file.buffer);
        businessImageUrl = await getDownloadURL(snapshot.ref);
      }

      const business = new BusinessModel({
        name: businessAndServices.name,
        description: businessAndServices.description,
        imageUrl: businessImageUrl,
        owner: businessAndServices.owner,
      });

      let businessCreated = (await business.save()).toObject();

      if (businessCreated) {
        const prestations = JSON.parse(req.body.prestations);
        await Promise.all(
          prestations.map(async (prestation) =>
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
  }
);

const createPrestation = async (prestation, businessId) => {
  const prestationCreate = new ServiceModel({
    ...prestation,
    business: businessId,
  });

  return await prestationCreate.save();
};

module.exports = app;
