const express = require("express");
const Medication = require("../models/Medication");
const router = express.Router();

// Test MongoDB Connection
router.get("/test-db", async (req, res) => {
  try {
    // Create a test medication
    const testMedication = new Medication({
      name: "Ibuprofen",
      batchCode: "AX12345",
      expirationDate: new Date("2024-01-01"),
      type: "Antiinflammatory",
    });

    // Save to database
    await testMedication.save();

    // Retrieve all medications
    const medications = await Medication.find();

    res.status(200).json({
      message: "Database connection and Medication model are working!",
      medications,
    });
  } catch (error) {
    console.error("Error testing MongoDB connection:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
