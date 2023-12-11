const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    business: {
      type: mongoose.Schema.ObjectId,
      ref: "Business",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
