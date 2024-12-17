const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Medication Name"],
    },
    genericName: {
      type: String,
      required: [true, "Please provide Generic Medication Name"],
    },
    lot: {
      type: String,
      required: [true, "Please provide Lot Code"],
      unique: true,
    },
    expirationDate: {
      type: Date,
      required: [true, "Please provide Expiration Date"],
    },
    class: {
      type: String,
      enum: [
        "Antibiotic",
        "Analgesic",
        "Antidepressant",
        "Antiviral",
        "Antifungal",
        "Other",
      ],
      required: [true, "Please select type of Medication"],
    },
    store: {
      type: String,
      ref: "User",
      required: [true, "Please provide Store Name"],
    },
    ndcNumber: {
      type: String,
      required: [true, "Please provide NDC Number"],
      unique: true,
    },
    createdBy: {
      type: String,
      ref: "User",
      required: [true, "Please provide the creator's user ID"],
    },
    threshold: {
      type: Number,
      required: [true, "Please provide Threshold quantity"],
      min: [0, "Threshold must be a non-negative number"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide Quantity"],
      min: [0, "Quantity must be a non-negative number"],
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Medication", medicationSchema);
