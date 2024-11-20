const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batchCode: {
      type: String,
      required: true,
      unique: true,
    },
    expirationDate: {
      type: Date,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Medication", medicationSchema);
