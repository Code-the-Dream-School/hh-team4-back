const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Medication Name"],
    },
    batchCode: {
      type: String,
      required: [true, "Please provide Batch Code"],
      unique: true,
    },
    expirationDate: {
      type: Date,
      required: [true, "Please provide Expiration Date"],
    },
    type: {
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
  },
  { timestamps: true }, // adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Medication", medicationSchema);
