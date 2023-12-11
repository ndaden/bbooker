const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
