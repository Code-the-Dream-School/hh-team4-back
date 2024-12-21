const mongoose = require("mongoose");

const dispenseLogSchema = new mongoose.Schema(
  {
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: String,
      enum: ["Store 1", "Store 2"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Dispensed Quantity must be at least 1"],
    },
    lotNumber: {
      type: String,
      required: true,
    },
    ndc: {
      type: String,
      required: true,
    },
    dispenseDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DispenseLog", dispenseLogSchema);
