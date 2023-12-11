const express = require("express");
const { Appointment } = require("../schemas/appointment.schema");
const AppointmentModel = require("../schemas/appointment.schema");
const { ObjectId } = require("mongodb");
const app = express();

// get services by businessId or all services
app.get("/", async (req, resp) => {
  try {
    const clientid = req.query.clientid;
    const businessid = req.query.businessid;

    // get appointments filtered by businessId
    if (businessid !== undefined && ObjectId.isValid(businessid)) {
      const appointments = await AppointmentModel.find()
        .populate({ path: "service", match: { business: businessid } })
        .select("-__v")
        .lean();

      return resp.send(appointments);
    }

    // get appointments filtered by clientId
    if (clientid !== undefined && ObjectId.isValid(clientid)) {
      const appointments = await AppointmentModel.find({ client: clientid })
        .select("-__v")
        .lean();

      return resp.send(appointments);
    }

    const appointments = await AppointmentModel.find()
      .populate("service", "serviceName")
      .populate("client", "username")
      .select("-__v")
      .lean();

    return resp.send(appointments);
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.post("/create", async (req, resp) => {
  try {
    const appointment = new Appointment(req.body);
    let result = await appointment.save();
    result = result.toObject();
    if (result) {
      resp.send(req.body);
      console.log(result);
    } else {
      console.log("Appointment already exists");
    }
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

module.exports = app;
