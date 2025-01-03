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
        "Analgesic", // pain relievers
        "Antiinflammatory", // reduce inflammation
        "Antibiotic", // treat bacterial infections
        "Antihypertensive", // treat high blood pressure
        "Antidiabetic", // treat diabetes
        "Other",
      ],
      required: [true, "Please select type of Medication"],
    },
    ndcNumber: {
      type: String,
      required: [true, "Please provide NDC Number"],
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the creator's user ID"],
    },
    location: {
      type: String,
      required: [true, "Location value is required"],
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
